"use strict";
/* eslint-disable camelcase */
const assert = require("assert");

// This contains minimal shims for
// https://github.com/w3c/web-platform-tests/blob/master/resources/testharness.js to allow us to run
// the tests in ./web-platform-tests/

exports.test = (func, title = "(Default test for this file)") => {
  specify(title, func);
};

exports.assert_true = (actual, message) => {
  assert.strictEqual(actual, true, message);
};

exports.assert_false = (actual, message) => {
  assert.strictEqual(actual, false, message);
};

exports.assert_equals = assert.strictEqual;

exports.assert_throws_js = (expectedErrorSample, func) => {
  assert.throws(func, actualError => actualError.name === expectedErrorSample.name);
};

exports.assert_own_property = (object, name, message = `Expected property ${name} missing`) => {
  assert.strictEqual(Object.prototype.hasOwnProperty.call(object, name), true, message);
};
