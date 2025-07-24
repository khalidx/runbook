const logo = `
 __             __   __   __
|__) |  | |\\ | |__) /  \\ /  \\ |__/
|  \\ \\__/ | \\| |__) \\__/ \\__/ |  \\
`

export const terminal = {
  is: {
    interactive: () => process.stdout.isTTY === true || process.env['FORCE_INTERACTIVE'] ? true : false
  },
  ascii: {
    art: {
      logo
    }
  }
}

export default terminal
