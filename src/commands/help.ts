import terminal from '../features/terminal.js'
import log from '../features/log.js'

import chalk from 'chalk'

export function help (options = { log: true }): string {
  const message = chalk.blue(terminal.ascii.art.logo) + '\n' +
    chalk.blue('📂 ls') + '                 | ' + chalk.yellow('Lists all commands found in documents in the current directory.') + '\n' +
    chalk.blue('🚀 run') + '                | ' + chalk.yellow('Runs the specified command.') + '\n' +
    chalk.blue('🌐 serve') + '              | ' + chalk.yellow('Serves the discovered documentation and commands.') + '\n' +
    chalk.blue('🔍 completions') + '        | ' + chalk.yellow('Configures shell autocompletion.') + '\n' +
    chalk.blue('💁 help') + '               | ' + chalk.yellow('Shows this help menu.') + '\n'
  if (options.log) log.info(message)
  return message
}
