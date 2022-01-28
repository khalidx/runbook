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

```python "another hello"
print("Hello again!")
```

## supported runtimes

Currently, `runbook run` only supports the execution of `bash` and `javascript` blocks. Other blocks are ignored.

- `bash` blocks are executed with `bash`
- `javascript` and `js` blocks are executed with `node`
- `python` blocks are executed with `python`

`runbook` expects the required runtime to be installed on the current system. In the future, `runbook` will automatically download and use runtimes that are not already installed locally.

More runtimes are coming soon!
