export const plural = {
  form (singular: string, plural: string, actual: number) {
    return (actual === 1) ? singular : plural
  },
  s (singular: string, actual: number) {
    return plural.form(singular, singular + 's', actual)
  }
}

export default plural
