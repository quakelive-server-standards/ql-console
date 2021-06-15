import * as commandLineArgs from 'command-line-args'
import { Rcon, Stats } from 'ql-api'
import { MatchReportEvent, MatchStartedEvent, PlayerConnectEvent, PlayerDeathEvent, PlayerDisconnectEvent, PlayerKillEvent, PlayerMedalEvent, PlayerStatsEvent, PlayerSwitchTeamEvent, RoundOverEvent } from 'ql-stats-model'
import * as readline from 'readline'

let commandLineOptions = [
  { name: 'address', type: String, defaultOption: true } as commandLineArgs.OptionDefinition,
  { name: 'rcon-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'rcon-password', type: String } as commandLineArgs.OptionDefinition,
  { name: 'stats-port', type: Number } as commandLineArgs.OptionDefinition,
  { name: 'stats-password', type: String } as commandLineArgs.OptionDefinition,
  { name: 'full-stats', type: Boolean, default: false } as commandLineArgs.OptionDefinition,
  { name: 'raw-stats', type: Boolean, default: false } as commandLineArgs.OptionDefinition
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
let rawStats = options['raw-stats']

if (! address) {
  console.error('No Quake Live server address specified!')
  process.exit(1)
}

if (fullStats) {
  console.log('Diplaying full stats...')
}

if (rawStats) {
  console.log('Diplaying raw stats...')
}

if (rconPort) {
  let cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${resolveColor('bright')}${address}:${rconPort}${resolveColor('reset')} `,
    removeHistoryDuplicates: true
  })
  
  cli.on('line', (line) => {
    if (line.length == 0) {
      return
    }

    if (line == 'exit') {
      log('Good Game')
      process.exit()
    }
  
    rcon.send(line)
  })
  
  cli.on('close', () => {
    log('\nGood Game')
    process.exit(0)
  })
  
  // Adjust console.log to properly handle interplay with the prompt
  let log = console.log
  console.log = function() {
      ;(cli as any).output.write('\x1b[2K\r')
      log.apply(console, Array.prototype.slice.call(arguments))
      ;(cli as any)._refreshLine()
  }

  let rcon = new Rcon(address + ':' + rconPort, 'admin', rconPassword, {
    reconnect_ivl: 10000
  })

  rcon.onConnected((eventValue, address, error) => {
    if (! error) {
      console.log('Rcon connected')
      rcon.send('gl&hf')
      cli.prompt()
    }
    else {
      console.log('There was an error connecting to rcon API ', error)
    }
  })

  rcon.onConnectRetried(() => console.log(`${resolveColor('bright')}Connecting to rcon failed...${resolveColor('reset')}`))
  
  rcon.onMessage(message => {
    if (message.length > 0) {
      let str = message.toString()

      // Clean up messages like: broadcast: print "Vote passed.\n"
      if (str.startsWith('broadcast: print "')) {
        str = str.substring(18, str.length - 4)
      }
  
      // Resolve colors
      str = str.replace(new RegExp('\\^0', 'g'), resolveColor('black'))
      str = str.replace(new RegExp('\\^1', 'g'), resolveColor('red'))
      str = str.replace(new RegExp('\\^2', 'g'), resolveColor('gree'))
      str = str.replace(new RegExp('\\^3', 'g'), resolveColor('yellow'))
      str = str.replace(new RegExp('\\^4', 'g'), resolveColor('blue'))
      str = str.replace(new RegExp('\\^5', 'g'), resolveColor('magenta'))
      str = str.replace(new RegExp('\\^6', 'g'), resolveColor('cyan'))
      str = str.replace(new RegExp('\\^7', 'g'), resolveColor('white'))
      
      console.log(`[${now()}] (rcon) ${str}`)
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
  let stats = new Stats(address + ':' + statsPort, statsPassword, {
    reconnect_ivl: 10000
  })

  stats.onConnected((eventValue, address, error) => {
    if (! error) {
      console.log('Stats connected')
    }
    else {
      console.error('There was an error connecting to stats API', error)
    }
  })
  
  stats.onConnectRetried(() => console.log(`${resolveColor('bright')}Connecting to stats failed...${resolveColor('reset')}`))

  stats.onMatchReport((event: MatchReportEvent) => {
    if (event.aborted) {
      console.log(`[${now()}] (stats) Game of type ${event.factory} was aborted after ${minutesSeconds(event.gameLength)}`)
    }
    else {
      console.log(`[${now()}] (stats) Game of type ${event.gameType}/${event.factory} has finished.`)
    }

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onMatchStarted((event: MatchStartedEvent) => {
    console.log(`[${now()}] (stats) Match in game type ${event.gameType}/${event.factory} on map ${event.map} has started`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerConnect((event: PlayerConnectEvent) => {
    console.log(`[${now()}] (stats) Player ${event.name} connected`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerDeath((event: PlayerDeathEvent) => {
    if (event.killer) {
      console.log(`[${now()}] (stats) ${event.killer.name} fragged ${event.victim.name} with ${event.killer.weapon}`)
    }
    else {
      console.log(`[${now()}] (stats) ${event.mod} fragged ${event.victim.name}`)
    }

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerDisconnect((event: PlayerDisconnectEvent) => {
    console.log(`[${now()}] (stats) Player ${event.name} disconnected`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerKill((event: PlayerKillEvent) => {
    if (event.killer) {
      console.log(`[${now()}] (stats) ${event.killer.name} fragged ${event.victim.name} with ${event.killer.weapon}`)
    }
    else {
      console.log(`[${now()}] (stats) ${event.mod} fragged ${event.victim.name}`)
    }

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerMedal((event: PlayerMedalEvent) => {
    console.log(`[${now()}] (stats) Player ${event.name} earned medal ${event.medal}`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerStats((event: PlayerStatsEvent) => {
    console.log(`[${now()}] (stats) Player ${event.name} made ${event.kills} frags and died ${event.deaths} times which earned her/him rank ${event.rank}`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onPlayerSwitchTeam((event: PlayerSwitchTeamEvent) => {
    console.log(`[${now()}] (stats) Player ${event.name} switched to team ${event.newTeam}`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })
  
  stats.onRoundOver((event: RoundOverEvent) => {
    console.log(`[${now()}] (stats) Team ${event.teamWon} won round ${event.round}`)

    if (fullStats) {
      console.log(`[${now()}] (stats)`, event)
    }
  })

  stats.onRawQlEvent((event: any) => {
    if (rawStats) {
      console.log(`[${now()}] (stats)`, event)
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
