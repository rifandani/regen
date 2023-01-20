# ⚛ `@rifandani/regen` ⚛

## Introduction

"Regen" is an abbreviation of "React Generator". Regen is a Command Line Interface (CLI) program to generate react component, custom hooks, view model template (VVM, like in MVVM), store (currently only supports redux), and scaffold/init a new react project.

## Why?

To help speed up productivity in your React projects and stop copying, pasting, and renaming files for each time you want to create a new component, hook, etc.

## Table of Contents

- [How to install](#how-to-install)
- [Config file](#config-file)
- [Generate components](#generate-components)
- [Generate hooks](#generate-hooks)
- [Generate views](#generate-views)
- [Generate stores](#generate-stores)
- [Scaffold project](#scaffold-project)

## How to install?

You can install it like so:

```bash
# as a `devDependencies`
npm i -D @rifandani/regen

# globally
npm i -g @rifandani/regen
```

and run it from the command line:

```bash
# generate a single component `Box`
npx regen component Box
```

## Config File

When you run `regen` within your project for the first time, it will ask you a series of questions to customize the CLI for your project needs (this will create a `regen.json` config file).

Example of the `regen.json` config file:

```json
{
  "usesTypeScript": true,
  "usesCssModule": true,
  "cssPreprocessor": "scss",
  "testLibrary": "Testing Library",
  "component": {
    "default": {
      "path": "src/components",
      "withStyle": true,
      "withLazy": true,
      "withStory": true,
      "withTest": true
    }
  },
  "hook": {
    "default": {
      "path": "src/hooks",
      "withTest": true
    }
  },
  "view": {
    "default": {
      "path": "src/views",
      "withRoute": true,
      "withViewModel": true,
      "withTest": true
    }
  },
  "scaffold": {
    "default": {
      "url": "https://github.com/rifandani/frontend-template-rest.git"
    }
  },
  "store": {
    "default": {
      "path": "src/stores",
      "withTest": true,
      "useEntityAdapter": false
    }
  }
}
```

Or you can find the full example of `regen.json` config file [here](https://github.com/rifandani/regen/blob/main/regen.example.json)

## Generate Components

```bash
npx regen component Box
```

This command will create a folder with your component name within your default (e.g. `src/components`) directory, and its corresponding files.

Example of the generated component files structure:

```
|-- /src
    |-- /components
        |-- /Box
            |-- Box.tsx
            |-- Box.module.scss
            |-- Box.test.tsx
            |-- Box.stories.tsx
            |-- Box.lazy.tsx
```

Check all available command flags:

```bash
npx regen component --help
```

```
Usage: regen component|c [options] <name...>

Creates a new, generic component definition in the given or default project.

Arguments:
  name                       list of component name to be generated

Options:
  -p, --path <path>          The path where the component will be generated (default: "src/components")
  -t, --type <type>          The "component" key/type that you have configured in your config file (default: "default")
  -d, --describe <describe>  The description of the component you want to generate (e.g. Create a counter component that increments by one
                             when I click on the increment button)
  -f, --flat                 Generate the files in the mentioned path insted of creating new folder for it
  -dr, --dry-run             Show what will be generated without writing to disk
  -D, --debug                Output extra debugging data
  --withStyle <withStyle>    With corresponding Style file. (default: true)
  --withTest <withTest>      With corresponding Test file. (default: true)
  --withStory <withStory>    With corresponding Story file. (default: true)
  --withLazy <withLazy>      With corresponding Lazy file. (default: true)
  -h, --help                 display help for command
```

## Generate Hooks

```bash
npx regen hook useLatest
```

This command will create a folder with your hook name within your default (e.g. `src/hooks`) directory, and its corresponding files.

Example of the generated hook files structure:

```
|-- /src
    |-- /hooks
        |-- /useLatest
            |-- useLatest.hook.tsx
            |-- useLatest.hook.test.tsx
```

Check all available command flags:

```bash
npx regen hook --help
```

```
Usage: regen hook|h [options] <name...>

Creates a new, generic hook definition in the given or default project.

Arguments:
  name                       list of hook name to be generated

Options:
  -p, --path <path>          The path where the hook will be generated (default: "src/hooks")
  -t, --type <type>          The "hook" key/type that you have configured in your config file (default: "default")
  -d, --describe <describe>  The description of the hook you want to generate (e.g. A hook that returns the latest value, effectively
                             avoiding the closure problem)
  -f, --flat                 Generate the files in the mentioned path insted of creating new folder for it
  -dr, --dry-run             Show what will be generated without writing to disk
  -D, --debug                Output extra debugging data
  --withTest <withTest>      With corresponding Test file. (default: true)
  -h, --help                 display help for command
```

## Generate Views

```bash
npx regen view Dashboard
```

This command will create a folder with your view name within your default (e.g. `src/views`) directory, and its corresponding files.

Example of the generated view files structure:

```
|-- /src
    |-- /views
        |-- /Dashboard
            |-- Dashboard.view.tsx
            |-- Dashboard.route.tsx
            |-- Dashboard.viewModel.tsx
            |-- Dashboard.view.test.tsx
            |-- Dashboard.route.test.tsx
            |-- Dashboard.viewModel.test.tsx
```

Check all available command flags:

```bash
npx regen view --help
```

```
Usage: regen view|v [options] <name...>

Creates a new, generic view definition in the given or default project.

Arguments:
  name                             list of view name to be generated

Options:
  -p, --path <path>                The path where the view will be generated (default: "src/views")
  -t, --type <type>                The "view" key/type that you have configured in your config file (default: "default")
  -f, --flat                       Generate the files in the mentioned path insted of creating new folder for it
  -dr, --dry-run                   Show what will be generated without writing to disk
  -D, --debug                      Output extra debugging data
  --withRoute <withRoute>          With corresponding Route file. (default: true)
  --withViewModel <withViewModel>  With corresponding ViewModel file. (default: true)
  --withTest <withTest>            With corresponding Test file. (default: true)
  -h, --help                       display help for command
```

## Generate Stores

```bash
npx regen store book
```

This command will create a folder with your store name within your default (e.g. `src/stores`) directory, and its corresponding files.

Example of the generated store files structure:

```
|-- /src
    |-- /stores
        |-- /book
            |-- book.store.ts
            |-- book.store.test.ts
```

Check all available command flags:

```bash
npx regen store --help
```

```
Usage: regen store|st [options] <name...>

Creates a new, generic "store" definition in the given or default project.

Arguments:
  name                   list of "store" name to be generated

Options:
  -p, --path <path>      The path where the "store" will be generated (default: "src/stores")
  -t, --type <type>      The "store" key/type that you have configured in your config file (default: "default")
  --useEntityAdapter     Normalize your state shape using entity adapter for each store generated (default: false)
  -f, --flat             Generate the files in the mentioned path insted of creating new folder for it
  -dr, --dry-run         Show what will be generated without writing to disk
  -D, --debug            Output extra debugging data
  --withTest <withTest>  With corresponding Test file. (default: true)
  -h, --help             display help for command
```

## Scaffold Project

```bash
npx regen scaffold
```

This command basically doing a `git clone`. Or you can pass in a custom command like:

```bash
npx regen scaffold "npm create vite@latest my-react-app -- --template react-ts"
```

Check all available command flags:

```bash
npx regen scaffold --help
```

```
Usage: regen scaffold|sc [options] [url]

Init a new project based on a given url.

Arguments:
  url                a url in which will be used to scaffold a new project

Options:
  -t, --type <type>  The "scaffold" key/type that you have configured in your config file (default: "default")
  -dr, --dry-run     Show what will be generated without writing to disk
  -D, --debug        Output extra debugging data
  -h, --help         display help for command
```

## What's Next?

- [ ] support more client state management libraries

## Acknowledgement

Greatly inspired by [generate-react-cli](https://github.com/arminbro/generate-react-cli) project.
