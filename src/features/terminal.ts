const logo = `
 __             __   __   __
|__) |  | |\\ | |__) /  \\ /  \\ |__/
|  \\ \\__/ | \\| |__) \\__/ \\__/ |  \\
`

export const terminal = {
  is: {
    interactive: process.stdout.isTTY === true
  },
  ascii: {
    art: {
      logo
    }
  }
}

export default terminal
