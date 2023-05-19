/**
 * @file This file contains code related to actual check performed by rule on a AST node for literal values.
 */

import type { TSESTree, TSESLint } from "@typescript-eslint/utils";
import type { FullOptions } from "./options";
import type { Context } from "./creator";

/* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
/**
 * Creates callback which will report an issue to `ctx` if the given {@link TSESTree.Literal} is relative path without correct extension.
 * @param ctx The {@link TSESLint.RuleContext}
 * @param messageId The ID of the message to use when reporting the error.
 * @param root1.pattern The pattern to match the literal against.
 * @returns The callback to use to check the {@link TSESTree.Literal} nodes.
 */
export default <TMessageId extends string>(
  ctx: Context<TMessageId>,
  messageId: TMessageId,
  { pattern: patternString, disableFixer }: FullOptions,
) => {
  const pattern = new RegExp(patternString);
  return (
    node: TSESTree.Node,
    performPatternMatch: boolean,
    literalNode: TSESTree.StringLiteral,
    fix: TSESLint.ReportFixFunction,
  ) => {
    if (performPatternMatch && pattern.test(literalNode.value)) {
      ctx.report({
        node,
        messageId,
        fix: disableFixer ? null : fix,
      });
    }
  };
};
