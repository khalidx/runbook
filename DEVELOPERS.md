# developers

This document is for developers working on the runbook application *itself*. If you're interested in using runbook, see the [README](README.md).

> [!TIP]
>
> You can get started right away with a GitHub Codespace instead of cloning the repository locally!
>
> [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/khalidx/runbook?quickstart=1)

To run without building first, use:

```bash "runbook ls"
npx ts-node src/cli.ts ls  # or any other runbook command
```

To quickly test while developing this package, run:

```bash "runbook run hello"
npx ts-node src/cli.ts run hello --greeting Hey --name Batman
```

Alternatively, the package can be linked and run with the `DEV=true` environment variable to pick up the latest TypeScript source changes without the need to re-link the package.

```bash "link"
npm link
DEV=true runbook run hello --greeting Hey --name Batman
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
exit 1
```
