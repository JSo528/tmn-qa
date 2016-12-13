'use strict';

var util = require('../../test/util');
var startUrl = 'https://staging.jags.scouting.trumedianetworks.com/';

var tests = [
  './shared/login_tests',
  './nfl_scouting/scout/scout_tests',
  './nfl_scouting/teams/teams_tests',
  './nfl_scouting/lists/lists_tests',
]

util.generateTests('[NFL Scouting Staging]', tests, startUrl); 

