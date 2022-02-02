export const padding = {
  /**
   * Adds the padding character to the end of the string N times.
   */
  padEnd: (text: string, paddingCharacter: string, times: number): string => {
    let newText = text
    for (let i = 0; i < times; i++) {
      newText += paddingCharacter[0]
    }
    return newText
  },
  /**
   * Adds padding to the end of text,
   * or adds a prefix to the beginning and removes text,
   * to return a string with length equal to the expected length.
   */
  prefix: (text: string, expectedLength: number, prefix: string, paddingCharacter: string): string => {
    const difference = text.length - expectedLength
    const isShorter = difference < 0
    const isLonger = difference > 0
    if (isShorter) return padding.padEnd(text, paddingCharacter, Math.abs(difference))
    if (isLonger) return prefix + text.substring(prefix.length + difference)
    return text
  },
  /**
   * Adds padding to the end of text,
   * or replaces the middle of the text with the provided string,
   * to return a string with length equal to the expected length.
   */
  middle: (text: string, expectedLength: number, middle: string, paddingCharacter: string): string => {
    const difference = text.length - expectedLength
    const isShorter = difference < 0
    const isLonger = difference > 0
    if (isShorter) return padding.padEnd(text, paddingCharacter, Math.abs(difference))
    if (isLonger) {
      const center = Math.floor((text.length - middle.length - difference) / 2)      
      return text.substring(0, center) + middle + text.substring(center + middle.length + difference)
    }
    return text
  }
}

export default padding
