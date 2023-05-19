/* eslint-disable sonarjs/no-duplicate-string */
/**
 * @file This file contains unit tests for file "../require-path-import-extension/index.ts".
 */
import test from "ava";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import setupAVA from "./setupAva";
import performTests from "./performTests";
import spec, { MESSAGE_MISSING_EXTENSION } from "../require-type-only-import";

const node = AST_NODE_TYPES.ImportDeclaration;

setupAVA(test);
performTests(spec, MESSAGE_MISSING_EXTENSION, [
  {
    name: "Non-matching import should not be altered",
    code: 'import * as code from "./code"',
  },
  {
    name: "Matching import should have 'type ' be prefixed",
    code: 'import * as code from "./code.types"',
    fixedCode: 'import type * as code from "./code.types"',
    node,
  },
  {
    name: "Type-only import should already be considered valid",
    code: 'import type * as code from "./code.types"',
  },
  {
    name: "Matching import should have 'type' as prefix of specifier",
    code: 'import { X } from "./code.types"',
    fixedCode: 'import type { X } from "./code.types"',
    node,
  },
  {
    name: "Non-type namespace import should be correctly fixed",
    code: 'import code, { type X } from "./code.types"',
    fixedCode: 'import type { default as code,    X } from "./code.types"',
    node,
  },
  {
    name: "Non-type named import should be correctly fixed",
    code: 'import code, { X } from "./code.types"',
    fixedCode: 'import type { default as code,   X } from "./code.types"',
    node,
  },
  {
    name: "Type-prefixed import clause should be considered valid",
    code: 'import type { X } from "./code.types"',
  },
  {
    name: "Type-prefixed import specifier should be consiered valid",
    code: 'import { type X } from "./code.types"',
  },
  {
    name: "Default imports should be changed to type-only named imports",
    code: 'import code from "./code.types"',
    fixedCode: 'import type { default as code } from "./code.types"',
    node,
  },
]);
