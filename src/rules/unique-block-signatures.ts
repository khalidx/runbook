import { ApplicationError } from '../features/errors.js'

export function ensureUniqueBlockSignatures (params: { commands: Array<{ signature: string, location: string }> }) {
  const signatures = new Map<string, { location: string }>()
  params.commands.forEach(command => {
    const existing = signatures.get(command.signature)
    if (existing) throw new ApplicationError(`[${command.location}] A code block must have a unique signature (conflicts with [${existing.location}])`)
    signatures.set(command.signature, { location: command.location })
  })
}
