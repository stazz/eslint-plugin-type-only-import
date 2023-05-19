/**
 * @file This file constains constants used by rules.
 */

import type { TSESTree } from "@typescript-eslint/utils";

/**
 * The `@typescript-eslint/utils` package does not export this as const, so we have to do it ourselves.
 */
export const VALUE_KIND =
  "value" as const satisfies TSESTree.ImportDeclaration["importKind"] &
    TSESTree.ImportSpecifier["importKind"] &
    TSESTree.ExportSpecifier["exportKind"] &
    TSESTree.ExportAllDeclaration["exportKind"];

/**
 * The text that will be prepended before offending elements.
 */
export const TYPE_PREFIX = "type ";
