# runbook

Executable markdown documents that you can run, template, and share!

<img src="https://raw.githubusercontent.com/khalidx/runbook/main/logo.png" alt="Runbook - Executable markdown documents that you can run, template, and share!" width="350px">

[![npm package version badge](https://img.shields.io/npm/v/@khalidx/runbook.svg?style=flat-square)](https://www.npmjs.com/package/@khalidx/runbook)
[![GitHub last commit badge](https://img.shields.io/github/last-commit/khalidx/runbook.svg?style=flat-square)](https://github.com/khalidx/runbook/commits/main)
[![GitHub license badge](https://img.shields.io/github/license/khalidx/runbook.svg?style=flat-square)](https://github.com/khalidx/runbook/blob/main/LICENSE)

## quickstart

```bash "install"
npm install -g @khalidx/runbook
```

The [USAGE.md](./USAGE.md) file is a runnable markdown document. Check it for some usage examples.

## commands

[ls](#runbook-ls) | [run](#runbook-run)

### runbook ls

Lists all commands found in documents in the current directory.

It discovers files that end in `.md`, parses them, and finds
all fenced code blocks in the file.

It returns a list of "commands", which are any fenced code blocks
that are annotated with a language + a name. Check out the
examples below.

````markdown
```bash "hello"
echo "Hello!"
```

```bash "two plus two"
echo $((2 + 2))
```
````

Running `runbook ls` would output a command list like the following:

```text
document.md | hello
document.md | two plus two
```

Code blocks that are not annotated with `bash` and a quoted name
will be ignored by runbook.

### runbook run

Runs the specified command.

The command must be specified in a markdown document in the current directory.

For example, to run the "hello" command shown above, type:

```bash
runbook run hello
```

## goals

- [x] list all commands found in documents in the current directory
- [x] run a command from a document
- [x] commands can be templated with arguments
- [x] commands can be overloaded
- [x] command suggestions are returned if input doesn't match a command

*Coming soon*

- [ ] if arguments are expected, they are prompted
- [ ] override prompts by passing --json
- [ ] support traditional CLI args and flags, as well as `=`
- [ ] spawned shell should contain all commands already aliased in?
- [ ] option for executing all commands in docker?
- [ ] examples, tests, and full code coverage

## contributing

Open a GitHub issue to report a bug or request a feature!

*For Developers*

To quickly test while developing this package, run:

```bash "test"
npx ts-node src/cli.ts run hello to --greeting Hey --name Batman
```
