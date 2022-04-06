import { dirname, resolve } from 'path'
import type { Position } from 'unist'

import files from '../features/files'
import markdown from '../features/markdown'
import handlebars from '../features/handlebars'
import colors from '../features/colors'
import fonts from '../features/fonts'
import padding from '../features/padding'
import plural from '../features/plural'
import log from '../features/log'
import { ApplicationError } from '../features/errors'

import { ensureUniqueBlockSignatures } from '../rules/unique-block-signatures'

export async function ls (options = { log: true, rules: true }) {
  const markdownFiles = await files.discover(['*.md'])
    .then(paths => Promise.all(paths.map(async path => ({ path, content: await files.read(path, 'utf-8') }))))
    .then(files => files.map(file => ({ ...file, blocks: markdown.blocks(file.content) })))
    .then(files => Promise.all(files.map(async file => {
      return {
        ...file,
        commands: await Promise.all(file.blocks.filter(block => isSupportedBlock({ block }) && block.meta?.includes('"')).map(async block => {
          const name = getBlockName({ file, block })
          const content = await getBlockContent({ file, block })
          const { args, template } = getBlockArgs({ block, content })
          if (options.log) log.info(`${padding.middle(file.path, 12, '...', ' ')} | ${colors.green(name)} ${args.map(arg => `--${arg}`).join(' ')}`)
          return {
            name,
            lang: normalizedLang(block),
            position: block.position,
            script: content,
            cwd: dirname(resolve(file.path)),
            template,
            args,
            signature: name + '/' + args.length + (args.length > 0 ? (':' + args.join('-')) : ''),
            display: name + (args.length > 0 ? (' ' + args.map(arg => `--${arg}`).join(' ')) : '')
          }
        }))
      }
    })))
  if (markdownFiles.length === 0) throw new ApplicationError(`No markdown files found in ${process.cwd()}`)
  if (options.rules) ensureUniqueBlockSignatures(markdownFiles)
  const commands = markdownFiles.reduce<typeof markdownFiles[0]['commands']>((commands, file) => {
    file.commands.forEach(command => {
      commands.push(command)
    })
    return commands
  }, [])
  if (options.log) log.interactive(fonts.italic(`Discovered ${colors.green(markdownFiles.length)} ${plural.s('file', markdownFiles.length)} and ${colors.green(commands.length)} ${plural.s('command', commands.length)}.`))
  return {
    markdownFiles,
    commands
  }
}

function normalizedLang (block: { lang?: string }): string | undefined {
  if (block.lang === 'ps1') return 'powershell'
  if (block.lang === 'js') return 'javascript'
  if (block.lang === 'ts') return 'typescript'
  if (block.lang === 'es6') return 'esm'
  return block.lang
}

function isSupportedBlock (params: { block: { lang?: string }}): boolean {
  const lang = normalizedLang(params.block)
  return (lang === 'bash' || lang === 'hbs' || lang === 'powershell' || lang === 'javascript' || lang === 'typescript' || lang === 'esm' || lang === 'python' || lang === 'go')
}

function getBlockName (params: { file: { path: string }, block: { meta?: string, position?: Position } }): string {
  const names = params.block.meta?.match(/"([^"]*)"/g)
  if (names?.length !== 1) throw new ApplicationError(`[${params.file.path}:${params.block.position?.start.line}] A code block must have exactly one name`)
  const name = names[0].substring(1, names[0].length - 1)
  return name
}

async function getBlockContent (params: { file: { path: string }, block: { meta?: string, position?: Position, value: string }}): Promise<string> {
  const paths = params.block.meta?.match(/(file):\/\/(.+)/g)
  if (!paths || paths.length === 0) return params.block.value
  if (paths.length !== 1) throw new ApplicationError(`[${params.file.path}:${params.block.position?.start.line}] A code block can specify only one file path`)
  if (params.block.value.trim()) throw new ApplicationError(`[${params.file.path}:${params.block.position?.start.line}] A code block that specifies a file path must be empty`)
  const path = paths[0].substring('file://'.length)
  return await files.read(path, 'utf-8')
}

function getBlockArgs (params: { block: { meta?: string, lang?: string }, content: string }): { args: string[], template?: ReturnType<typeof handlebars.template> } {
  if (params.block.lang === 'hbs' || params.block.meta?.startsWith('hbs')) {
    const args = handlebars.args(params.content)
    const template = handlebars.template(params.content)
    return { args, template }
  }
  return { args: [], template: undefined }
}
