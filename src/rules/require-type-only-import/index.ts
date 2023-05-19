/**
 * @file This file contains rule definition for "require-path-import-extension".
 */

import type {
  AST_NODE_TYPES,
  AST_TOKEN_TYPES,
  TSESTree,
  TSESLint,
} from "@typescript-eslint/utils";
import * as ruleHelpers from "../../rule-helpers";

export const RULE_NAME = ruleHelpers.getRuleName(import.meta.url);
export const MESSAGE_MISSING_EXTENSION = "message-import-missing-type-modifier";
export default ruleHelpers.createRule({
  name: RULE_NAME,
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description:
        "Enforce type modifier to import statements matching given pattern.",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      [MESSAGE_MISSING_EXTENSION]:
        "The import statement does not have type modifier.",
    },
  },
  create: (ctx, options) => {
    const checkNode = ruleHelpers.createRuleCheck(
      ctx,
      MESSAGE_MISSING_EXTENSION,
      options,
    );
    return {
      // ImportDeclaration: import something from "something"
      ImportDeclaration: (node) => {
        checkNode(
          node,
          node.importKind === ruleHelpers.VALUE_KIND &&
            node.specifiers.some(
              (spec) =>
                spec.type === AST_IMPORT_DEFAULT_SPECIFIER ||
                spec.type === AST_IMPORT_NAMESPACE_SPECIFIER ||
                spec.importKind === ruleHelpers.VALUE_KIND,
            ),
          node.source,
          makeFix(ctx.getSourceCode(), node),
        );
      },
    };
  },
});

// This allows us to push "@typescript-eslint/utils" dependency into type-realm instead of runtime-dependency.
const AST_IMPORT_DEFAULT_SPECIFIER =
  "ImportDefaultSpecifier" as const satisfies `${AST_NODE_TYPES.ImportDefaultSpecifier}`;
const AST_IMPORT_NAMESPACE_SPECIFIER =
  "ImportNamespaceSpecifier" as const satisfies `${AST_NODE_TYPES.ImportNamespaceSpecifier}`;
const AST_IMPORT_SPECIFIER =
  "ImportSpecifier" as const satisfies `${AST_NODE_TYPES.ImportSpecifier}`;
const AST_PUNCTUATOR =
  "Punctuator" as const satisfies `${AST_TOKEN_TYPES.Punctuator}`;
const AST_IDENTIFIER =
  "Identifier" as const satisfies `${AST_TOKEN_TYPES.Identifier}`;
const AST_KEYWORD = "Keyword" as const satisfies `${AST_TOKEN_TYPES.Keyword}`;

const makeFix = (
  code: Readonly<TSESLint.SourceCode>,
  node: TSESTree.ImportDeclaration,
) => {
  return function* (fixer: TSESLint.RuleFixer) {
    // The ImportNamespaceSpecifier is special -> if it is present, there must be only one of them
    // Otherwise, there will be 0..1 ImportDefaultSpecifiers, and * ImportSpecifiers
    const nsSpecs = node.specifiers.filter(
      (spec): spec is TSESTree.ImportNamespaceSpecifier =>
        spec.type === AST_IMPORT_NAMESPACE_SPECIFIER,
    );
    if (nsSpecs.length > 0) {
      if (nsSpecs.length === 1) {
        // The end result must be: import type * as something from "target"
        yield fixer.insertTextBefore(nsSpecs[0], ruleHelpers.TYPE_PREFIX);
      } // Else - this is some new TS version which allows this? Don't know how to auto-fix yet
    } else {
      const defaultSpecs = node.specifiers.filter(
        (spec): spec is TSESTree.ImportDefaultSpecifier =>
          spec.type === AST_IMPORT_DEFAULT_SPECIFIER,
      );
      if (defaultSpecs.length <= 1) {
        yield* fixWithMaybeDefaultSpec(node, code, fixer, defaultSpecs[0]);
      } // Else - this is some new TS version which allows this? Don't know how to auto-fix yet
    }
  };
};

function* fixWithMaybeDefaultSpec(
  node: TSESTree.ImportDeclaration,
  code: Readonly<TSESLint.SourceCode>,
  fixer: TSESLint.RuleFixer,
  defaultSpec: TSESTree.ImportDefaultSpecifier | undefined,
) {
  // The end result must be: import type { x, y, z } from "target"
  let removeTypeFromSpecifiers = node.specifiers;
  const nodeTokens = code.getTokens(node);
  if (defaultSpec) {
    if (node.specifiers.length > 1) {
      // import code, { X } from "target" -> import type { default as code, X } from "target"
      yield fixer.replaceText(
        defaultSpec,
        `type { default as ${defaultSpec.local.name}, `,
      );
      yield fixer.remove(
        nodeTokens.find((t) => t.type === AST_PUNCTUATOR && t.value === ",") ??
          /* c8 ignore next 2 */
          ruleHelpers.doThrow(
            "Failed to find comma in ImportDeclaration with default + at least one spec.",
          ),
      );
      yield fixer.remove(
        nodeTokens.find((t) => t.type === AST_PUNCTUATOR && t.value === "{") ??
          /* c8 ignore next 2 */
          ruleHelpers.doThrow(
            "Failed to find open-brace in ImportDeclaration with default + at least one spec.",
          ),
      );
      removeTypeFromSpecifiers = node.specifiers.slice(1);
    } else {
      // import code from "target" -> import type { default as code } from "target"
      yield fixer.replaceText(
        defaultSpec,
        `type { default as ${defaultSpec.local.name} }`,
      );
    }
  } else {
    // Add 'type ' text right after "import" keyword
    yield fixer.insertTextAfter(
      nodeTokens.find((t) => t.type === AST_KEYWORD && t.value === "import") ??
        /* c8 ignore next 2 */
        ruleHelpers.doThrow(
          "Failed to find 'import' keyword in import declaration",
        ),
      " type",
    );
  }
  // Remove 'type' modifier of all ImportSpecifiers, since we already have it at level of ImportDeclaration node.
  yield* removeTypeFromSpecifiers
    .filter(
      (spec): spec is TSESTree.ImportSpecifier =>
        spec.type === AST_IMPORT_SPECIFIER &&
        spec.importKind !== ruleHelpers.VALUE_KIND,
    )
    .map((spec) =>
      fixer.remove(
        code
          .getTokens(spec)
          .find((t) => t.type === AST_IDENTIFIER && t.value === "type") ??
          /* c8 ignore next 2 */
          ruleHelpers.doThrow(
            "Failed to find 'type' keyword in type-only import specifier.",
          ),
      ),
    );
}
