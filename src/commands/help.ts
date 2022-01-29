import colors from '../features/colors'

export function help (options = { log: true }): string {
  const message = '\n' +
    colors.blue('📂 ls') + '  | ' + colors.yellow('Lists all commands found in documents in the current directory.') + '\n' +
    colors.blue('🚀 run') + ' | ' + colors.yellow('Runs the specified command.') + '\n'
  if (options.log) console.info(message)
  return message
}
