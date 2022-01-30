import type { Position } from 'unist'

import { ApplicationError } from '../features/errors'

export function ensureUniqueBlockSignatures (files: Array<{ path: string, commands: Array<{ signature: string, position?: Position }> }>) {
  const signatures = new Map<string, { path: string, position?: Position }>()
  files.forEach(file => {
    file.commands.forEach(command => {
      const existing = signatures.get(command.signature)
      if (existing) throw new ApplicationError(`[${file.path}:${command.position?.start.line}] A code block must have a unique signature (conflicts with [${existing.path}:${existing.position?.start.line}])`)
      signatures.set(command.signature, { path: file.path, position: command.position })
    })
  })
}
