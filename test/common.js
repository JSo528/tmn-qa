var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var constants = require('../lib/constants.js');

var options = {
    foo: "foo"
};

exports.options = options;
exports.chai = chai;
exports.assert = chai.assert;
exports.webdriver = webdriver;
exports.test = test;
exports.constants = constants;