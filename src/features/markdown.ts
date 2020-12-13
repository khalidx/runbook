import remark from 'remark'
import visit from 'unist-util-visit'
import { Node } from 'unist'
import { Code } from 'mdast'

export const markdown = {
  /**
   * Discovers nodes in the specified markdown text
   * that match the provided filter.
   */
  nodes: (text: string, filter: (node: Node) => boolean) => {
    const result: Array<Node> = []
    visit(remark().parse(text), (node) => {
      if (filter(node)) result.push(node)
    })
    return result
  },
  /**
   * Discovers fenced code blocks in the specified markdown text.
   */
  blocks: (text: string) => markdown.nodes(text, node => node.type === 'code') as Code[]
}

export default markdown
