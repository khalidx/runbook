import globby from 'globby'
import { readFile, writeFile, unlink, chmod } from 'fs-extra'

export const files = {
  discover: globby,
  read: readFile,
  write: writeFile,
  delete: unlink,
  chmod
}

export default files
