"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { webidl2jsDOMException } = require("..");
const testharness = require("./testharness.js");

const wptDir = path.resolve(__dirname, "web-platform-tests");

function createSandbox() {
  const sandbox = Object.assign({ Error, Object, Function }, testharness);
  webidl2jsDOMException.install(sandbox);

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

describe("webidl2jsDOMException", () => {
  it("throws when installing DOMException on a global object without an Error constructor", () => {
    testharness.assert_throws(new Error(), () => {
      webidl2jsDOMException.install({});
    });
  });

  it("throws when installing DOMException on a global object with an invalid Error constructor", () => {
    testharness.assert_throws(new Error(), () => {
      const Error = {};
      webidl2jsDOMException.install({ Error });
    });
  });
});

describe("Web platform tests", () => {
  for (const file of fs.readdirSync(wptDir)) {
    if (path.extname(file) === ".js") {
      describe(file, () => {
        runWPTFile(path.resolve(wptDir, file));
      });
    }
  }
});
