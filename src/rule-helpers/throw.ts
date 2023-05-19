/**
 * @file This file contains helper method to throw an error.
 */

/**
 * Helper function to throw an error with given message.
 * Useful when doing null-coalesing, because throwing something is a statement, not an expression in JS.
 * For example:
 * ```ts
 * import doThrow from "this-file";
 * const somethingNonNullable = getSomethingNullable() ?? doThrow("Shouldn't have been nullable at this point.");
 * ```
 * @param msg The message to pass to {@link Error} constructor.
 * @throws Error Always.
 */
export default (msg: string) => {
  throw new Error(msg);
};
