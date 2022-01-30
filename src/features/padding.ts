export const padding = {
  /**
   * Adds padding to the end of text,
   * or adds a prefix to the beginning and removes text,
   * to return a string with length equal to the expected length.
   */
  for: (text: string, expectedLength: number, prefix: string, paddingCharacter: string) => {
    const difference = text.length - expectedLength
    const isShorter = difference < 0
    const isLonger = difference > 0
    if (isShorter) {
      let newText = text
      for (let i = 0; i < Math.abs(difference); i++) {
        newText += paddingCharacter[0]
      }
      return newText
    }
    if (isLonger) {
      return prefix + text.substring(prefix.length + difference)
    }
    return text
  }
}

export default padding
