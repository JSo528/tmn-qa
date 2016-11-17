'use strict';

var util = require('../../test/util');
var startUrl = 'https://mlbdemo-staging.trumedianetworks.com:' + process.env.PORT_NUMBER;

var tests = [
  './mlb/login_page',
  './mlb/standings_page',
  './mlb/scores_page',
  './mlb/detailed_score_page',
  './mlb/teams_page',
  './mlb/players_page',
  './mlb/umpires_page',
  './mlb/groups_page',
  './mlb/team_batting_page',
  './mlb/team_pitching_page',
  './mlb/team_catching_page',
  './mlb/team_statcast_fielding_page',
  './mlb/player_batting_page',
  './mlb/player_pitching_page',
  './mlb/player_catching_page',
  './mlb/player_statcast_fielding_page',
  './mlb/umpire_page',
  './mlb/data_comparison'
]

util.generateTests('[MLB Staging]', tests, startUrl); 

