import { describe, it } from 'mocha'
import { expect } from 'chai'

import { ls } from './commands/ls'
import tree from './features/tree'

describe('runbook', () => {

  describe('command | ls', () => {

    it('can list files', async () => {
      const { markdownFiles } = await ls({ log: false, rules: true })
      expect(markdownFiles.length).to.deep.equal(2)
    })
  
    it('can list commands', async () => {
      const { markdownFiles, commandList } = await ls({ log: false, rules: true })
      const commands = markdownFiles.flatMap(file => file.commands)
      expect(commands.length).to.deep.equal(11)
      expect(commands.length).to.deep.equal(commandList.length)
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
