#!/usr/bin/env node

const fs = require("fs");
const { version } = JSON.parse(fs.readFileSync("package.json"));
fs.writeFileSync(
  "dist-cjs/package.json",
  // Just version and type is enough
  JSON.stringify({ version, type: "commonjs" })
);