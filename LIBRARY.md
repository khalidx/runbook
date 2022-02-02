# library

A useful library of various scripts that can be ran with the `runbook` CLI.

Make your own library by [installing runbook](README.md#quickstart) and writing your first runnable markdown file!

## networking

**Which process is using a specific port?**

```bash hbs "which process is using"
lsof -i tcp:{{ port }}
```

## encoding

**Encoding a string to a base64 string**

```javascript hbs "encode base64"
console.log(Buffer.from('{{ input }}', 'utf8').toString('base64'))
```

**Decoding a base64 string to the original string**

```javascript hbs "decode base64"
console.log(Buffer.from('{{ input }}', 'base64').toString('utf8'))
```

## security

**Generate a random password**

```bash "generate password"
runbook run generate password --length 20
```

```javascript hbs "generate password"
const { randomFillSync } = require('crypto')

const generatePassword = (
  length = {{ length }},
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) => Array
  .from(randomFillSync(new Uint32Array(length)))
  .map(x => wishlist[x % wishlist.length])
  .join('')

console.log(generatePassword())
```

## fun

**Runbook logo party**

```bash "runbook logo party"
runbook run print runbook logo --times 3
```

Prints the runbook logo X times to the terminal.

```es6 hbs "print runbook logo"
import terminal from './src/features/terminal'

function print (times: number) {
  for (let i = 0; i < times; i++) {
    console.log(terminal.ascii.art.logo)
  }
}

print({{ times }})
```
