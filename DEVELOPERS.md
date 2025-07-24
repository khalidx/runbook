# developers

This document is for developers working on the runbook application *itself*. If you're interested in using runbook, see the [README](README.md).

> [!TIP]
>
> You can get started right away with a GitHub Codespace instead of cloning the repository locally!
>
> [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/khalidx/runbook?quickstart=1)

First, install dependencies:

```bash "install dependencies"
npm install
```

To run without building first, you can use `bun`:

```bash "install bun globally"
npm install -g bun
```

```bash "runbook ls with bun"
bun run src/cli.ts -- ls  # or any other runbook command
```

Or, you can use `tsx`:

```bash "runbook ls with tsx"
npx tsx src/cli.ts ls  # or any other runbook command
```

To quickly test while developing this package, run:

```bash "runbook run hello"
bun run src/cli.ts -- run hello --greeting Hey --name Batman
```

Alternatively, the package can be linked and run with the `DEV=true` environment variable to pick up the latest TypeScript source changes without the need to re-link the package.

```bash "link"
npm link
DEV=true runbook run hello --greeting Hey --name Batman
```

When linked, you can use `runbook` and the shorter `rb` commands right in the CLI, just like if you had installed the command globally via `npm`.

To build:

```bash "build"
npm run build
```

Here's some fun - using runbook to run runbook to run the raw TypeScript version of runbook to run the "hello" command.

```bash "runbook inception"
runbook run runbook run hello
```

To run all test cases:

```bash "test"
npm run test
```

Here is a command that always fails (useful for seeing how runbook handles errors):

```bash "this will fail"
runbook run this will fail --exitCode 1
```

```bash hbs "this will fail"
echo 'Failing with {{exitCode}}' && exit {{exitCode}}
```
