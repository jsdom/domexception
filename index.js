"use strict";
const DOMException = require("./webidl2js-wrapper.js");

const sharedGlobalObject = { Error };
DOMException.install(sharedGlobalObject, ["Window"]);

module.exports = sharedGlobalObject.DOMException;
