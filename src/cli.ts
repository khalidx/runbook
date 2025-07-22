#!/usr/bin/env node

import { help, ls, run, serve } from './index.js'
import { setupCompletions } from './features/completions.js'
import { ApplicationError } from './features/errors.js'
import log from './features/log.js'

import chalk from 'chalk'

async function cli (args: string[]) {
  const completions = await setupCompletions()
  const command = args.shift()
  if (command === 'ls') return ls()
  if (command === 'run' && args.length === 0) return import('./ui/run.js').then(ui => ui.render())
  if (command === 'run' && args.length > 0) return run({ args })
  if (command === 'serve') return serve()
  if (command === 'completions') {
    const action = args.shift()
    if (action === 'set') return completions.set()
    if (action === 'remove') return completions.remove()
    log.error(`Usage: ${chalk.blue('runbook')} completions [${chalk.green('set')}|${chalk.gray('remove')}]`)
    throw new ApplicationError('Invalid command')
  }
  if (command === 'help') return help()
  if (command === undefined) help()
  throw new ApplicationError('Invalid command')
}

cli(process.argv.slice(2)).catch(error => {
  log.error(error)
  process.exit(error instanceof ApplicationError ? error.x.options.exitCode : 1)
})
