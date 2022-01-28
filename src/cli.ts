#!/usr/bin/env node

import { ls, run } from './index'
import colors from './features/colors'
import { ApplicationError } from './features/errors'

async function cli (args: string[]) {
  const command = args.shift()
  if (command === 'ls') return ls()
  if (command === 'run' && args.length > 0) return run(args)
  if (command === undefined) {
    console.info()
    console.info(colors.blue('📂 ls') + '  | ' + colors.yellow('Lists all commands found in documents in the current directory.'))
    console.info(colors.blue('🚀 run') + ' | ' + colors.yellow('Runs the specified command.'))
    console.info()
  }
  throw new ApplicationError('Invalid command')
}

if (require.main === module) {
  cli(process.argv.slice(2)).catch(error => {
    if (error instanceof ApplicationError) console.error(error.message)
    else console.error(error)
    process.exit(1)
  })  
}
