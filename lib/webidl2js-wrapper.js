"use strict";

const DOMException = require("./DOMException");
const { installOverride } = require("./DOMException-impl");

module.exports = Object.assign({}, DOMException, { install: installOverride });
