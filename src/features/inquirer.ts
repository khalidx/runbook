import { createPrompt, useState, usePrefix, useEffect, useKeypress, usePagination, isUpKey, isDownKey, isEnterKey, isSpaceKey, isBackspaceKey, type Status } from '@inquirer/core'
import figures from '@inquirer/figures'
import chalk from 'chalk'
import fuzzy from 'fuzzy'

type Config = { message?: string, choices: Choice[], renderRow?: Renderer, filterRow?: Filterer }
type Choice = { displayName: string, confirmedName: string, searchText: string, value: unknown }
type Renderer = (params: { choice: Choice, index: number, isActive: boolean, count: number }) => string
type Filterer = (params: { choice: Choice, query: string }) => boolean

type PluginParameters = Parameters<typeof _inquirerSearchListPlugin> extends [infer _Config, ...infer Rest] ? Rest : never
export function inquirerSearchListPlugin <T extends Config> (config: T, ...args: PluginParameters) {
  return _inquirerSearchListPlugin(config, ...args) as ReturnType<ReturnType<typeof createPrompt<T['choices'][number]['value'], T>>>
}

export const _inquirerSearchListPlugin = createPrompt<Config['choices'][number]['value'], Config>((config, done) => {

  if (!config.choices.length) {
    throw new Error('No choices provided. Choices must be an array with at least 1 item.')
  }

  const [status, setStatus] = useState<Status>('idle')
  const [active, setActive] = useState<number>(0)
  const [query, setQuery] = useState<string>('')
  const [rows, setRows] = useState<number>(process.stdout.rows)
  const prefix = usePrefix({ status })

  const renderRow: Renderer = config.renderRow ?? function (params) {
    if (params.isActive) return chalk.cyan(`${params.index + 1} ${figures.pointer} ${params.choice.displayName}`)
    return `  ${params.choice.displayName}`
  }
  
  const filterRow: Filterer = config.filterRow ?? function (params) {
    return fuzzy.test(params.query, params.choice.searchText)
  }

  const message = config.message || 'Select an item'

  const choices = config.choices.filter((choice) => filterRow({ choice, query }))
  
  useEffect(() => {
    const onResize = () => {
      setRows(process.stdout.rows)
    }
    process.stdout.on('resize', onResize)
    return () => process.stdout.removeListener('resize', onResize)
  }, [])

  useKeypress((key) => {
    if (isUpKey(key) || (key.ctrl && key.name === 'p')) {
      if (active > 0) {
        setActive(active - 1)
      }
      return
    }
    if (isDownKey(key) || (key.ctrl && key.name === 'n')) {
      if (active < (choices.length - 1)) {
        setActive(active + 1)
      }
      return
    }
    if (key.ctrl) {
      return
    }
    if (isEnterKey(key)) {
      if (choices[active]) {
        setStatus('done')
        done(choices[active].value)
      }
      return
    }
    if (isSpaceKey(key)) {
      setQuery(query + ' ')
      return
    }
    if (isBackspaceKey(key)) {
      setQuery(query.substring(0, query.length - 1))
      return
    }
    if (/^[a-z0-9]$/i.test(key.name)) {
      // @ts-expect-error
      setQuery(query + (key.sequence || key.name))
      return
    }
  })

  if (status === 'done') {
    return `${prefix} ${chalk.bold(message)} ${chalk.dim('(')}${chalk.cyan(choices[active]!.confirmedName)}${chalk.dim(')')}`
  }

  const terminalSize = rows
  const reservedSize = 2
  const maxPageSize = Math.floor((terminalSize - reservedSize) * 0.75)
  const minPageSize = 1
  const pageSize =
    maxPageSize > minPageSize ? maxPageSize :
    minPageSize
  ;

  if (terminalSize < (minPageSize + reservedSize)) {
    return `${chalk.red('>>')} Your terminal is too small to display this prompt. Resize your terminal.`
  }
  
  const page = usePagination({
    items: choices,
    active,
    renderItem: ({ item, index, isActive }) => renderRow({ choice: item, index, isActive, count: choices.length }),
    pageSize,
    loop: false
  })

  const isLastChoiceSelected = active === choices.length - 1
  const noResultsFound = query.length && choices.length === 0
  const allResultsFit = pageSize >= choices.length

  const top = `${prefix} ${chalk.bold(message)} ${chalk.dim('(press <enter> to submit)')} ${query}`
  const bottom = 
    noResultsFound ? `${chalk.red('>>')} No results found.` :
    (isLastChoiceSelected || allResultsFit) ? chalk.dim('(end)') :
    chalk.dim('(move up and down to reveal more choices)')
  ;

  return [top, [page, bottom].join('\n')]
})
