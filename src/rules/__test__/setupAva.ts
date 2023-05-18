/**
 * @file This file contains code to make ESLint RuleTester and AVA to co-operate.
 */
import type * as test from "ava";
import { ESLintUtils } from "@typescript-eslint/utils";

/**
 * Sets up AVA test framework to co-operate with ESLint's RuleTester.
 * @param test The AVA test framework (`import test from "ava";`).
 */
export default (test: test.TestFn) => {
  let testCaseName: string;
  ESLintUtils.RuleTester.describe = (text, callback) => {
    // The ESLint test runner will call this with text being 'invalid' or 'valid' for each invalid/valid test case
    // But since we only have one ESLint test case per AVA test case, we actually don't care about those.
    // We only need to save the actual test name passed to test runner.
    if (text !== "invalid" && text !== "valid") {
      testCaseName = text;
    }
    return callback.apply(this);
  };
  ESLintUtils.RuleTester.it = (text, callback) => {
    // Here, 'text' will be the code being tested.
    // No point embedding it into the test case name tho.
    test(testCaseName, (c) => {
      c.notThrows(callback);
    });
  };
};
