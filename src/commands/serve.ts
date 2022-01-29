import { basename } from 'path'
import Koa from 'koa'
import KoaRouter from '@koa/router'

import colors from '../features/colors'
import html from '../features/html'

import { ls } from '../commands/ls'

export async function serve () {
  const router = new KoaRouter()
  const navigation = await buildNavigation()
  for (let page of navigation) {
    router.get(page.url, ctx => {
      ctx.body = page.rendered
    })
  }
  const home = buildIndexPage(navigation)
  router.get('/', ctx => {
    ctx.body = home
  })
  const port = 3000
  const app = new Koa()
  app.use(router.routes()).use(router.allowedMethods())
  app.listen(port, () => {
    console.info(`${colors.blue('runbook')} is listening on port ${port} ...`)
  })
}

async function buildNavigation () {
  const { markdownFiles } = await ls({ log: false, rules: true })
  return Promise.all(markdownFiles.map(async file => {
    const rendered = await html.from(file.content)
    const name = basename(file.path)
    return {
      name,
      url: '/' + name,
      rendered,
      file
    }
  }))
}

function buildIndexPage (pages: Array<{ name: string, url: string, file: { path: string, commands: Array<{ display: string }> } }>): string {
  const documentList = pages.reduce((documentList, page) => {
    return documentList + `<li><a href="${page.url}">${page.name}</a></li>\n`
  }, '')
  const commandList = pages.reduce((commandList, page) => {
    return commandList + page.file.commands.reduce((commands, command) => {
      return commands + `<li><a href="${page.url}">${page.name}</a> | ${command.display}</li>`
    }, '')
  }, '')
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>Documentation</title>
      </head>
      <body>
        <h3>Documents</h3>
        <ul>${documentList}</ul>
        <h3>Commands</h3>
        <ul>${commandList}</ul>
      </body>
    </html>
  `
}
