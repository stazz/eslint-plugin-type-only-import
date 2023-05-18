// ESLint config for formatting the resulting .d.ts files (<project name>/dist-ts/**/*.d.ts) that end up in NPM package for typing information.
module.exports = {
  root: true,
  extends: [
    "plugin:jsdoc/recommended-typescript-error",
    "plugin:prettier/recommended",
  ],
  plugins: [
    "jsdoc",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.out.json",
    sourceType: "module",
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "prettier/prettier": "error",
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
    ]
  }
};
