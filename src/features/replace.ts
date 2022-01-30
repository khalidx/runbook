export const replace = {
  all: (input: string, searchValue: string, replaceValue: string): string => {
    return input.split(searchValue).join(replaceValue)
  }
}

export default replace
