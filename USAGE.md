# usage

## a simple command

A fenced code block with language `bash` and a quoted command name.

```bash "hello"
echo "Hello there!"
```

## a templated command

Specify a command template using handlebars `{{ }}` sytax.

```hbs "hello to"
echo "Hello {{ name }}!"
```

<!--
You could also specify a javascript template string.

*This feature is not yet supported.*

```js "hello to"
`echo "Hello ${name}"`
```
-->

## command overloading

This is like the command above, but has an additional argument
(like function overloading).

```hbs "hello to"
echo "{{ greeting }} {{ name }}!"
```

<!--
## macro-like templates

*This feature is not yet supported.*

````hbs "hello to"
```bash
echo "Hello {{ name }}!"
```
````

Or, a more presentable syntax:

```hbs bash "hello to"
echo "Hello {{ name }}!"
```
-->
