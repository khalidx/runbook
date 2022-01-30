import { homedir } from 'os'
import { join } from 'path'

export const directories = {
  home: {
    path: (p?: string) => p ? join(homedir(), p) : homedir()
  }
}

export default directories
