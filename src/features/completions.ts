import omelette from 'omelette'

import tree from '../features/tree.js'
import log from '../features/log.js'

import { ls } from '../commands/ls.js'

export async function setupCompletions () {
  const { commands } = await ls({ log: false, rules: true })
  const completion = omelette('runbook|rb').tree({
    'ls': {},
    'run': tree(commands.map(command => command.display), ' '),
    'serve': {},
    'completions': {
      'set': {},
      'remove': {}
    },
    'help': {}
  })
  completion.init()
  return {
    set: () => {
      process.on('exit', (code) => {
        if (code === 0) log.info('Done. Spawn a new shell to start using autocomplete.')
      })
      completion.setupShellInitFile()
    },
    remove: () => {
      process.on('exit', (code) => {
        if (code === 0) log.info('Done. Spawn a new shell to continue without autocomplete.')
      })
      completion.cleanupShellInitFile()
    }
  }
}
