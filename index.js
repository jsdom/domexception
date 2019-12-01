"use strict";

const DOMException = require("./webidl2js-wrapper");

const sharedGlobalObject = { Error };
DOMException.install(sharedGlobalObject);

module.exports = sharedGlobalObject.DOMException;
