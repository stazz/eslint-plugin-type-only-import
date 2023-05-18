/**
 * @file This file contains common test utilities to run tests for ESLint rules.
 */
import {
  AST_NODE_TYPES,
  TSESLint,
  ESLintUtils,
} from "@typescript-eslint/utils";
import { type ESLintOptions } from "../../rule-helpers/options";

/**
 * Runs tests for given test specifications.
 * @param rule The rule to test.
 * @param messageId The message ID of the message for invalid code.
 * @param testSpecs The array of {@link TestOpts} specifying tests to run.
 * @returns An array of `undefined` (`void`) objects for each given element in `testSpecs`.
 */
export default <TMessageIds extends string>(
  rule: TSESLint.RuleModule<TMessageIds, ESLintOptions>,
  messageId: TMessageIds,
  testSpecs: ReadonlyArray<TestOpts>,
) =>
  testSpecs.map(
    performTest(
      rule,
      messageId,
      new ESLintUtils.RuleTester({
        parser: "@typescript-eslint/parser",
      }),
    ),
  );

/**
 * This type represents necessary information for one ESLint rule test case.
 */
export type TestOpts = TestOptsCommon & (TestOptsForSuccess | TestOptsForFix);

/**
 * This interface represents necessary information for one successful ESLint rule test case.
 */
export type TestOptsForSuccess = {
  [P in keyof TestOptsForFix]?: never;
};

/**
 * This interface represents necessary information for one unsuccessful ESLint rule test case.
 */
export interface TestOptsForFix {
  /**
   * The type of the errored node.
   */
  node: AST_NODE_TYPES;
  /**
   * If present, the TS code that should match the fixed code.
   * This implies that the `code` specified is deemed to be invalid by ESLint rule.
   */
  fixedCode: string;
}

/**
 * The common properties for {@link TestOptsForSuccess} and {@link TestOptsForFix}.
 */
export interface TestOptsCommon {
  /**
   * The name of the test case.
   */
  name: string;
  /**
   * The TS code to be tested.
   */
  code: string;
  /**
   * The optional options for ESLint rule.
   */
  options?: ESLintOptions;
}

const performTest =
  <TMessageIds extends string>(
    rule: TSESLint.RuleModule<TMessageIds, ESLintOptions>,
    messageId: TMessageIds,
    ruleTester: ESLintUtils.RuleTester,
  ) =>
  ({
    name,
    code,
    fixedCode = undefined,
    node = undefined,
    ...opts
  }: TestOpts) => {
    return ruleTester.run(name, rule, {
      invalid: fixedCode
        ? [
            {
              code,
              errors: [
                {
                  messageId,
                  type: node ?? AST_NODE_TYPES.Program,
                },
              ],
              output: fixedCode,
              ...opts,
            },
          ]
        : [],
      valid: fixedCode ? [] : [{ code, ...opts }],
    });
  };
