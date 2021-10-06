"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");

const testharness = require("./testharness.js");

const SharedDOMException = require("..");
const WrapperDOMException = require("../webidl2js-wrapper");

const wptDir = path.resolve(__dirname, "web-platform-tests");

function instantiateContext(sandbox) {
  vm.createContext(sandbox);
  sandbox.self = vm.runInContext("this", sandbox);
  return sandbox;
}

function createSharedSandbox() {
  const sandbox = { Array, Error, Function, Object, Promise, String, TypeError, ...testharness };
  Object.defineProperty(sandbox, "DOMException", {
    value: SharedDOMException,
    enumerable: false,
    configurable: true,
    writable: true
  });
  return sandbox;
}

function createWrapperSandbox() {
  const sandbox = { Array, Error, Function, Object, Promise, String, TypeError, ...testharness };
  WrapperDOMException.install(sandbox, ["Window"]);
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
    const badGlobal = {};
    assert.throws(() => {
      WrapperDOMException.install(badGlobal);
    }, Error);

    assert.equal("DOMException" in badGlobal, false);
  });

  it("throws when installing DOMException on a global object with an invalid Error constructor", () => {
    const badGlobal = { Error: {} };
    assert.throws(() => {
      WrapperDOMException.install(badGlobal);
    }, Error);

    assert.equal("DOMException" in badGlobal, false);
  });

  runWPT(createWrapperSandbox);
});
