'use strict';

var util = require('../../test/util');
var startUrl = 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER;

var tests = [
  './mlb/login_page',
  './mlb/test_page'
]

util.generateTests('[MLB Example]', tests, startUrl); 