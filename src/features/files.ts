import { mkdirSync, appendFileSync, createWriteStream } from 'node:fs'
import { mkdir, appendFile, readFile, writeFile, unlink, chmod } from 'node:fs/promises'
import { globby } from 'globby'

export const files = {
  discover: globby,
  dir: mkdir,
  dirSync: mkdirSync,
  read: readFile,
  write: writeFile,
  append: appendFile,
  appendSync: appendFileSync,
  createWriteStream,
  delete: unlink,
  chmod
}

export default files
