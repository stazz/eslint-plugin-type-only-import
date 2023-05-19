/**
 * @file This file contains code related to rule options.
 */

import type { JSONSchema4 } from "json-schema";

/**
 * The schema for rule options.
 */
export const schema: Array<JSONSchema4> = [
  // The extension that rule will enforce.
  {
    type: "object",
    properties: {
      pattern: {
        type: "string",
      },
      disableFixer: {
        type: "boolean",
      },
    },
    minProperties: 0,
    maxProperties: 2,
  },
];

/**
 * This type is runtime type of options for rules of this plugin, as represented by JSON schema {@link schema}.
 */
export type Options = Readonly<
  Partial<{
    pattern: string;
    disableFixer: boolean;
  }>
>; // We could use "json-schema-to-ts" module here, but unfortunately that operates on JSON Schema 7, while ESLint operates on JSON Schema 4

/**
 * The type to use when declaring {@link Options} for ESLint.
 */
export type ESLintOptions = Readonly<[Options]>;

/**
 * The type after processing partial {@link Options} into full options.
 */
export type FullOptions = Readonly<{ [P in keyof Options]-?: Options[P] }>;

/**
 * The default options for the rules.
 */
export const defaultOptions = {
  pattern: "\\..+\\.types$",
} as const satisfies Options;

// eslint-disable-next-line jsdoc/require-param
/* eslint-disable jsdoc/check-param-names, jsdoc/require-param */
/**
 * Helper function to get full options from ESLint partial options.
 * @param param1 The options.
 * @returns Named options, using defaults if options partial object did not have element for that option.
 */
export const getOptions = ([opts]: ESLintOptions): FullOptions => ({
  pattern: opts?.pattern ?? defaultOptions.pattern,
  disableFixer: opts?.disableFixer === true,
});
/* eslint-enable jsdoc/check-param-names, jsdoc/require-param */
