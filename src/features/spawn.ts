import { spawn } from 'node:child_process'
import { PassThrough } from 'node:stream'
import { text } from 'stream/consumers'

export function spawnPlus (command: string, args: string[], options?: Partial<{ env: Record<string, string | undefined> }>) {
  const child = options?.env
    ? spawn(command, args, { env: options.env })
    : spawn(command, args)
  ;
  const childPromise = new Promise<{
    code: number | null
    signal: NodeJS.Signals | null
    error?: Error
  }>((resolve, reject) => {
    child.on('error', (error) => reject(error))
    child.on('close', (code, signal) => resolve({ code, signal }))
  })
  return {
    spawned: {
      child,
      childPromise,
      stdout: {
        text: () => text(child.stdout)
      },
      stderr: {
        text: () => text(child.stderr)
      },
      merged: {
        text: () => {
          const merged = new PassThrough()
          child.stdout.pipe(merged)
          child.stderr.pipe(merged)
          return text(merged)
        }
      }
    }
  }
}

export default spawnPlus
