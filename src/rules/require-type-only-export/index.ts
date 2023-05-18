/**
 * @file This file contains rule definition for "require-path-export-extension".
 */
import { AST_TOKEN_TYPES, TSESTree } from "@typescript-eslint/utils";
import * as ruleHelpers from "../../rule-helpers";

export const RULE_NAME = ruleHelpers.getRuleName(import.meta.url);
export const MESSAGE_MISSING_EXTENSION = "message-export-missing-type-modifier";
export default ruleHelpers.createRule({
  name: RULE_NAME,
  meta: {
    type: "problem",
    fixable: "code",
    docs: {
      description:
        "Enforce type modifier to export statements matching given pattern.",
      recommended: "error",
      requiresTypeChecking: false,
    },
    messages: {
      [MESSAGE_MISSING_EXTENSION]:
        "The export statement does not have type modifier.",
    },
  },
  create: (ctx, options) => {
    const checkNode = ruleHelpers.createRuleCheck(
      ctx,
      MESSAGE_MISSING_EXTENSION,
      options,
    );
    return {
      // ExportAllDeclaration: export * from "./something"
      ExportAllDeclaration: (node) => {
        checkNode(
          node,
          node.exportKind === ruleHelpers.VALUE_KIND,
          node.source,
          (fixer) => {
            // Punctuator is the asterisk in "export * from ..."
            const punctuatorToken =
              ctx
                .getSourceCode()
                .getTokens(node)
                .find((t) => t.type === AST_PUNCTUATOR) ??
              doThrow(
                "Failed to find Punctuator in tokens of ExportAllDeclaration.",
              );

            return fixer.insertTextBefore(
              punctuatorToken,
              ruleHelpers.TYPE_PREFIX,
            );
          },
        );
      },
      // ExportNamedDeclaration: export { x } from "./something"
      ExportNamedDeclaration: (node) => {
        if (node.source) {
          checkNode(
            node,
            node.exportKind === ruleHelpers.VALUE_KIND &&
              node.specifiers.some(
                (spec) => spec.exportKind === ruleHelpers.VALUE_KIND,
              ),
            node.source,
            function* (fixer) {
              const code = ctx.getSourceCode();
              // Punctuator is the open-brace after
              const tokens = code.getTokens(node);
              // Punctuator is the open-brace after
              const punctuator =
                tokens.find((t) => t.type === AST_PUNCTUATOR) ??
                doThrow("Failed to find punctuator in ExportNamedDeclaration.");

              if (node.exportKind === ruleHelpers.VALUE_KIND) {
                yield fixer.insertTextBefore(punctuator, "type ");
              }

              yield* node.specifiers
                // All non-type specifier
                .filter((spec) => spec.exportKind !== ruleHelpers.VALUE_KIND)
                // Which actually have 'type' token
                .map((spec) =>
                  code
                    .getTokens(spec)
                    .find(
                      (t) => t.type === AST_IDENTIFIER && t.value === "type",
                    ),
                )
                .filter((token): token is TSESTree.Token => !!token)
                // Will get their 'type' token removed
                .map((token) => fixer.remove(token));
            },
          );
        }
      },
    };
  },
});

const AST_PUNCTUATOR =
  "Punctuator" as const satisfies `${AST_TOKEN_TYPES.Punctuator}`;
const AST_IDENTIFIER =
  "Identifier" as const satisfies `${AST_TOKEN_TYPES.Identifier}`;

const doThrow = (msg: string) => {
  throw new Error(msg);
};
