'use strict';

var util = require('../../test/util');
var startUrl = 'https://dodgers.trumedianetworks.com'

var tests = [
  './mlb/login_page',
  './mlb/test_page'
]

util.generateTests('Test Run', tests, startUrl); 