import { resolve } from 'path'
import { execFileSync } from 'child_process'
import yargs from 'yargs'
import shell from 'shelljs'

import files from '../features/files'
import id from '../features/id'
import colors from '../features/colors'
import { ApplicationError } from '../features/errors'

import { ls } from '../commands/ls'

export async function run (args: string[]) {
  const argv = yargs(args).argv
  const suggestions = []
  for (let file of await ls({ log: false, rules: true })) {
    // todo: make this deterministic
    for (let command of file.commands) {
      // name check
      if (command.name !== argv._.join(' ')) continue
      // args check
      // todo: may be better to use yargs for everything instead. also even for command syntax in blocks.
      // todo: ensure destructuring only grabs the options (so passing the options to the template later below doesn't introduce undefined behavior)
      const { _, $0, ...options } = argv
      if (command.args?.some(arg => !argv[arg]) || Object.keys(options).some(option => !command.args?.includes(option))) {
        suggestions.push({ file: { path: file.path }, command })
        continue
      }
      if (command.lang === 'bash' || command.lang === 'hbs') {
        if (!shell.which('bash')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "bash" on this system`)
      }
      else throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Unsupported block language: ${command.lang}`)
      console.log(`[${file.path}:${command.position?.start.line}] Running ${colors.green(command.name)}`)
      // todo: can we do without this step? also check compatibility, is linux only?
      const shellScriptFileName = id()
      await files.write(shellScriptFileName, command.template?.(options) || command.script)
      await files.chmod(shellScriptFileName, 0o755)
      try {
        execFileSync(resolve(shellScriptFileName), { stdio: 'inherit' })
      } finally {
        await files.delete(shellScriptFileName)
      }
      return
    }
  }
  if (suggestions.length === 0) {} // todo: get suggestions from available commands
  const suggestionsMessage = suggestions.reduce((text, suggestion) => {
    return text + '\n' + `${suggestion.file.path} | ${colors.green(suggestion.command.name)} ${(suggestion.command.args || []).map(arg => `--${arg}`).join(' ')}`
  }, '')
  throw new ApplicationError(`No command found that matches the provided arguments.${suggestionsMessage ? ` Here are some suggestions:${suggestionsMessage}` : ''}`)
}
