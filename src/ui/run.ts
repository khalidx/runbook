import inquirer from 'inquirer'
import chalk from 'chalk'

import log from '../features/log.js'
import { inquirerSearchListPlugin } from '../features/inquirer.js'

import { ls } from '../commands/ls.js'
import { run } from '../commands/run.js'

export async function render () {
  const { commands } = await ls({ log: false, rules: true })
  console.clear()
  const selectedCommand = await inquirerSearchListPlugin({
    message: 'Select a command to run',
    choices: commands.map(command => ({
      displayName: `[${command.locationAnsi}] ${command.displayAnsi}`,
      confirmedName: command.displayAnsi,
      searchText: command.location + ' ' + command.display + ' ' + command.script,
      value: command
    }))
  })
  const args: string[] = []
  for (const arg of selectedCommand.args) {
    const answer = await inquirer.prompt<{ arg: string }>({
      type: 'input',
      message: `Enter a value for ${chalk.green(`--${arg}`)}`,
      name: 'arg',
      validate: function (value) {
        return value ? true : false
      }
    })
    args.push(`--${arg}`, answer.arg)
  }
  log.interactive('> ' + chalk.green(selectedCommand.name) + ' ' + args.join(' '))
  return run({ args: [ selectedCommand.name, ...args ] })
}
