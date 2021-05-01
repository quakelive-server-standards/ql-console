"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var ql_api_1 = require("ql-api");
var readline = require("readline");
var commandLineOptions = [
    { name: 'address', type: String, defaultOption: true },
    { name: 'rcon-port', type: Number },
    { name: 'rcon-password', type: String },
    { name: 'stats-port', type: Number },
    { name: 'stats-password', type: String }
];
var options;
try {
    options = commandLineArgs(commandLineOptions, { partial: true });
}
catch (e) {
    console.error(e.message);
    process.exit(1);
}
var address = options['address'];
var rconPort = options['rcon-port'];
var rconPassword = options['rcon-password'];
var statsPort = options['stats-port'];
var statsPassword = options['stats-password'];
if (!address) {
    console.error('No Quake Live server address specified!');
    process.exit(1);
}
if (rconPort) {
    var cli_1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: address + ' '
    });
    cli_1.on('line', function (line) {
        if (line.length == 0) {
            return;
        }
        if (line == 'exit') {
            console.log('Good Game');
            process.exit();
        }
        rcon_1.send(line);
    });
    cli_1.on('close', function () {
        console.log('Good Game');
        process.exit(0);
    });
    // Adjust console.log to properly handle interplay with the prompt
    var log_1 = console.log;
    console.log = function () {
        ;
        cli_1.output.write('\x1b[2K\r');
        log_1.apply(console, Array.prototype.slice.call(arguments));
        cli_1._refreshLine();
    };
    var rcon_1 = new ql_api_1.Rcon(address + ':' + rconPort, 'admin', rconPassword);
    rcon_1.onConnected(function (eventValue, address, error) {
        if (!error) {
            console.log('Rcon connected');
            cli_1.prompt();
        }
        else {
            console.log('There was an error connecting to rcon API ', error);
        }
    });
    // rcon.onConnectDelayed(() => console.log('Delayed connecting to rcon'))
    // rcon.onConnectRetried(() => console.log('Retried connecting to rcon'))
    rcon_1.onMessage(function (message) {
        if (message.length > 0) {
            var str = message.toString();
            // Clean up messages like: broadcast: print "Vote passed.\n"
            if (str.startsWith('broadcast: print "')) {
                str = str.substring(18, str.length - 4);
            }
            // Remove ^7 characters
            str = str.replace(new RegExp('\\^7', 'g'), '');
            console.log(str);
        }
        cli_1.prompt();
    });
    if (rconPassword) {
        console.log("Connecting to rcon " + address + ":" + rconPort + " using password " + rconPassword + "...");
    }
    else {
        console.log("Connecting to rcon " + address + ":" + rconPort + "...");
    }
    rcon_1.connect();
}
if (statsPort) {
    var stats = new ql_api_1.Stats(address + ':' + statsPort, statsPassword);
    stats.onConnected(function (eventValue, address, error) {
        if (!error) {
            console.log('Stats connected');
        }
        else {
            console.error('There was an error connecting to stats API', error);
        }
    });
    // stats.onConnectDelayed(() => console.log('Delayed connecting to stats'))
    // stats.onConnectRetried(() => console.log('Retried connecting to stats'))
    stats.onMatchReport(function (event) {
        if (event.aborted) {
            console.log(now() + " Game was aborted after " + minutesSeconds(event.gameLength));
        }
        console.log(now() + " Game has finished.");
    });
    stats.onMatchStarted(function (event) {
        console.log(now() + " Match in game type " + event.gameType + "/" + event.factory + " on map " + event.map + " has started");
    });
    stats.onPlayerConnect(function (event) {
        console.log(now() + " Player " + event.name + " connected");
    });
    stats.onPlayerDeath(function (event) {
        if (event.killer) {
            console.log(now() + " " + event.killer.name + " fragged " + event.victim.name + " with " + event.killer.weapon);
        }
        else {
            console.log(now() + " " + event.mod + " fragged " + event.victim.name);
        }
    });
    stats.onPlayerDisconnect(function (event) {
        console.log(now() + " Player " + event.name + " disconnected");
    });
    stats.onPlayerMedal(function (event) {
        console.log(now() + " Player " + event.name + " earned medal " + event.medal);
    });
    stats.onPlayerStats(function (event) {
        console.log(now() + " Player " + event.name + " made " + event.kills + " frags and died " + event.deaths + " times which earned her/him rank " + event.rank);
    });
    stats.onPlayerSwitchTeam(function (event) {
        console.log(now() + " Player " + event.name + " switched to team " + event.newTeam);
    });
    stats.onRoundOver(function (event) {
        console.log(now() + " Team " + event.teamWon + " won round " + event.round);
    });
    if (statsPassword) {
        console.log("Connecting to stats " + address + ":" + statsPort + " using password " + statsPassword + "...");
    }
    else {
        console.log("Connecting to stats " + address + ":" + statsPort + "...");
    }
    stats.connect();
}
function now() {
    var date = new Date;
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    return date.getHours() + ":" + minutes + ":" + seconds;
}
function minutesSeconds(seconds) {
    return (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ':' : ':0') + seconds;
}
