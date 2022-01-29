import omelette from 'omelette'

import tree from '../features/tree'

import { ls } from '../commands/ls'

export async function setupCompletions () {
  const { commandList } = await ls({ log: false, rules: true })
  const completion = omelette('runbook|r').tree({
    'ls': {},
    'run': tree(commandList, ' '),
    'serve': {},
    'completions': {
      'set': {},
      'remove': {}
    },
    'help': {}
  } as any) // the type in the @types/omelette package is incorrect, so we cast to any
  completion.init()
  return {
    set: () => {
      process.on('exit', (code) => {
        if (code === 0) console.info('Done. Spawn a new shell to start using autocomplete.')
      })
      completion.setupShellInitFile()
    },
    remove: () => {
      process.on('exit', (code) => {
        if (code === 0) console.info('Done. Spawn a new shell to continue without autocomplete.')
      })
      completion.cleanupShellInitFile()
    }
  }
}
