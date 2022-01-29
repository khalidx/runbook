#!/usr/bin/env node

const dev = process.argv.indexOf('--dev')

if (dev > -1 || process.env.DEV !== undefined) {
  process.argv.splice(dev, 1)
  require('ts-node/register')
  require('../src/cli.ts')
} else {
  require('../dist/cli.js')  
}
