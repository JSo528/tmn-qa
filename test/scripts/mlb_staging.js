var test = require('selenium-webdriver/testing');
var util = require('../../test/util');

test.describe('MLB Staging Site', function() {
  util.importTestSetup(this);

  test.before(function() {
    var Navbar = require('../../pages/mlb/navbar.js');
    navbar = new Navbar(driver);
    url = 'https://dodgers-staging.trumedianetworks.com:' + testRun.portNumber;
  });

  util.importTest("LoginPage", './mlb/login_page');
  util.importTest("StandingsPage", './mlb/standings_page');
  util.importTest("ScoresPage", './mlb/scores_page');
  util.importTest("DetailedScorePage", './mlb/detailed_score_page');
  util.importTest("TeamsPage", './mlb/teams_page');
  // util.importTest("StagingData", './mlb/staging_data');
});
 

