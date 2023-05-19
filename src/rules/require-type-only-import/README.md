# ESLint Rule: `type-only-import/require-type-only-import`

The ESLint rule `type-only-import/require-type-only-import` is provided by [`eslint-plugin-type-only-import`](../../../) library.
This rule will trigger on any TypeScript `import` statements with source string literal matching the given pattern, and the statement not being `type`-only.
This kind of transformation is extremely useful when certain packages or source files are meant to only `import`ed as types, not resulting in runtime `import` statements.

Assuming the plugin would be configured to add `type` modifier to all imports/exports which have target string literal matching pattern `*.types` , here are few examples about valid and invalid code
|                     code                      |        is valid         |                                      auto-fixed to                                       |
| :-------------------------------------------: | :---------------------: | :--------------------------------------------------------------------------------------: |
|    `import * as code from "./code.types"`     |           :x:           |                       `import type * as code from "./code.types"`                        |
|       `import * as code from "./code"`        | :ballot_box_with_check: | Target string literal does not match given pattern and thus the statement is unaffected. |
|  `import type * as code from "./code.types"`  |   :white_check_mark:    |                                                                                          |
| `import code, { type X } from "./code.types"` |           :x:           |                 `import type { default as code, X } from "./code.types"`                 |
|   `import code, { X } from "./code.types"`    |           :x:           |                 `import type { default as code, X } from "./code.types"`                 |
|    `import type { X } from "./code.types"`    |   :white_check_mark:    |                                                                                          |
|    `import { type X } from "./code.types"`    |   :white_check_mark:    |                                                                                          |
|       `import code from "./code.types"`       |           :x:           |                  `import type { default as code } from "./code.types"`                   |


Please see the [test file](../__test__/require-type-only-import.spec.ts) for more examples on valid and invalid code.

This rule accepts exactly one option value, which is an object with all properties being optional.
See [options file](../../rule-helpers/options.ts) for JSON schema of the rule, and corresponding TS type.
