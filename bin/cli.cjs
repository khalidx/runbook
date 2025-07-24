#!/usr/bin/env node

if (process.env.DEV !== undefined) {
  const { resolve } = require('node:path')
  const { execFileSync } = require('node:child_process')
  const entrypoint = resolve(__dirname, '../src/cli.ts') 
  try {
    execFileSync('bun', [ 'run', entrypoint, '--', ...process.argv.slice(2) ], { stdio: 'inherit' })
  } catch (error) {
    process.exitCode = error.status || 1
  }
} else {
  require('../dist/cli.js')
}
