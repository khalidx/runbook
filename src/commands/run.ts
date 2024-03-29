import { resolve } from 'path'
import { execFileSync } from 'child_process'
import yargs from 'yargs'
import shell from 'shelljs'

import files from '../features/files'
import id from '../features/id'
import colors from '../features/colors'
import log from '../features/log'
import { ApplicationError } from '../features/errors'

import { ls } from '../commands/ls'

export async function run (args: string[]) {
  const argv = yargs(args).argv
  const suggestions = []
  const { markdownFiles } = await ls({ log: false, rules: true })
  for (let file of markdownFiles) {
    for (let command of file.commands) {
      // name check
      if (command.name !== argv._.join(' ')) continue
      // args check
      const { _, $0, ...options } = argv
      if (command.args.some(arg => !argv[arg]) || Object.keys(options).some(option => !command.args.includes(option))) {
        suggestions.push({ file: { path: file.path }, command })
        continue
      }
      if (command.lang === 'bash' || command.lang === 'hbs') {
        if (!shell.which('bash')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "bash" on this system`)
      } else if (command.lang === 'powershell') {
        if (!shell.which('powershell.exe') && !shell.which('pwsh')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "powershell.exe" on this system`)
      } else if (command.lang === 'javascript') {
        if (!shell.which('node')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "node" on this system`)
      } else if (command.lang === 'typescript') {
        if (!shell.which('node')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "node" on this system`)
        if (!shell.which('npx')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "npx" on this system`)
      } else if (command.lang === 'esm') {
        if (!shell.which('node')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "node" on this system`)
        if (!shell.which('ts-node') && !shell.test('-d', './node_modules/ts-node/')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "ts-node" on this system`)
      } else if (command.lang === 'python') {
        if (!shell.which('python')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "python" on this system`)
      } else if (command.lang === 'go') {
        if (!shell.which('go')) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Could not find "go" on this system`)
      } else throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Unsupported block language: ${command.lang}`)
      log.interactive(`[${file.path}:${command.position?.start.line}] Running ${colors.green(command.name)}`)
      const executableFileName = 'runbook-' + id() +
        (command.lang === 'powershell' ? '.ps1' : '') +
        (command.lang === 'esm' ? '.ts' : '') +
        (command.lang === 'go' ? '.go' : '')
      await files.write(executableFileName, command.template?.(options) || command.script)
      await files.chmod(executableFileName, 0o755)
      try {
        if (command.lang === 'bash' || command.lang === 'hbs') execFileSync(resolve(executableFileName), { stdio: 'inherit' })
        else if (command.lang === 'powershell') execFileSync(shell.which('pwsh') ? 'pwsh' : 'powershell.exe', [ '-File', executableFileName ], { stdio: 'inherit' })
        else if (command.lang === 'javascript') execFileSync('node', [ executableFileName ], { stdio: 'inherit' })
        else if (command.lang === 'typescript') execFileSync('npx', [ 'ts-node', executableFileName ], { stdio: 'inherit' })
        else if (command.lang === 'esm') execFileSync('node', [ '--loader', 'ts-node/esm', executableFileName ], { stdio: 'inherit' })
        else if (command.lang === 'python') execFileSync('python', [ executableFileName ], { stdio: 'inherit' })
        else if (command.lang === 'go') execFileSync('go', [ 'run', executableFileName ], { stdio: 'inherit' })
        else throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Unsupported block language (not executable): ${command.lang}`)
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('Command failed') && error.message.includes(executableFileName)) {
          const { status, pid } = error as { status?: number, pid?: number }
          if (status !== undefined && pid !== undefined) {
            log.errorDebug(error)
            throw new ApplicationError(`[${file.path}:${command.position?.start.line}] Command with pid [${pid}] failed with exit status [${status}]`)
          }
        }
        throw error
      } finally {
        await files.delete(executableFileName)
      }
      return
    }
  }
  if (suggestions.length === 0) {}
  const suggestionsMessage = suggestions.reduce((text, suggestion) => {
    return text + '\n' + `${suggestion.file.path} | ${colors.green(suggestion.command.name)} ${(suggestion.command.args || []).map(arg => `--${arg}`).join(' ')}`
  }, '')
  throw new ApplicationError(`No command found that matches the provided arguments.${suggestionsMessage ? ` Here are some suggestions:${suggestionsMessage}` : ''}`)
}
