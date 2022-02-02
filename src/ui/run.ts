import inquirer from 'inquirer'

import colors from '../features/colors'
import log from '../features/log'

import { ls } from '../commands/ls'
import { run } from '../commands/run'

export async function render () {
  console.clear()
  inquirer.registerPrompt('search-list', require('inquirer-search-list'))
  const { commands } = await ls({ log: false, rules: true })
  return inquirer
  .prompt<{ command: string[] }>([
    {
      type: 'search-list',
      message: 'Select a command to run',
      name: 'command',
      choices: commands.map(command => ({ name: command.display, value: [command.name, ...command.args] })),
      validate: function (answer) {
        return true
      }
    }
  ])
  .then(async (answers) => {
    const args: string[] = [ answers.command[0] ]
    for (let arg = 1; arg < answers.command.length; arg++) {
      const answer = await inquirer.prompt<{ arg: string }>({
        type: 'input',
        message: `Enter a value for ${colors.green(`--${answers.command[arg]}`)}`,
        name: 'arg',
        validate: function (input, answers) {
          return input ? true : false
        }
      })
      args.push(`--${answers.command[arg]}`)
      args.push(answer.arg)
    }
    log.interactive('> ' + colors.green(args.join(' ')))
    return run(args)
  })
}
