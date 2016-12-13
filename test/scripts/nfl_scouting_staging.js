'use strict';

var util = require('../../test/util');
var startUrl = 'https://staging.jags.scouting.trumedianetworks.com/';

var tests = [
  './shared/login_tests',
  './nfl_scouting/scout_tests',
  // './nfl_scouting/teams/teams_tests',
]

util.generateTests('[NFL Scouting Staging]', tests, startUrl); 

