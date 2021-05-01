import * as commandLineArgs from 'command-line-args'
import { MatchReportEvent, MatchStartedEvent, PlayerConnectEvent, PlayerDeathEvent, PlayerDisconnectEvent, PlayerMedalEvent, PlayerStatsEvent, PlayerSwitchTeamEvent, Rcon, RoundOverEvent, Stats } from 'ql-api'
import * as readline from 'readline'

let commandLineOptions = [
  { name: 'address', type: String, defaultOption: true } as commandLineArgs.OptionDefinition,
  { name: 'rcon-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'rcon-password', type: String } as commandLineArgs.OptionDefinition,
  { name: 'stats-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'stats-password', type: String } as commandLineArgs.OptionDefinition
]

let options

try {
  options = commandLineArgs(commandLineOptions, { partial: true })
}
catch (e) {
  console.error(e.message)
  process.exit(1)
}

let address = options['address']
let rconPort = options['rcon-port']
let rconPassword = options['rcon-password']
let statsPort = options['stats-port']
let statsPassword = options['stats-password']

if (! address) {
  console.error('No Quake Live server address specified!')
  process.exit(1)
}

if (rconPort) {
  let cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: address + ' '
  })
  
  cli.on('line', (line) => {
    if (line.length == 0) {
      return
    }
  
    if (line == 'exit') {
      console.log('Good Game')
      process.exit()
    }
  
    rcon.send(line)
  })
  
  cli.on('close', () => {
    console.log('Good Game')
    process.exit(0)
  })
  
  // Adjust console.log to properly handle interplay with the prompt
  let log = console.log
  console.log = function() {
      ;(cli as any).output.write('\x1b[2K\r')
      log.apply(console, Array.prototype.slice.call(arguments))
      ;(cli as any)._refreshLine()
  }

  let rcon = new Rcon(address + ':' + rconPort, 'admin', rconPassword)

  rcon.onConnected((eventValue, address, error) => {
    if (! error) {
      console.log('Rcon connected')
      cli.prompt()
    }
    else {
      console.log('There was an error connecting to rcon API ', error)
    }
  })
  
  // rcon.onConnectDelayed(() => console.log('Delayed connecting to rcon'))
  // rcon.onConnectRetried(() => console.log('Retried connecting to rcon'))
  
  rcon.onMessage(message => {
    if (message.length > 0) {
      let str = message.toString()
      
      // Clean up messages like: broadcast: print "Vote passed.\n"
      if (str.startsWith('broadcast: print "')) {
        str = str.substring(18, str.length - 4)
      }
  
      // Remove ^7 characters
      str = str.replace(new RegExp('\\^7', 'g'), '')
  
      console.log(str)
    }
  
    cli.prompt()
  })

  if (rconPassword) {
    console.log(`Connecting to rcon ${address}:${rconPort} using password ${rconPassword}...`)
  }
  else {
    console.log(`Connecting to rcon ${address}:${rconPort}...`)
  }

  rcon.connect()
}

if (statsPort) {
  let stats = new Stats(address + ':' + statsPort, statsPassword)

  stats.onConnected((eventValue, address, error) => {
    if (! error) {
      console.log('Stats connected')
    }
    else {
      console.error('There was an error connecting to stats API', error)
    }
  })
  
  // stats.onConnectDelayed(() => console.log('Delayed connecting to stats'))
  // stats.onConnectRetried(() => console.log('Retried connecting to stats'))
  
  stats.onMatchReport((event: MatchReportEvent) => {
    if (event.aborted) {
      console.log(`${now()} Game was aborted after ${minutesSeconds(event.gameLength)}`)
    }
    console.log(`${now()} Game has finished.`)
  })
  
  stats.onMatchStarted((event: MatchStartedEvent) => {
    console.log(`${now()} Match in game type ${event.gameType}/${event.factory} on map ${event.map} has started`)
  })
  
  stats.onPlayerConnect((event: PlayerConnectEvent) => {
    console.log(`${now()} Player ${event.name} connected`)
  })
  
  stats.onPlayerDeath((event: PlayerDeathEvent) => {
    if (event.killer) {
      console.log(`${now()} ${event.killer.name} fragged ${event.victim.name} with ${event.killer.weapon}`)
    }
    else {
      console.log(`${now()} ${event.mod} fragged ${event.victim.name}`)
    }
  })
  
  stats.onPlayerDisconnect((event: PlayerDisconnectEvent) => {
    console.log(`${now()} Player ${event.name} disconnected`)
  })
  
  stats.onPlayerMedal((event: PlayerMedalEvent) => {
    console.log(`${now()} Player ${event.name} earned medal ${event.medal}`)
  })
  
  stats.onPlayerStats((event: PlayerStatsEvent) => {
    console.log(`${now()} Player ${event.name} made ${event.kills} frags and died ${event.deaths} times which earned her/him rank ${event.rank}`)
  })
  
  stats.onPlayerSwitchTeam((event: PlayerSwitchTeamEvent) => {
    console.log(`${now()} Player ${event.name} switched to team ${event.newTeam}`)
  })
  
  stats.onRoundOver((event: RoundOverEvent) => {
    console.log(`${now()} Team ${event.teamWon} won round ${event.round}`)
  })
  
  if (statsPassword) {
    console.log(`Connecting to stats ${address}:${statsPort} using password ${statsPassword}...`)
  }
  else {
    console.log(`Connecting to stats ${address}:${statsPort}...`)
  }

  stats.connect()  
}

function now() {
  let date = new Date

  let minutes = date.getMinutes().toString().padStart(2, '0')
  let seconds = date.getSeconds().toString().padStart(2, '0')

  return `${date.getHours()}:${minutes}:${seconds}`
}

function minutesSeconds(seconds: number){
  return (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ':' : ':0') + seconds
}