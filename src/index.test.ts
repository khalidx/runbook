import { describe, it } from 'node:test'
import { equal, deepEqual, match } from 'node:assert/strict'
import stripAnsi from 'strip-ansi'

import padding from './features/padding.js'
import plural from './features/plural.js'
import tree from './features/tree.js'
import spawn from './features/spawn.js'

import { ls } from './commands/ls.js'
import { run } from './commands/run.js'

describe('runbook', () => {

  describe('command', () => {

    describe('ls', () => {

      describe('sdk', () => {

        it('can list files', async () => {
          const { markdownFiles } = await ls({ log: false, rules: true })
          equal(markdownFiles.length, 4)
        })
      
        it('can list commands', async () => {
          const { markdownFiles, commands } = await ls({ log: false, rules: true })
          const commandsFound = markdownFiles.flatMap(file => file.commands)
          equal(commandsFound.length, 27)
          equal(commandsFound.length, commands.length)
        })

      })

    })

    describe('run', () => {

      describe('sdk', () => {

        it('can run a command programmatically', async () => {
          const command = 'hello'
          run({ args: [ command ], options: { stdio: 'ignore', log: false } })
        })

      })

      describe('cli', () => {

        it('can run a command', async () => {
          const command = 'hello'
          const { spawned } = spawn('node', [ 'dist/cli.js', 'run', command ])
          const stdout = await spawned.stdout.text()
          await spawned.childPromise
          equal(spawned.child.exitCode, 0)
          equal(stdout, 'Hello there!\n')
        })

        it('can run a command interactively', async () => {
          const command = 'hello'
          const { spawned } = spawn('node', [ 'dist/cli.js', 'run', command ], { env: { ...process.env, FORCE_INTERACTIVE: 'true' } })
          const stdout = stripAnsi(await spawned.stdout.text())
          await spawned.childPromise
          equal(spawned.child.exitCode, 0)
          match(stdout, /^\[USAGE.md:\d+\] /)
          equal(stdout.includes(`${command} (running)`), true)
          equal(stdout.endsWith('Hello there!\n'), true)
        })

        it('a failed command exits with whatever status it exited with', async () => {
          const exitCodes = [1, 42]
          for (const exitCode of exitCodes) {
            const command = `this will fail --exitCode ${exitCode}`
            const { spawned } = spawn('node', [ 'dist/cli.js', 'run', ...command.split(' ') ], { env: { ...process.env, FORCE_INTERACTIVE: 'true' } })
            const stderr = stripAnsi(await spawned.stderr.text())
            await spawned.childPromise
            equal(spawned.child.exitCode, exitCode)
            match(stderr, /\[DEVELOPERS.md:\d+\] Command with pid \[\d+\] failed with exit status \[\d+\]\n/)
            equal(stderr.endsWith(`failed with exit status [${exitCode}]\n`), true)
          }
        })

      })

    })

  })

  describe('feature', () => {

    describe('padding', () => {

      describe('prefix', () => {

        it('can pad text if shorter', async () => {
          const text = 'hello'
          const expectedLength = 10
          const padded = padding.prefix(text, expectedLength, '...', ' ')
          equal(padded, 'hello     ')
          equal(padded.length, expectedLength)
        })

        it('can prefix text if longer', async () => {
          const text = '/some/really/long/path'
          const expectedLength = 10
          const padded = padding.prefix(text, expectedLength, '...', ' ')
          equal(padded, '...ng/path')
          equal(padded.length, expectedLength)
        })

        it('returns original text if already at expected length', async () => {
          const text = 'goodbye'
          const expectedLength = text.length
          const padded = padding.prefix(text, expectedLength, '...', ' ')
          equal(padded, text)
        })

      })

      describe('middle', () => {

        it('can pad text if shorter', async () => {
          const text = 'hello'
          const expectedLength = 10
          const padded = padding.middle(text, expectedLength, '...', ' ')
          equal(padded, 'hello     ')
          equal(padded.length, expectedLength)
        })

        it('can replace middle text if longer', async () => {
          const text = '/some/really/long/path'
          const expectedLength = 10
          const padded = padding.middle(text, expectedLength, '...', ' ')
          equal(padded, '/so...path')
          equal(padded.length, expectedLength)
        })

        it('returns original text if already at expected length', async () => {
          const text = 'goodbye'
          const expectedLength = text.length
          const padded = padding.middle(text, expectedLength, '...', ' ')
          equal(padded, text)
        })

      })

    })

    describe('plural', () => {

      it('shows the correct singular text', async () => {
        equal(plural.form('person', 'people', 1), 'person')
        equal(plural.s('team', 1), 'team')
      })

      it('shows the correct plural text', () => {
        equal(plural.form('person', 'people', 0), 'people')
        equal(plural.form('person', 'people', 2), 'people')
        equal(plural.s('team', 0), 'teams')
        equal(plural.s('team', 2), 'teams')
      })

    })

    describe('tree', () => {

      it('can create a tree from a list of strings', async () => {
        deepEqual(
          tree([ 'one.two.three', 'one.two.three', 'one.four.nine', 'three.two' ], '.'),
          {
            one: {
              two: {
                three: {}
              },
              four: {
                nine: {}
              }
            },
            three: {
              two: {}
            }
          }
        )
      })

    })

  })

})
