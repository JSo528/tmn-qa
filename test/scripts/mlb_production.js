'use strict';

var util = require('../../test/util');
var startUrl = 'https://dodgers.trumedianetworks.com'

var tests = [
  './mlb/login_page',
  './mlb/standings_page',
  './mlb/scores_page',
  './mlb/detailed_score_page',
  './mlb/teams_page',
  // './mlb/players_page'
]

util.generateTests('[MLB Production]', tests, startUrl); 

