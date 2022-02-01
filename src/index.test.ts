import { describe, it } from 'mocha'
import { expect } from 'chai'

import padding from './features/padding'
import tree from './features/tree'

import { ls } from './commands/ls'

describe('runbook', () => {

  describe('command | ls', () => {

    it('can list files', async () => {
      const { markdownFiles } = await ls({ log: false, rules: true })
      expect(markdownFiles.length).to.deep.equal(2)
    })
  
    it('can list commands', async () => {
      const { markdownFiles, commands } = await ls({ log: false, rules: true })
      const commandsFound = markdownFiles.flatMap(file => file.commands)
      expect(commandsFound.length).to.deep.equal(15)
      expect(commandsFound.length).to.deep.equal(commands.length)
    })

  })

  describe('feature | padding', () => {

    describe('prefix', () => {

      it('can pad text if shorter', async () => {
        const text = 'hello'
        const expectedLength = 10
        const padded = padding.prefix(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal('hello     ')
        expect(padded.length).to.deep.equal(expectedLength)
      })

      it('can prefix text if longer', async () => {
        const text = '/some/really/long/path'
        const expectedLength = 10
        const padded = padding.prefix(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal('...ng/path')
        expect(padded.length).to.deep.equal(expectedLength)
      })

      it('returns original text if already at expected length', async () => {
        const text = 'goodbye'
        const expectedLength = text.length
        const padded = padding.prefix(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal(text)
      })

    })

    describe('middle', () => {

      it('can pad text if shorter', async () => {
        const text = 'hello'
        const expectedLength = 10
        const padded = padding.middle(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal('hello     ')
        expect(padded.length).to.deep.equal(expectedLength)
      })

      it('can replace middle text if longer', async () => {
        const text = '/some/really/long/path'
        const expectedLength = 10
        const padded = padding.middle(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal('/so...path')
        expect(padded.length).to.deep.equal(expectedLength)
      })

      it('returns original text if already at expected length', async () => {
        const text = 'goodbye'
        const expectedLength = text.length
        const padded = padding.middle(text, expectedLength, '...', ' ')
        expect(padded).to.deep.equal(text)
      })

    })

  })

  describe('feature | tree', () => {

    it('can create a tree from a list of strings', async () => {
      expect(tree([ 'one.two.three', 'one.two.three', 'one.four.nine', 'three.two' ], '.')).to.deep.equal({
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
      })
    })

  })

})
