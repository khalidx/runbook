import globby from 'globby'
import { ensureDir, ensureDirSync, readFile, writeFile, appendFile, appendFileSync, createWriteStream, unlink, chmod } from 'fs-extra'

export const files = {
  discover: globby,
  dir: ensureDir,
  dirSync: ensureDirSync,
  read: readFile,
  write: writeFile,
  append: appendFile,
  appendSync: appendFileSync,
  createWriteStream,
  delete: unlink,
  chmod
}

export default files
