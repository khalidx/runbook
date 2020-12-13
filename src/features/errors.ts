export class ApplicationError extends Error {
  constructor (message: string) {
    super(message)
  }
}

export function error (message: string): ApplicationError {
  return new ApplicationError(message)
}
