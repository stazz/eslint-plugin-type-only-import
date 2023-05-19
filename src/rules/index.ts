/**
 * @file This file exports all the rules for this ESLint plugin.
 */

import requirePathExportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_TYPE_ONLY_EXPORT_IMPORTED,
} from "./require-type-only-export";
import requirePathImportExtension, {
  RULE_NAME as RULE_NAME_REQUIRE_TYPE_ONLY_IMPORT_IMPORTED,
} from "./require-type-only-import";

export const RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION =
  RULE_NAME_REQUIRE_TYPE_ONLY_EXPORT_IMPORTED;
export const RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION =
  RULE_NAME_REQUIRE_TYPE_ONLY_IMPORT_IMPORTED;

export default {
  [RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION]: requirePathExportExtension,
  [RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION]: requirePathImportExtension,
};
