var By = require('selenium-webdriver').By;

var scripts = {
  1: {
    id: 1,
    name: 'MLB Staging',
    environment: 'staging',
    startUrl: 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER,
    screenshotLocator: By.id('main'),
    testFiles: [
      './mlb/login_page',
      './mlb/standings_page',
      './mlb/scores/scores_page',
      './mlb//scores/detailed_score_page',
      './mlb/teams/teams_page',
      './mlb/players/players_page',
      './mlb/umpires/umpires_page',
      './mlb/groups_page',
      './mlb/teams/team_batting_page',
      './mlb/teams/team_pitching_page',
      './mlb/teams/team_catching_page',
      './mlb/teams/team_statcast_fielding_page',
      './mlb/players/player_batting_page',
      './mlb/players/player_pitching_page',
      './mlb/players/player_catching_page',
      './mlb/players/player_statcast_fielding_page',
      './mlb/umpires/umpire_page',
      './mlb/custom_reports/rockies',
      './mlb/custom_reports/phillies',
      './mlb/custom_reports/marlins',
      './mlb/custom_reports/brewers',
      './mlb/custom_reports/tigers',
      './mlb/custom_reports/twins',
      './mlb/custom_reports/dbacks',
      './mlb/custom_reports/angels',
      './mlb/custom_reports/indians',
      './mlb/data_comparison'
    ]
  },
  2: {
    id: 2,
    name: 'MLB Production',
    environment: 'production',
    startUrl: 'https://dodgers.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    testFiles: [
      './mlb/login_page',
      './mlb/standings_page',
      './mlb/scores/scores_page',
      './mlb//scores/detailed_score_page',
      './mlb/teams/teams_page',
      './mlb/players/players_page',
      './mlb/umpires/umpires_page',
      './mlb/groups_page',
      './mlb/teams/team_batting_page',
      './mlb/teams/team_pitching_page',
      './mlb/teams/team_catching_page',
      './mlb/teams/team_statcast_fielding_page',
      './mlb/players/player_batting_page',
      './mlb/players/player_pitching_page',
      './mlb/players/player_catching_page',
      './mlb/players/player_statcast_fielding_page',
      './mlb/umpires/umpire_page',
      './mlb/custom_reports/rockies',
      './mlb/custom_reports/phillies',
      './mlb/custom_reports/marlins',
      './mlb/custom_reports/brewers',
      './mlb/custom_reports/tigers',
      './mlb/custom_reports/twins',
      './mlb/custom_reports/dbacks',
      './mlb/custom_reports/angels',
      './mlb/custom_reports/indians',
    ]
  },
  3: {
    id: 3,
    name: 'MLB Example',
    environment: 'staging',
    startUrl: 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER,
    screenshotLocator: By.id('main'),
    testFiles: [
      './mlb/login_page',
      './mlb/test_page'
    ]
  }, 
  4: {
    id: 4,
    name: 'NFL Scouting Staging',
    environment: 'production', // doesn't use a port
    startUrl: 'https://staging.jags.scouting.trumedianetworks.com/',
    screenshotLocator: By.css(".-content-container"),
    testFiles: [
      './shared/login_tests',
      './nfl_scouting/scout/scout_tests',
      './nfl_scouting/teams/teams_tests',
      './nfl_scouting/lists/lists_tests',
      './nfl_scouting/lists/list_tests',
      './nfl_scouting/draft/draft_tests',
      './nfl_scouting/draft/manage_draft_tests',
      './nfl_scouting/teams/team_tests',
      './nfl_scouting/players/player_tests',
      './nfl_scouting/reports/evaluation_report_tests',
      './nfl_scouting/reports/scouting_report_tests',
      './nfl_scouting/reports/interview_report_tests',
      './nfl_scouting/scenarios/incident_report_tests',
    ]
  },  
  5: {
    id: 5,
    name: 'NFL ESPN Staging',
    environment: 'staging',
    startUrl: 'https://football-espn.trumedianetworks.com:' + process.env.PORT_NUMBER,
    screenshotLocator: By.id('main'),
    testFiles: [
      './shared/login_tests',
      './nfl_espn/all_pages_tests'
    ]
  },
  6: {
    id: 6,
    name: 'NFL ESPN Production',
    environment: 'production',
    startUrl: 'https://football.espntrumedia.com/',
    screenshotLocator: By.id('main'),
    testFiles: [
      './shared/login_tests',
      './nfl_espn/all_pages_tests'
    ]
  },        
}

module.exports = scripts;