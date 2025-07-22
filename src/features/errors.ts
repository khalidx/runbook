export type ApplicationErrorOptions = { exitCode: number }

export class ApplicationError extends Error {
   x: { options: ApplicationErrorOptions }
   constructor (message: string, options?: Partial<ApplicationErrorOptions>) {
    super(message)
    this.x = { options: { exitCode: 1, ...options } }
  }
}
