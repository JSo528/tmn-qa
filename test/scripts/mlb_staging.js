'use strict';

var util = require('../../test/util');
var startUrl = 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER;

var tests = [
  './mlb/login_page'
  './mlb/standings_page',
  './mlb/scores_page',
  './mlb/detailed_score_page',
  './mlb/teams_page',
  './mlb/staging_data'
]

util.generateTests('MLB Staging Site', tests, startUrl); 

