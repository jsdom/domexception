"use strict";
const legacyErrorCodes = require("./legacy-error-codes.json");

exports.implementation = class DOMExceptionImpl {
  constructor([message, name]) {
    this.name = name;
    this.message = message;
  }

  get code() {
    return legacyErrorCodes[this.name] || 0;
  }
};
