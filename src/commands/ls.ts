import { dirname, resolve } from 'path'

import files from '../features/files'
import markdown from '../features/markdown'
import handlebars from '../features/handlebars'
import colors from '../features/colors'
import { ApplicationError } from '../features/errors'

import { ensureUniqueBlockSignatures } from '../rules/unique-block-signatures'

export async function ls (options = { log: true, rules: true }) {
  const markdownFiles = await files.discover(['*.md'])
    .then(paths => Promise.all(paths.map(async path => ({ path, content: await files.read(path, 'utf-8') }))))
    .then(files => files.map(file => ({ ...file, blocks: markdown.blocks(file.content) })))
    .then(files => files.map(file => {
      return {
        ...file,
        commands: file.blocks.filter(block => (block.lang === 'bash' || block.lang === 'hbs' || normalizedLang(block) === 'javascript') && block.meta?.includes('"')).map(block => {
          const names = block.meta?.match(/"([^"]*)"/g)
          if (names?.length !== 1) throw new ApplicationError(`[${file.path}:${block.position?.start.line}] A code block must have exactly one name`)
          const name = names[0].substring(1, names[0].length - 1)
          const args = handlebars.args(block.value)
          if (options.log) console.info(file.path, '|', colors.green(name), args.map(arg => `--${arg}`).join(' '))
          return {
            name,
            lang: normalizedLang(block),
            position: block.position,
            script: block.value,
            cwd: dirname(resolve(file.path)),
            template: (block.lang === 'hbs' || block.meta?.startsWith('hbs')) ? handlebars.template(block.value) : undefined,
            args: (block.lang === 'hbs' || block.meta?.startsWith('hbs')) ? args : undefined
          }
        })
      }
    }))
  if (markdownFiles.length === 0) throw new ApplicationError(`No markdown files found in ${process.cwd()}`)
  if (options.rules) ensureUniqueBlockSignatures(markdownFiles)
  return markdownFiles
}

function normalizedLang (block: { lang?: string }) {
  if (block.lang === 'js') return 'javascript'
  return block.lang
}
