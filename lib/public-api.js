"use strict";

const DOMException = require("./DOMException");

// Special install function to make the DOMException inherit from Error.
// https://heycam.github.io/webidl/#es-DOMException-specialness
function installDOMException(globalObject) {
  DOMException.install(globalObject);

  if (!globalObject.Error || typeof globalObject.Error !== "function") {
    throw new Error("Internal error: Error constructor is not present on globalObject.");
  }

  Object.setPrototypeOf(globalObject.DOMException.prototype, globalObject.Error.prototype);
}

const sharedGlobalObject = { Error };
installDOMException(sharedGlobalObject);

exports.DOMException = sharedGlobalObject.DOMException;
exports.webidl2jsDOMException = Object.assign({}, DOMException, { install: installDOMException });
