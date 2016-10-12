webdriver = require('selenium-webdriver');
test = require('selenium-webdriver/testing');
chai = require('chai');
assert = chai.assert;
constants = require('../lib/constants.js');



function importTest(name, path) {
  test.describe(name, function () {
    require(path);
  });
}

test.describe('MLB Site', function() {
  this.timeout(constants.timeOuts.mocha);  

  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    url = constants.urls.mlb.dodgers;
    
    var Navbar = require('../pages/mlb/navbar.js');
    navbar = new Navbar(driver);
  });

  importTest("LoginPage", './mlb/login_page');
  // importTest("StandingsPage", './mlb/standings_page');
  // importTest("ScoresPage", './mlb/scores_page');
  // importTest("DetailedScorePage", './mlb/detailed_score_page');
  // importTest("TeamsPage", './mlb/teams_page');
  // importTest("TeamsPitchingPage", './mlb/teams_pitching_page');
  importTest("TeamsCatchingPage", './mlb/teams_catching_page');
  importTest("TeamsStatcastFieldingPage", './mlb/teams_statcast_fielding_page');

  test.after(function() {
    // driver.quit();
  });  
});
 