"use strict";
const DOMException = require("./lib/DOMException.js");

// Special install function to make the DOMException inherit from Error.
// https://heycam.github.io/webidl/#es-DOMException-specialness
function installOverride(globalObject) {
  DOMException.install(globalObject);

  if (typeof globalObject.Error !== "function") {
    throw new Error("Internal error: Error constructor is not present on globalObject.");
  }

  Object.setPrototypeOf(globalObject.DOMException.prototype, globalObject.Error.prototype);
}

module.exports = Object.assign({}, DOMException, { install: installOverride });
