import { inspect } from 'node:util'
import stripAnsi from 'strip-ansi'

import terminal from '../features/terminal.js'
import directories from '../features/directories.js'
import files from '../features/files.js'
import replace from '../features/replace.js'
import debug from '../features/debug.js'
import { ApplicationError } from '../features/errors.js'

function append (logFilePath: string, level: 'info' | 'error', message?: any, ...optionalParams: any[]) { 
  files.appendSync(logFilePath, level.toUpperCase() + `\t${Date.now()}\t` + [message, ...optionalParams].reduce<string>((message, param) => {
    return (message ? message + '\t' : message) + stripAnsi(typeof param === 'string' ? param : inspect(param)).split('\n').join(`\n${level.toUpperCase()}\t`)
  }, '') + '\n')
}

function getLogger () {
  const dateTime = replace.all(replace.all(new Date().toISOString(), ':', '_'), '.', '_')
  const logFileDirectory = directories.home.path('.runbook/logs/')
  const logFilePath = directories.home.path(`.runbook/logs/debug.log`)
  files.dirSync(logFileDirectory, { recursive: true })
  return {
    meta: {
      dateTime,
      logFileDirectory,
      logFilePath
    },
    interactive: (message?: any, ...optionalParams: any[]): void => {
      if (terminal.is.interactive()) console.info(message, ...optionalParams)
      append(logFilePath, 'info', message, ...optionalParams)
    },
    info: (message?: any, ...optionalParams: any[]): void => {
      console.info(message, ...optionalParams)
      append(logFilePath, 'info', message, ...optionalParams)
    },
    error: (message?: any, ...optionalParams: any[]): void => {
      if (message instanceof ApplicationError) console.error(debug ? message : message.message, ...optionalParams)
      else console.error(message, ...optionalParams)
      append(logFilePath, 'error', message, ...optionalParams)
    },
    errorDebug: (message?: any, ...optionalParams: any[]): void => {
      if (debug) console.error(message, ...optionalParams)
      append(logFilePath, 'error', message, ...optionalParams)
    }
  }
}

const log = getLogger()

export default log
