/**
 * @file This file contains reusable callback to create ESLint rules specific to this package.
 */
import type { ESLintUtils, TSESLint } from "@typescript-eslint/utils";
import * as options from "./options";

// Notice that we don't use ESLintUtils.RuleCreator.
// The only thing it does is default option calculation and per-name URL helper
// The first one is done in "./options", and the 2nd one is trivial to implement oneself.
// This allows us to push "@typescript-eslint/utils" dependency into type-realm instead of runtime-dependency.

/**
 * Creates callback to create new ESLint rules, which are bound to {@link Options} and using {@link TSESLint.RuleContext}.
 * @param root0 The arguments for the rule, except the ones which will be common.
 * @param root0.create Privately deconstructed variable.
 * @param root0.meta Privately deconstructed variable.
 * @param root0.name Private deconstructed variable.
 * @returns The ESLint rule which is bound to {@link Options} and using {@link TSESLint.RuleContext}.
 */
export default <TMessageIds extends string>({
  create,
  meta,
  name,
}: Readonly<{
  name: string;
  meta: Omit<ESLintUtils.NamedCreateRuleMeta<TMessageIds>, "schema">;
  create: (
    ctx: Context<TMessageIds>,
    options: options.FullOptions,
  ) => TSESLint.RuleListener;
}>): TSESLint.RuleModule<
  TMessageIds,
  options.ESLintOptions,
  TSESLint.RuleListener
> => ({
  meta: {
    ...meta,
    schema: options.schema,
    docs: {
      ...meta.docs,
      url: `https://github.com/stazz/eslint-plugin-path-import-extension/tree/main/src/rules/${name}`,
    },
  },
  defaultOptions: [options.defaultOptions],
  create: (ctx) => create(ctx, options.getOptions(ctx.options)),
});

/**
 * The type of the context visible to rules.
 */
export type Context<TMessageIds extends string> = Readonly<
  Omit<TSESLint.RuleContext<TMessageIds, options.ESLintOptions>, "options">
>;
