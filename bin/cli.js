#!/usr/bin/env node

if (process.env.DEV !== undefined) {
  require('ts-node/register')
  require('../src/cli.ts')
} else {
  require('../dist/cli.js')  
}
