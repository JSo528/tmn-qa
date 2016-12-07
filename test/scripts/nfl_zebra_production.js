'use strict';

var util = require('../../test/util');
var startUrl = 'https://49ers.analytics.trumedianetworks.com';

var tests = [
  './shared/login_tests',
  './nfl/standings_tests',
  './nfl/teams/teams_tests',
]

util.generateTests('[NFL Production]', tests, startUrl); 

