var By = require('selenium-webdriver').By;

var scripts = {
  1: {
    id: 1,
    name: 'MLB Staging',
    environment: 'staging',
    startUrl: 'https://dodgers-staging.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './mlb/standings_tests': 1,
      './mlb/scores/scores_tests': 1,
      './mlb//scores/detailed_score_tests': 1,
      './mlb/teams/teams_tests': 1,
      './mlb/players/players_tests': 2,
      './mlb/umpires/umpires_tests': 2,
      './mlb/umpires/umpire_tests': 1,
      './mlb/teams/team_batting_tests': 3,
      './mlb/teams/team_pitching_tests': 3,
      './mlb/teams/team_catching_tests': 3,
      './mlb/teams/team_statcast_fielding_tests': 2,
      './mlb/players/player_batting_tests': 4,
      './mlb/players/player_pitching_tests': 4,
      './mlb/players/player_catching_tests': 4,
      './mlb/players/player_statcast_fielding_tests': 2,
      './mlb/groups_tests': 1,
      './mlb/custom_reports/rockies': 2,
      './mlb/custom_reports/phillies': 2,
      './mlb/custom_reports/marlins': 2,
      './mlb/custom_reports/brewers': 3,
      './mlb/custom_reports/tigers': 3,
      './mlb/custom_reports/twins': 3,
      './mlb/custom_reports/dbacks': 4,
      './mlb/custom_reports/angels': 4,
      './mlb/custom_reports/indians': 4,
      './mlb/data_comparison': 1
    }
  },
  2: {
    id: 2,
    name: 'MLB Production',
    environment: 'production',
    startUrl: 'https://dodgers.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './mlb/standings_tests': 1,
      './mlb/scores/scores_tests': 1,
      './mlb//scores/detailed_score_tests': 1,
      './mlb/teams/teams_tests': 1,
      './mlb/players/players_tests': 1,
      './mlb/umpires/umpires_tests': 2,
      './mlb/umpires/umpire_tests': 2,
      './mlb/teams/team_batting_tests': 2,
      './mlb/teams/team_pitching_tests': 2,
      './mlb/teams/team_catching_tests': 2,
      './mlb/teams/team_statcast_fielding_tests': 2,
      './mlb/players/player_batting_tests': 3,
      './mlb/players/player_pitching_tests': 3,
      './mlb/players/player_catching_tests': 3,
      './mlb/players/player_statcast_fielding_tests': 3,
      './mlb/groups_tests': 3,
      './mlb/custom_reports/rockies': 4,
      './mlb/custom_reports/phillies': 4,
      './mlb/custom_reports/marlins': 4,
      './mlb/custom_reports/brewers': 4,
      './mlb/custom_reports/tigers': 4,
      './mlb/custom_reports/twins': 4,
      './mlb/custom_reports/dbacks': 4,
      './mlb/custom_reports/angels': 4,
      './mlb/custom_reports/indians': 4
    }
  },
  3: {
    id: 3,
    name: 'MLB Example',
    environment: 'staging',
    startUrl: 'https://dodgers-staging.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './mlb/test_tests': 1
    }
  }, 
  4: {
    id: 4,
    name: 'NFL Scouting Staging',
    environment: 'production', // doesn't use a port
    startUrl: 'https://staging.jags.scouting.trumedianetworks.com/',
    screenshotLocator: By.css(".-content-container"),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      // './nfl_scouting/scout/scout_tests': 1,
      './nfl_scouting/teams/teams_tests': 1,
      './nfl_scouting/teams/team_tests': 1,
      './nfl_scouting/teams/pro_team_tests': 1,
      './nfl_scouting/lists/lists_tests': 1,
      './nfl_scouting/lists/list_tests': 1,
      // './nfl_scouting/draft/draft_tests',
      './nfl_scouting/draft/manage_draft_tests': 1,
      './nfl_scouting/players/search_tests': 3,
      './nfl_scouting/players/player_tests': 1,
      './nfl_scouting/players/pro_player_tests': 1,
      './nfl_scouting/players/measurables_tests': 2,
      './nfl_scouting/reports/evaluation_report_tests': 2,
      './nfl_scouting/reports/scouting_report_tests': 2,
      './nfl_scouting/reports/pro_scouting_report_tests': 2,
      './nfl_scouting/reports/interview_report_tests': 2,
      './nfl_scouting/reports/medical_report_tests': 2,
      './nfl_scouting/reports/hrt_testing_report_tests': 2,
      './nfl_scouting/reports/search_tests': 4,
      './nfl_scouting/scenarios/incident_report_tests': 2,
      './nfl_scouting/user_access_control_tests': 2,
      // './seed/nfl_scouting': 1
    }
  },  
  5: {
    id: 5,
    name: 'NFL Production',
    environment: 'production',
    startUrl: 'https://49ers.analytics.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './nfl/standings_tests': 4,
      './nfl/teams/teams_tests': 1,
      './nfl/teams/team_tests': 2,
      './nfl/players/players_tests': 1,
      './nfl/players/player_tests': 3,
      './nfl/scores/scores_tests': 2,
      './nfl/scores/game_tests': 3,
      './nfl/groups/groups_tests': 4,
      './nfl/performance/performance_tests': 4,
      './nfl/csv_exports': 4,
    }
  },  
  6: {
    id: 6,
    name: 'NFL Staging',
    environment: 'production',
    startUrl: 'https://49ers-staging.analytics.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './nfl/standings_tests': 2,
      './nfl/teams/teams_tests': 1,
      './nfl/teams/team_tests': 2,
      './nfl/players/players_tests': 1,
      './nfl/players/player_tests': 3,
      './nfl/scores/scores_tests': 2,
      './nfl/scores/game_tests': 1,
      './nfl/groups/groups_tests': 4,
      './nfl/performance/performance_tests': 4,
      './nfl/csv_exports': 3,
    }
  }, 
    7: {
    id: 7,
    name: 'Soccer Production',
    environment: 'production',
    startUrl: 'https://opta.trumedianetworks.com',
    screenshotLocator: By.id('main'),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './soccer/tables/table_tests': 1,
      './soccer/teams/teams_tests': 2,
      './soccer/teams/team_tests': 3,
      './soccer/players/players_tests': 4,
      './soccer/players/player_tests': 1,
      './soccer/matches/matches_tests': 2,
      './soccer/matches/match_tests': 3,
      './soccer/csv_exports': 4,
    }
  },
  8: {
    id: 8,
    name: 'NFL Scouting Development',
    environment: 'production', // doesn't use a port
    startUrl: 'localhost:3000/',
    screenshotLocator: By.css(".-content-container"),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      // './nfl_scouting/scout/scout_tests': 1,
      './nfl_scouting/teams/teams_tests': 1,
      './nfl_scouting/teams/team_tests': 1,
      './nfl_scouting/teams/pro_team_tests': 1,
      './nfl_scouting/lists/lists_tests': 1,
      './nfl_scouting/lists/list_tests': 1,
      // './nfl_scouting/draft/draft_tests',
      './nfl_scouting/draft/manage_draft_tests': 1,
      './nfl_scouting/players/search_tests': 1,
      './nfl_scouting/players/player_tests': 1,
      './nfl_scouting/players/pro_player_tests': 1,
      './nfl_scouting/players/measurables_tests': 1,
      './nfl_scouting/reports/evaluation_report_tests': 1,
      './nfl_scouting/reports/scouting_report_tests': 1,
      './nfl_scouting/reports/pro_scouting_report_tests': 1,
      './nfl_scouting/reports/interview_report_tests': 1,
      './nfl_scouting/reports/medical_report_tests': 1,
      './nfl_scouting/reports/hrt_testing_report_tests': 1,
      './nfl_scouting/reports/search_tests': 1,
      './nfl_scouting/scenarios/incident_report_tests': 1,
      './nfl_scouting/user_access_control_tests': 1,
      // './seed/nfl_scouting': 1
    }
  },  
  9: {
    id: 9,
    name: 'NFL Scouting Seed',
    environment: 'production', // doesn't use a port
    // startUrl: 'localhost:3000/',
    startUrl: 'https://staging.jags.scouting.trumedianetworks.com/',
    screenshotLocator: By.css(".-content-container"),
    requiredFiles: [
      './shared/login_tests'
    ],
    testFiles: {
      './seed/nfl_scouting': 1
    }
  },    
  // 5: {
  //   id: 5,
  //   name: 'NFL ESPN Staging',
  //   environment: 'staging',
  //   startUrl: 'https://football-espn.trumedianetworks.com:' + process.env.PORT_NUMBER,
  //   screenshotLocator: By.id('main'),
  //   testFiles: [
  //     './shared/login_tests',
  //     './nfl_espn/all_testss_tests'
  //   ]
  // },
  // 6: {
  //   id: 6,
  //   name: 'NFL ESPN Production',
  //   environment: 'production',
  //   startUrl: 'https://football.espntrumedia.com/',
  //   screenshotLocator: By.id('main'),
  //   testFiles: [
  //     './shared/login_tests',
  //     './nfl_espn/all_testss_tests'
  //   ]
  // },        

  // SEED DATA SCRIPTS
  // 11: {
  //   id: 11,
  //   name: 'NFL Scouting Seed Development',
  //   environment: 'production', // doesn't use a port
  //   startUrl: 'http://localhost:3000/',
  //   screenshotLocator: By.css(".-content-container"),
  //   testFiles: [
  //     './seed/nfl_scouting'
  //   ]
  // },  
  // 12: {
  //   id: 12,
  //   name: 'NFL Scouting Seed Staging',
  //   environment: 'production', // doesn't use a port
  //   startUrl: 'https://staging.jags.scouting.trumedianetworks.com/',
  //   screenshotLocator: By.css(".-content-container"),
  //   testFiles: [
  //     './seed/nfl_scouting'
  //   ]
  // },
}

function getQueueNums(fileWhitelist, scriptNum) {
  var testFiles = scripts[scriptNum].testFiles;

  // getQueueNums
  if (fileWhitelist.length > 0) {
    var queueNums = fileWhitelist.map(function(filename) {
      return testFiles[filename];
    })
  } else {
    var queueNums = [];
    for (var key in testFiles) {
      queueNums.push(testFiles[key]);
    }
  }

  var flatQueueNums = [].concat.apply([], queueNums);
  return uniqQueueNums = Array.from(new Set(flatQueueNums));
}

function getFiles(fileWhitelist, scriptNum, queueNum) {
  var testFiles = scripts[scriptNum].testFiles;
  var files = [];
  if (fileWhitelist.length > 0) {
    fileWhitelist.map(function(path) {
      if (testFiles[path] == queueNum) files.push(path);
    })
  } else {
    for (var path in testFiles) {
      if (testFiles[path] == queueNum) files.push(path);
    }
  }

  return files;
}


module.exports.metadata = scripts;
module.exports.getQueueNums = getQueueNums;
module.exports.getFiles = getFiles;

