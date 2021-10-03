"use strict";

const path = require("path");
const fs = require("fs");
const fetch = require("minipass-fetch");

if (process.env.NO_UPDATE) {
  process.exit(0);
}

// Pin to specific version, reflecting the spec version in the readme.
//
// To get the latest commit:
// 1. Go to https://github.com/w3c/web-platform-tests/tree/master/WebIDL/ecmascript-binding/es-exceptions
// 2. Press "y" on your keyboard to get a permalink
// 3. Copy the commit hash
const commitHash = "d198d67803096e5252bd31735f57eb4db1c975a9";

const urlPrefix = `https://raw.githubusercontent.com/w3c/web-platform-tests/${commitHash}/` +
                  `WebIDL/ecmascript-binding/es-exceptions/`;
const targetDir = path.resolve(__dirname, "..", "test", "web-platform-tests");

fs.mkdirSync(targetDir, { recursive: true });

const files = [
  "DOMException-constants.any.js",
  "DOMException-constructor-and-prototype.any.js",
  "DOMException-constructor-behavior.any.js",
  "DOMException-custom-bindings.any.js"
];

async function main() {
  await Promise.all(files.map(async file => {
    const res = await fetch(`${urlPrefix}${file}`);
    res.body.pipe(fs.createWriteStream(path.resolve(targetDir, file)));
  }));
}

main().catch(err => {
  console.error(err.stack);
  process.exit(1);
});
