#!/usr/bin/env node

import { help, ls, run, serve } from './index'
import { ApplicationError } from './features/errors'

async function cli (args: string[]) {
  const command = args.shift()
  if (command === 'ls') return ls()
  if (command === 'run' && args.length > 0) return run(args)
  if (command === 'serve') return serve()
  if (command === 'help') return help()
  if (command === undefined) help()
  throw new ApplicationError('Invalid command')
}

  cli(process.argv.slice(2)).catch(error => {
    if (error instanceof ApplicationError) console.error(error.message)
    else console.error(error)
    process.exit(1)
  })  
