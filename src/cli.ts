#!/usr/bin/env node

import { ls, run } from './index'
import { ApplicationError } from './features/errors'

async function cli (args: string[]) {
  const command = args.shift()
  if (command === 'ls') return ls()
  if (command === 'run' && args.length > 0) return run(args)
  throw new ApplicationError('Invalid command')
}

cli(process.argv.slice(2)).catch(error => {
  if (error instanceof ApplicationError) console.error(error.message)
  else console.error(error)
  process.exit(1)
})
