import { execFileSync, type StdioOptions } from 'node:child_process'
import chalk from 'chalk'
import minimist from 'minimist'
import which from 'which'

import files from '../features/files.js'
import id from '../features/id.js'
import log from '../features/log.js'
import { ApplicationError } from '../features/errors.js'

import { ls } from '../commands/ls.js'
import padding from '../features/padding.js'

const w = (command: string) => which.sync(command, { nothrow: true }) ? true : false

export async function run (params: { args: string[], options?: Partial<{ stdio: StdioOptions, log: false }> }) {
  const argv = minimist(params.args)
  const suggestions = []
  const { commands } = await ls({ log: false, rules: true })
  for (let command of commands) {
    // name check
    if (command.name !== argv._.join(' ')) {
      if (command.name.split(' ').some(word => argv._.includes(word))) {
        suggestions.push({ command })
      }
      continue
    }
    // args check
    const { _, '--': unused, ...options } = argv
    if (command.args.some(arg => !options[arg]) || Object.keys(options).some(option => !command.args.includes(option))) {
      suggestions.push({ command })
      continue
    }
    if (command.lang === 'bash' || command.lang === 'hbs') {
      if (!w('bash')) throw new ApplicationError(`[${command.location}] Could not find "bash" on this system`)
    } else if (command.lang === 'powershell') {
      if (!w('powershell.exe') && !w('pwsh')) throw new ApplicationError(`[${command.location}] Could not find "powershell.exe" on this system`)
    } else if (command.lang === 'javascript') {
      if (!w('node')) throw new ApplicationError(`[${command.location}] Could not find "node" on this system`)
    } else if (command.lang === 'typescript') {
      if (!w('bun')) throw new ApplicationError(`[${command.location}] Could not find "bun" on this system`)
    } else if (command.lang === 'esm') {
      if (!w('bun')) throw new ApplicationError(`[${command.location}] Could not find "bun" on this system`)
    } else if (command.lang === 'python') {
      if (!w('python')) throw new ApplicationError(`[${command.location}] Could not find "python" on this system`)
    } else if (command.lang === 'go') {
      if (!w('go')) throw new ApplicationError(`[${command.location}] Could not find "go" on this system`)
    } else throw new ApplicationError(`[${command.location}] Unsupported block language: ${command.lang}`)
    if (params.options?.log !== false) {
      log.interactive(
        `[${command.locationAnsi}] ${command.displayAnsi} (${chalk.blue.italic('running')})` + '\n' +
        `[${command.locationAnsi}] ${command.displayAnsi} (${chalk.blue.italic(command.lang)}) ${chalk.gray(padding.middle(JSON.stringify(command.script), 72, '...', ' '))}`
      )
    }
    const executableFileName = 'runbook-' + id() + (
      (command.lang === 'bash' || command.lang === 'hbs') ? '.sh' :
      (command.lang === 'powershell') ? '.ps1' :
      (command.lang === 'javascript') ? '.js' :
      (command.lang === 'typescript') ? '.ts' :
      (command.lang === 'esm') ? '.ts' :
      (command.lang === 'python') ? '.py' :
      (command.lang === 'go') ? '.go' :
      ''
    )
    await files.write(executableFileName, command.template?.(options) || command.script)
    try {
      const stdio = params.options?.stdio ?? 'inherit'
      if (command.lang === 'bash' || command.lang === 'hbs') execFileSync('bash', [ executableFileName ], { stdio })
      else if (command.lang === 'powershell') execFileSync(w('pwsh') ? 'pwsh' : 'powershell.exe', [ '-File', executableFileName ], { stdio })
      else if (command.lang === 'javascript') execFileSync('node', [ executableFileName ], { stdio })
      else if (command.lang === 'typescript') execFileSync('bun', [ 'run', executableFileName ], { stdio })
      else if (command.lang === 'esm') execFileSync('bun', [ 'run', executableFileName ], { stdio })
      else if (command.lang === 'python') execFileSync('python', [ executableFileName ], { stdio })
      else if (command.lang === 'go') execFileSync('go', [ 'run', executableFileName ], { stdio })
      else throw new ApplicationError(`[${command.location}] Unsupported block language (not executable): ${command.lang}`)
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && 'pid' in error) {
        if ((error.status === null || typeof error.status === 'number') && typeof error.pid === 'number') {
          log.errorDebug(error)
          throw new ApplicationError(`[${command.location}] Command with pid [${error.pid}] failed with exit status [${error.status}]`, { exitCode: error.status ?? 1 })
        }
      }
      throw error
    } finally {
      await files.delete(executableFileName)
    }
    return
  }
  if (suggestions.length > 0 && params.options?.log !== false) {
    const suggestionsMessage = suggestions.reduce((text, suggestion) => {
      return text + '\n' + `[${suggestion.command.locationAnsi}] ${suggestion.command.displayAnsi}`
    }, '')
    log.interactive(`Here are some suggestions:${suggestionsMessage}`)
  }
  throw new ApplicationError('No command found that matches the provided arguments')
}
