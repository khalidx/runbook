# usage

> View the raw *markdown* source of this file to understand how to define command blocks.

## a simple command

A fenced code block with language `bash` and a quoted command name.

```bash "hello"
echo "Hello there!"
```

## a templated command

Specify a command template using handlebars `{{ }}` syntax.

Template arguments are automatically converted to CLI arguments!

```hbs "hello"
echo "Hello {{ name }}!"
```

## command overloading

This has the same name as the command above, but has an additional argument (like function overloading).

```hbs "hello"
echo "{{ greeting }} {{ name }}!"
```

## alternative runtimes

When marking code blocks with `bash` or `hbs`, bash is used by default to execute the block content.

Here is an example of using something other than bash (`javascript` in this case) but still using `hbs` for templating the script and passing args.

```javascript hbs "hello with time"
const time = Date.now()
console.log(`{{ greeting }} {{ name }} at ${time}!`)
```

Notice that the block language is `javascript` and is also marked with `hbs` to indicate that it should be templated.

Here's another example, this time using `python`:

```python "hello from python"
print("Hello from python!")
```

Here's another example, this time using `go`:

```go "hello from go"
package main

import "fmt"

func main() {
    fmt.Println("Hello from go!")
}
```

## supported runtimes

Currently, `runbook run` supports the execution of `bash`, `powershell`, `javascript`, `typescript`, `python`, and `go` blocks. Other blocks are ignored.

- `bash` blocks are executed with `bash`
- `powershell` and `ps1` blocks are executed with `pwsh` or `powershell.exe`
- `javascript` and `js` blocks are executed with `node`
- `typescript` and `ts` blocks are executed with `npx ts-node`
- `esm` and `es6` blocks are executed with `node --loader ts-node/esm`
- `python` blocks are executed with `python`
- `go` blocks are executed with `go`

`runbook` expects the required runtime to be installed on the current system. In the future, `runbook` will automatically download and use runtimes that are not already installed locally.

More runtimes are coming soon!

## external content

Rather than embedded some code or a script inside a markdown fenced code block in the document, a block can reference its contents by pointing to a local file that is external to the document.

The following block uses a `file://` reference to load its contents from a local file.

```typescript "hello from an external file" file://src/features/hello.ts
```

## calling other scripts

A runbook script written in `bash` can easily call other runbook scripts.

```bash "calling other scripts"
runbook run hello
runbook run hello --greeting "Hey there" --name "Jim"
```
