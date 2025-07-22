import { dirname, resolve } from 'node:path'
import chalk from 'chalk'

import files from '../features/files.js'
import markdown from '../features/markdown.js'
import handlebars from '../features/handlebars.js'
import plural from '../features/plural.js'
import log from '../features/log.js'
import { ApplicationError } from '../features/errors.js'

import { ensureUniqueBlockSignatures } from '../rules/unique-block-signatures.js'

export async function ls (options = { log: true, rules: true }) {
  const markdownFiles = await files.discover(['*.md'])
    .then(paths => Promise.all(paths.map(async path => ({ path, content: await files.read(path, 'utf-8') }))))
    .then(files => files.map(file => ({ ...file, blocks: markdown.blocks(file.content) })))
    .then(files => Promise.all(files.map(async file => {
      return {
        ...file,
        commands: await Promise.all(file.blocks.filter(block => isSupportedBlock({ block }) && block.meta?.includes('"')).map(async block => {
          const location = `${file.path}:${block.position?.start.line}`
          const name = getBlockName({ block: { meta: block.meta, location } })
          const content = await getBlockContent({ block: { meta: block.meta, location, value: block.value } })
          const { args, template } = getBlockArgs({ block, content })
          return {
            location,
            locationAnsi: `${chalk.yellow(file.path)}:${block.position?.start.line}`,
            name,
            lang: normalizedLang(block),
            position: block.position,
            script: content,
            cwd: dirname(resolve(file.path)),
            template,
            args,
            signature: name + '/' + args.length + (args.length > 0 ? (':' + args.join('-')) : ''),
            display: name + (args.length > 0 ? (' ' + args.map(arg => `--${arg}`).join(' ')) : ''),
            displayAnsi: chalk.green(name) + (args.length > 0 ? (' ' + args.map(arg => `--${arg}`).join(' ')) : '')
          }
        }))
      }
    })))
  if (markdownFiles.length === 0) throw new ApplicationError(`No markdown files found in ${process.cwd()}`)
  const commands = markdownFiles.reduce<typeof markdownFiles[0]['commands']>((commands, file) => {
    file.commands.forEach(command => {
      commands.push(command)
      if (options.log) log.info(`[${command.locationAnsi}] ${command.displayAnsi}`)
    })
    return commands
  }, [])
  if (options.rules) ensureUniqueBlockSignatures({ commands })
  if (options.log) log.interactive(chalk.italic(`Discovered ${chalk.green(markdownFiles.length)} ${plural.s('file', markdownFiles.length)} and ${chalk.green(commands.length)} ${plural.s('command', commands.length)}.`))
  return {
    markdownFiles,
    commands
  }
}

function normalizedLang (block: { lang?: string | null }): string | null | undefined {
  if (block.lang === 'ps1') return 'powershell'
  if (block.lang === 'js') return 'javascript'
  if (block.lang === 'ts') return 'typescript'
  if (block.lang === 'es6') return 'esm'
  return block.lang
}

function isSupportedBlock (params: { block: { lang?: string | null }}): boolean {
  const lang = normalizedLang(params.block)
  return (lang === 'bash' || lang === 'hbs' || lang === 'powershell' || lang === 'javascript' || lang === 'typescript' || lang === 'esm' || lang === 'python' || lang === 'go')
}

function getBlockName (params: { block: { meta?: string | null, location: string } }): string {
  const names = params.block.meta?.match(/"([^"]*)"/g)
  if (names?.length !== 1) throw new ApplicationError(`[${params.block.location}] A code block must have exactly one name`)
  const name = names[0].substring(1, names[0].length - 1)
  return name
}

async function getBlockContent (params: { block: { meta?: string | null, location: string, value: string }}): Promise<string> {
  const paths = params.block.meta?.match(/(file):\/\/(.+)/g)
  if (!paths || paths.length === 0) return params.block.value
  if (paths.length !== 1) throw new ApplicationError(`[${params.block.location}] A code block can specify only one file path`)
  if (params.block.value.trim()) throw new ApplicationError(`[${params.block.location}] A code block that specifies a file path must be empty`)
  const path = paths[0].substring('file://'.length)
  return await files.read(path, 'utf-8')
}

function getBlockArgs (params: { block: { meta?: string | null, lang?: string | null }, content: string }): { args: string[], template?: ReturnType<typeof handlebars.template> } {
  if (params.block.lang === 'hbs' || params.block.meta?.startsWith('hbs')) {
    const args = handlebars.args(params.content)
    const template = handlebars.template(params.content)
    return { args, template }
  }
  return { args: [], template: undefined }
}
