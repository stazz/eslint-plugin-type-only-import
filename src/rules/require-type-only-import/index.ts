/**
 * @file This file contains rule definition for "require-path-import-extension".
 */
import type { AST_NODE_TYPES } from "@typescript-eslint/utils";
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
        const valueSpecifiers = node.specifiers.filter(
          (spec) =>
            spec.type === AST_IMPORT_DEFAULT_SPECIFIER ||
            (spec.type === AST_IMPORT_NAMESPACE_SPECIFIER
              ? node.importKind === ruleHelpers.VALUE_KIND
              : spec.importKind === ruleHelpers.VALUE_KIND),
        );
        checkNode(
          node,
          valueSpecifiers.length > 0 ||
            node.importKind === ruleHelpers.VALUE_KIND,
          node.source,
          // Need to think about this situation
          // import type { A, B, C } from "x"
          // import { type A, type B, type C } from "x"
          // So basically, if all specifiers are of type ImportSpecifier:
          // 1. Insert 'type' after "import" keyword if node.importKind === "value"
          // 2. Remove 'type' from all specifiers
          (fixer) =>
            valueSpecifiers.map((spec) =>
              spec.type === AST_IMPORT_NAMESPACE_SPECIFIER
                ? fixer.insertTextBefore(spec, ruleHelpers.TYPE_PREFIX)
                : spec.type === AST_IMPORT_DEFAULT_SPECIFIER
                ? fixer.insertTextBefore(spec, "type * as ")
                : fixer.insertTextBefore(spec.local, ruleHelpers.TYPE_PREFIX),
            ),
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
