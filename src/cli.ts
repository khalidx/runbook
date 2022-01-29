#!/usr/bin/env node

import { help, ls, run, serve } from './index'
import { setupCompletions } from './features/completions'
import { ApplicationError } from './features/errors'
import debug from './features/debug'

async function cli (args: string[]) {
  const completions = await setupCompletions()
  const command = args.shift()
  if (command === 'ls') return ls()
  if (command === 'run' && args.length > 0) return run(args)
  if (command === 'serve') return serve()
  if (command === 'completions') {
    const action = args.shift()
    if (action === 'set') return completions.set()
    if (action === 'remove') return completions.remove()
  }
  if (command === 'help') return help()
  if (command === undefined) help()
  throw new ApplicationError('Invalid command')
}

cli(process.argv.slice(2)).catch(error => {
  if (error instanceof ApplicationError) console.error(debug ? error : error.message)
  else console.error(error)
  process.exit(1)
})
