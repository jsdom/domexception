"use strict";

const DOMException = require("./lib/DOMException");
const { installOverride } = require("./lib/DOMException-impl");

module.exports = Object.assign({}, DOMException, { install: installOverride });
