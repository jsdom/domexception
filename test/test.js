"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const testharness = require("./testharness.js");

const SharedDOMException = require("../lib/index");
const WrapperDOMException = require("../lib/webidl2js-wrapper");

const wptDir = path.resolve(__dirname, "web-platform-tests");

function instantiateContext(sandbox) {
  vm.createContext(sandbox);
  sandbox.self = vm.runInContext("this", sandbox);
  return sandbox;
}

function createSharedSandbox() {
  const sandbox = Object.assign({ Error, Object, Function }, testharness);
  Object.defineProperty(sandbox, "DOMException", {
    value: SharedDOMException,
    enumerable: false,
    configurable: true,
    writable: true
  });
  return sandbox;
}

function createWrapperSandbox() {
  const sandbox = Object.assign({ Error, Object, Function }, testharness);
  WrapperDOMException.install(sandbox);
  return sandbox;
}

function runWPTFile(file, sandboxCreator) {
  const code = fs.readFileSync(file, "utf-8");

  const sandbox = sandboxCreator();
  const context = instantiateContext(sandbox);

  vm.runInContext(code, context, {
    filename: file,
    displayErrors: true
  });
}

function runWPT(sandboxCreator) {
  describe("Web platform tests", () => {
    for (const file of fs.readdirSync(wptDir)) {
      if (path.extname(file) === ".js") {
        describe(file, () => {
          runWPTFile(path.resolve(wptDir, file), sandboxCreator);
        });
      }
    }
  });
}

describe("Shared", () => {
  runWPT(createSharedSandbox);
});

describe("webidl2js Wrapper", () => {
  it("throws when installing DOMException on a global object without an Error constructor", () => {
    testharness.assert_throws(new Error(), () => {
      WrapperDOMException.install({});
    });
  });

  it("throws when installing DOMException on a global object with an invalid Error constructor", () => {
    testharness.assert_throws(new Error(), () => {
      const Error = {};
      WrapperDOMException.install({ Error });
    });
  });

  runWPT(createWrapperSandbox);
});
