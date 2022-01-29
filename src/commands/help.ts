import colors from '../features/colors'
import { logo } from '../features/ascii-art'

export function help (options = { log: true }): string {
  const message = colors.blue(logo) + '\n' +
    colors.blue('📂 ls') + '                 | ' + colors.yellow('Lists all commands found in documents in the current directory.') + '\n' +
    colors.blue('🚀 run') + '                | ' + colors.yellow('Runs the specified command.') + '\n' +
    colors.blue('🌐 serve') + '              | ' + colors.yellow('Serves the discovered documentation and commands.') + '\n' +
    colors.blue('🔍 completions set') + '    | ' + colors.yellow('Configures shell autocompletion.') + '\n' +
    colors.blue('🔍 completions remove') + ' | ' + colors.yellow('Removes shell autocompletion.') + '\n' +
    colors.blue('💁 help') + '               | ' + colors.yellow('Shows this help menu.') + '\n'
  if (options.log) console.info(message)
  return message
}
