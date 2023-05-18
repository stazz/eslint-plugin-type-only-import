/**
 * @file This file contains function to extract rule name, which is directory name of the file where the rule is defined.
 */
import * as path from "node:path";
/**
 * Gets the name of the rule, which is directory name of the file where the rule is defined.
 * @param importMetaUrl The value of `import.meta.url` of the rule code file.
 * @returns The name of the rule: directory name of the file where the rule is defined.
 */
export default (importMetaUrl: string) =>
  path.basename(path.dirname(importMetaUrl));
