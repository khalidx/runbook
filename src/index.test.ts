import { describe, it } from 'mocha'
import { expect } from 'chai'

import { ls } from './index'

describe('runbook', () => {

  it('can list files', async () => {
    const files = await ls()
    expect(files.length).to.deep.equal(2)
  })

  it('can list commands', async () => {
    const files = await ls()
    const commands = files.flatMap(file => file.commands)
    expect(commands.length).to.deep.equal(10)
  })

})
