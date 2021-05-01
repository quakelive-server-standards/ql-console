import * as commandLineArgs from 'command-line-args'
import { MatchReportEvent, MatchStartedEvent, PlayerConnectEvent, PlayerDeathEvent, PlayerDisconnectEvent, PlayerMedalEvent, PlayerStatsEvent, PlayerSwitchTeamEvent, Rcon, RoundOverEvent, Stats } from 'ql-api'
import * as readline from 'readline'

let commandLineOptions = [
  { name: 'address', type: String, defaultOption: true } as commandLineArgs.OptionDefinition,
  { name: 'rcon-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'rcon-password', type: String } as commandLineArgs.OptionDefinition,
  { name: 'stats-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'stats-password', type: String } as commandLineArgs.OptionDefinition,
  { name: 'full-stats', type: Boolean, default: false } as commandLineArgs.OptionDefinition
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
let fullStats = options['full-stats']

if (! address) {
  console.error('No Quake Live server address specified!')
  process.exit(1)
}

if (fullStats) {
  console.log('Diplaying full stats...')
}

if (rconPort) {
  let cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${address}:${rconPort} `
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
  
      // Resolve colors
      str = str.replace(new RegExp('\\^0', 'g'), resolveColor('white'))
      str = str.replace(new RegExp('\\^1', 'g'), resolveColor('red'))
      str = str.replace(new RegExp('\\^2', 'g'), resolveColor('gree'))
      str = str.replace(new RegExp('\\^3', 'g'), resolveColor('yellow'))
      str = str.replace(new RegExp('\\^4', 'g'), resolveColor('blue'))
      str = str.replace(new RegExp('\\^5', 'g'), resolveColor('magenta'))
      str = str.replace(new RegExp('\\^6', 'g'), resolveColor('cyan'))
      str = str.replace(new RegExp('\\^7', 'g'), resolveColor('black'))
      
      console.log(`[${now()}] ${str}`)
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
    if (fullStats) {
      console.log(event)
    }
    else {
      if (event.aborted) {
        console.log(`[${now()}] Game of type ${event.factory} was aborted after ${minutesSeconds(event.gameLength)}`)
      }
      else {
        console.log(`[${now()}] Game of type ${event.factory} has finished.`)
      }  
    }
  })
  
  stats.onMatchStarted((event: MatchStartedEvent) => {
    if (fullStats) {
      console.log(fullStats)
    }
    else {
      console.log(`[${now()}] Match in game type ${event.gameType}/${event.factory} on map ${event.map} has started`)
    }
  })
  
  stats.onPlayerConnect((event: PlayerConnectEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Player ${event.name} connected`)
    }
  })
  
  stats.onPlayerDeath((event: PlayerDeathEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      if (event.killer) {
        console.log(`[${now()}] ${event.killer.name} fragged ${event.victim.name} with ${event.killer.weapon}`)
      }
      else {
        console.log(`[${now()}] ${event.mod} fragged ${event.victim.name}`)
      }
    }
  })
  
  stats.onPlayerDisconnect((event: PlayerDisconnectEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Player ${event.name} disconnected`)
    }
  })
  
  stats.onPlayerMedal((event: PlayerMedalEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Player ${event.name} earned medal ${event.medal}`)
    }
  })
  
  stats.onPlayerStats((event: PlayerStatsEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Player ${event.name} made ${event.kills} frags and died ${event.deaths} times which earned her/him rank ${event.rank}`)
    }
  })
  
  stats.onPlayerSwitchTeam((event: PlayerSwitchTeamEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Player ${event.name} switched to team ${event.newTeam}`)
    }
  })
  
  stats.onRoundOver((event: RoundOverEvent) => {
    if (fullStats) {
      console.log(event)
    }
    else {
      console.log(`[${now()}] Team ${event.teamWon} won round ${event.round}`)
    }
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

function resolveColor(colorName: string): string {
  switch (colorName) {
    case 'reset': return '\x1b[0m'
    case 'bright': return '\x1b[1m'
    case 'dim': return '\x1b[2m'
    case 'underscore': return '\x1b[4m'
    case 'blink': return '\x1b[5m'
    case 'reverse': return '\x1b[7m'
    case 'hidden': return '\x1b[8m'
    
    case 'black': return '\x1b[30m'
    case 'red': return '\x1b[31m'
    case 'green': return '\x1b[32m'
    case 'yellow': return '\x1b[33m'
    case 'blue': return '\x1b[34m'
    case 'magenta': return '\x1b[35m'
    case 'cyan': return '\x1b[36m'
    case 'white': return '\x1b[37m'
    
    case 'bgBlack': return '\x1b[40m'
    case 'bgRed': return '\x1b[41m'
    case 'bgGreen': return '\x1b[42m'
    case 'bgYellow': return '\x1b[43m'
    case 'bgBlue': return '\x1b[44m'
    case 'bgMagenta': return '\x1b[45m'
    case 'bgCyan': return '\x1b[46m'
    case 'bgWhite': return '\x1b[47m'
    default: return ''
  }
}