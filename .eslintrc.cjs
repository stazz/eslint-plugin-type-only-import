// ESLint config for formatting the <project name>/src/**/*.ts files.
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:jsdoc/recommended-typescript-error",
    "plugin:type-only-import/recommended", // Reference to this ESLint plugin!
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended"
  ],
  plugins: [
    "jsdoc",
    "type-only-import", // Reference to this ESLint plugin!
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": "error",
    //"function-paren-newline": ["error", "always"],
    "@typescript-eslint/explicit-module-boundary-types": "off", // IDE will show the return types
    "@typescript-eslint/restrict-template-expressions": "off", // We are OK with whatever type within template expressions
    "@typescript-eslint/unbound-method": "off", // We never use 'this' within functions anyways.
    "@typescript-eslint/no-empty-function": "off", // Empty functions are ok sometimes.
    "no-useless-return": "error",
    "no-console": "error",
    "sonarjs/no-nested-template-literals": "off", // Nested template literals are OK really
    "jsdoc/require-file-overview": "error",
    "jsdoc/require-jsdoc": [
      "error",
      {
        "publicOnly": true,
        "require": {
          "ArrowFunctionExpression": true,
          "ClassDeclaration": true,
          "ClassExpression": true,
          "FunctionDeclaration": true,
          "FunctionExpression": true,
          "MethodDefinition": true
        },
        "exemptEmptyConstructors": true,
        "exemptEmptyFunctions": false,
        "enableFixer": false,
        "contexts": [
          "TSInterfaceDeclaration",
          "TSTypeAliasDeclaration",
          "TSMethodSignature",
          "TSPropertySignature"
        ]
      }
    ],
    // Ensure that @typescript-eslint/utils imports are _always_ import with only "type" specifier.
    "type-only-import/require-type-only-export": [
      "error",
      {
        pattern: "@typescript-eslint/utils",
      }
    ],
    "type-only-import/require-type-only-import": [
      "error",
      {
        pattern: "@typescript-eslint/utils",
      }
    ]
  },
  overrides: [
    {
      "files": ["**/__test__/*.ts"],
      "rules": {
        "type-only-import/require-type-only-export": ["off"],
        "type-only-import/require-type-only-import": ["off"]
      }
    }
  ]
};
