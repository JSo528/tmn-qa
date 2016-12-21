var scripts = {
  1: {
    id: 1,
    name: 'MLB Staging',
    environment: 'staging',
    startUrl: 'https://dodgers-staging.trumedianetworks.com:' + process.env.PORT_NUMBER,
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
    testFiles: [
      './shared/login_tests',
      './nfl_scouting/scout/scout_tests',
      './nfl_scouting/teams/teams_tests',
      './nfl_scouting/lists/lists_tests',
      './nfl_scouting/draft_tests',
      './nfl_scouting/teams/team_tests',
      './nfl_scouting/players/player_tests',
      './nfl_scouting/reports/evaluation_reports_tests',
    ]
  },  
  // 5: {
  //   id: 5,
  //   name: 'NFL Scouting Production',
  //   environment: 'production',
  //   fileName: 'nfl_scouting_production'
  // },    
}

module.exports = scripts;