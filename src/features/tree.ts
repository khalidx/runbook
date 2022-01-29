export type NestedObject = { [key: string]: NestedObject }

function set (parts: string[], result: NestedObject) {
  let map = result
  for (const part of parts) {
    map[part] = map[part] || {}
    map = map[part]
  }
}

export default function tree (data: string[], delimiter: string): NestedObject {
  const result: NestedObject = {}
  data.map(item => item.split(delimiter)).forEach(parts => {
    set(parts, result)
  })
  return result
}
