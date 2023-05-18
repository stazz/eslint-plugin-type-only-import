# Import/Export Type-only Fixer - ESLint Plugin
- [Import/Export Type-only Fixer - ESLint Plugin](#importexport-type-only-fixer---eslint-plugin)
- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Options](#options)
- [Rules](#rules)

# Overview

The ESLint plugin `eslint-plugin-type-only-import` allows automation of managing `type` modifier for imports/exports matching a given pattern.
If such import/export is detected, and it doesn't have `type` modifier (either fully or any of its components), this plugin will attempt to fix the situation by adding `type` modifier to the import/export.

The most typical usecase for this plugin is when one is creating a library with TypeScript, and it has some files which should contain only types.
One option is to use `.d.ts` extension, but that has special meaning in TypeScript, causing e.g. compiler to leave that file out from the final emitting result.
And if just using `.ts` extension, then e.g. code coverage tools will report those files as not covered.

The approach support by this plugin and which also fits nice with code coverage tools, is that these types-only `.ts` files will have some certain naming pattern, e.g. `xyz.types.ts`.
The code coverage tools can be configured to exclude such files from their analysis, and this ESLint plugin can be configured to enforce `type` modifier for any `import` or `export` statements that target such files.

Assuming the plugin would be configured to add `type` modifier to all imports/exports which have target string literal matching pattern `*.types` , here are few examples about valid and invalid code
|                        code                        |        is valid         |                                                                                 auto-fixed to                                                                                 |
| :------------------------------------------------: | :---------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|       `import * as code from "./code.types"`       |           :x:           |                                                                  `import type * as code from "./code.types"`                                                                  |
|          `import * as code from "./code"`          | :ballot_box_with_check: |                                           Target string literal does not match given pattern and thus the statement is unaffected.                                            |
|    `import type * as code from "./code.types"`     |   :white_check_mark:    |                                                                                                                                                                               |
| `import * as code, { type X } from "./code.types"` |           :x:           |                                                            `import type * as code, { type X } from "./code.types"`                                                            |
| `import type * as code, { X } from "./code.types"` |           :x:           |                                                            `import type * as code, { type X } from "./code.types"`                                                            |
|      `import type { X } from "./code.types"`       |   :white_check_mark:    |                                                                                                                                                                               |
|      `import { type X } from "./code.types"`       |   :white_check_mark:    |                                                                                                                                                                               |
|         `import code from "./code.types"`          |           :x:           | `import type * as code from "./code.types"` Technically, could be `import type { default } from "./code.types"`, but types-only files pretty much never have default exports. |
|           `export * from "./code.types"`           |           :x:           |                                                                      `export type * from "./code.types"`                                                                      |
|         `export { X } from "./code.types"`         |           :x:           |                                                                    `export type { X } from "./code.types"`                                                                    |

# Installation
Assuming that ESLint has already been installed
```sh
yarn add --dev eslint@latest
```
, install this plugin:
```sh
yarn add --dev eslint-plugin-type-only-import@latest
```

# Configuration
In the `plugins` section of the [ESLint configuration](https://eslint.org/docs/latest/use/configure), specify the newly installed plugin:
```json
{
  "plugins": [
    "type-only-import"
  ]
}
```

Then, extend the recommended set (which configures both rules of this plugin to be treated as `error`):
```json
{
  "extends": [
    "plugin:type-only-import/recommended"
  ]
}
```

Alternatively, it is possible to configure each rule individually:
```javascript
{
  "rules": {
    "type-only-import/require-type-only-import": "error", // Recommended
    "type-only-import/require-type-only-import": "error" // Recommented
  }
}
```

# Options
Both rules exposed by this plugin take optional individual options.
These options adher to single schema, which is a **JSON object** with the following properties:
- `pattern` of type `string` : the pattern, as `RegExp` source, to match the import/export target string literals against.
  Is treated verbatim, so to match relative-only imports/exports, use `\.` as first character.
  If using extensions in imports/exports, these must be included here too.
  Default: `\..+\.types$`.

For more information, see [JSON schema specification and TS type in source code](./src/rule-helpers/options.ts).

# Rules
All of the rules currently are fixable, and can be fixed automatically by running ESLint CLI with `--fix` flag.

|    recommended     | fixable  |                               rule                               |                             description                             |
| :----------------: | :------: | :--------------------------------------------------------------: | :-----------------------------------------------------------------: |
| :white_check_mark: | :wrench: | [require-type-only-export](./src/rules/require-type-only-export) | Checks and fixes the target string literals in `export` statements. |
| :white_check_mark: | :wrench: | [require-type-only-import](./src/rules/require-type-only-import) | Checks and fixes the target string literals in `import` statements. |
