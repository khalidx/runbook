import { dirname, resolve } from 'path'
import { execFileSync } from 'child_process'
import yargs from 'yargs'

import files from './features/files'
import markdown from './features/markdown'
import handlebars from './features/handlebars'
import id from './features/id'
import colors from './features/colors'
import { error } from './features/errors'

export async function ls (options = { log: true }) {
  const markdownFiles = await files.discover(['*.md'])
    .then(paths => Promise.all(paths.map(async path => ({ path, content: await files.read(path, 'utf-8') }))))
    .then(files => files.map(file => ({ ...file, blocks: markdown.blocks(file.content) })))
    .then(files => files.map(file => {
      return {
        ...file,
        commands: file.blocks.filter(block => (block.lang === 'bash' || block.lang === 'hbs') && block.meta?.includes('"')).map(block => {
          const names = block.meta?.match(/"([^"]*)"/g)
          if (names?.length !== 1) throw error(`[${file.path}:${block.position?.start.line}] A code block must have exactly one name`)
          const name = names[0].substring(1, names[0].length - 1)
          const args = handlebars.args(block.value)
          if (options.log) console.log(file.path, '|', colors.green(name), args.map(arg => `--${arg}`).join(' '))
          return {
            name,
            position: block.position,
            script: block.value,
            cwd: dirname(resolve(file.path)),
            template: block.lang === 'hbs' ? handlebars.template(block.value) : undefined,
            args: block.lang === 'hbs' ? args : undefined
          }
        })
      }
    }))
  if (markdownFiles.length === 0) throw error(`No markdown files found in ${process.cwd()}`)
  return markdownFiles
}

export async function run (args: string[]) {
  const argv = yargs(args).argv
  const suggestions = []
  for (let file of await ls({ log: false })) {
    // todo: make this deterministic. no duplicate commands, etc.
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
    return text + '\n' + `${suggestion.file.path} | ${colors.green(suggestion.command.name)} ${suggestion.command.args?.map(arg => `--${arg}`).join(' ')}`
  }, '')
  throw error(`No command found that matches the provided arguments. Here are some suggestions:${suggestionsMessage}`)
}
