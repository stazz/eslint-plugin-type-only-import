/**
 * @file This file contains the "recommended" flavour of ESLint plugin configuration.
 */
import {
  RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION,
  RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION,
} from "../rules";

// Unfortunately, if we try to import package.json (either `import { name } from "../../package.json"`, or `import("../../package.json")`), we must make TS root dir to be same where package.json is -> it will pull it into the final dist-xyz directories.
// Also those directories will have "src" folder, so the whole thing becomes messed up.
// So for now, just settle with the constant string.
const rulePrefix = "type-only-import/";

export default {
  rules: {
    [`${rulePrefix}${RULE_NAME_REQUIRE_PATH_IMPORT_EXTENSION}`]: ["error"],
    [`${rulePrefix}${RULE_NAME_REQUIRE_PATH_EXPORT_EXTENSION}`]: ["error"],
  },
};
