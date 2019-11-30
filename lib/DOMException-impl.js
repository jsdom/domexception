"use strict";

const legacyErrorCodes = require("./legacy-error-codes.json");

const idlUtils = require("./utils.js");
const DOMException = require("./DOMException");

exports.implementation = class DOMExceptionImpl {
  constructor(globalObject, [message, name]) {
    this.name = name;
    this.message = message;

    this._globalObject = globalObject;
  }

  get code() {
    return legacyErrorCodes[this.name] || 0;
  }
};

// A proprietary V8 extension that causes the stack property to appear.
exports.init = impl => {
  if (Error.captureStackTrace) {
    const wrapper = idlUtils.wrapperForImpl(impl);
    Error.captureStackTrace(wrapper, wrapper.constructor);
  }
};

// Special install function to make the DOMException inherit from Error.
// https://heycam.github.io/webidl/#es-DOMException-specialness
exports.installOverride = function (globalObject) {
  DOMException.install(globalObject);

  if (typeof globalObject.Error !== "function") {
    throw new Error("Internal error: Error constructor is not present on globalObject.");
  }

  Object.setPrototypeOf(globalObject.DOMException.prototype, globalObject.Error.prototype);
};
