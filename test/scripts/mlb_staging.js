'use strict';

var util = require('../../test/util');
var startUrl = 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER;

var tests = [
  './mlb/login_page',
  // './mlb/standings_page',
  // './mlb/scores/scores_page',
  // './mlb//scores/detailed_score_page',
  './mlb/teams/teams_page',
  // './mlb/players/players_page',
  // './mlb/umpires/umpires_page',
  // './mlb/groups_page',
  './mlb/teams/team_batting_page',
  // './mlb/teams/team_pitching_page',
  // './mlb/teams/team_catching_page',
  // './mlb/teams/team_statcast_fielding_page',
  // './mlb/players/player_batting_page',
  // './mlb/players/player_pitching_page',
  // './mlb/players/player_catching_page',
  // './mlb/players/player_statcast_fielding_page',
  // './mlb/umpires/umpire_page',
  // './mlb/custom_reports/rockies',
  // './mlb/custom_reports/phillies',
  // './mlb/custom_reports/marlins',
  // './mlb/custom_reports/brewers',
  // './mlb/custom_reports/tigers',
  // './mlb/custom_reports/twins',
  // './mlb/custom_reports/dbacks',
  // './mlb/custom_reports/angels',
  // './mlb/custom_reports/indians',
  // './mlb/data_comparison'
]

util.generateTests('[MLB Staging]', tests, startUrl); 

