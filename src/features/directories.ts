import { homedir } from 'node:os'
import { join } from 'node:path'

export const directories = {
  home: {
    path: (p?: string) => p ? join(homedir(), p) : homedir()
  }
}

export default directories
