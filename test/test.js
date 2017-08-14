"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const DOMException = require("..");
const testharness = require("./testharness.js");

const wptDir = path.resolve(__dirname, "web-platform-tests");

function createSandbox() {
  const sandbox = Object.assign({ Error, Object, Function }, testharness);
  Object.defineProperty(sandbox, "DOMException", {
    value: DOMException,
    enumerable: false,
    configurable: true,
    writable: true
  });

  vm.createContext(sandbox);
  sandbox.self = vm.runInContext("this", sandbox);
  return sandbox;
}

function runWPTFile(file) {
  const code = fs.readFileSync(file, "utf-8");
  vm.runInContext(code, createSandbox(), {
    filename: file,
    displayErrors: true
  });
}

describe("Web platform tests", () => {
  for (const file of fs.readdirSync(wptDir)) {
    if (path.extname(file) === ".js") {
      describe(file, () => {
        runWPTFile(path.resolve(wptDir, file));
      });
    }
  }
});
