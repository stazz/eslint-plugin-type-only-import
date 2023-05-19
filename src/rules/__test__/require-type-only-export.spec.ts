/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @file This file contains unit tests for file "../require-path-export-extension/index.ts".
 */
import test from "ava";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import setupAVA from "./setupAva";
import performTests from "./performTests";
import spec, { MESSAGE_MISSING_EXTENSION } from "../require-type-only-export";

setupAVA(test);
performTests(spec, MESSAGE_MISSING_EXTENSION, [
  {
    name: "Non-matching export should not be altered",
    code: 'export * as code from "./code"',
  },
  {
    name: "Matching export should have 'type ' be prefixed",
    code: 'export * as code from "./code.types"',
    fixedCode: 'export type * as code from "./code.types"',
    node: AST_NODE_TYPES.ExportAllDeclaration,
  },
  {
    name: "Type-only export should already be considered valid",
    code: 'export type * as code from "./code.types"',
  },
  {
    name: "Non-type named export should be correctly fixed",
    code: 'export { X } from "./code.types"',
    fixedCode: 'export type { X } from "./code.types"',
    node: AST_NODE_TYPES.ExportNamedDeclaration,
  },
  {
    name: "Type-only named export specifier should already be considered valid",
    code: 'export { type X } from "./code.types"',
  },
  {
    name: "Type-only named export should already be considered valid",
    code: 'export type { X } from "./code.types"',
  },
  {
    name: "Partially-typed named export must become fully typed",
    code: 'export { type X, Y } from "./code.types"',
    fixedCode: 'export type {  X, Y } from "./code.types"',
    node: AST_NODE_TYPES.ExportNamedDeclaration,
  },
]);
