var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportsPage = require('../../../pages/nfl_scouting/reports/scouting_reports_page.js');
var playerPage, scoutingReportsPage;

var observationsUpdate = {
  jagsPosition: 'RB',
  height: '5900',
  flex: 'WR',
  weight: '250v',
  stPos1: 'KR',
  stPos2: 'LS',
  speed: '5.50e',
  stGrade: '5',
  bodyType: 'muscular',
  st: 'st test',
  alignment: 'left'
};

// Tests
test.describe('#Page: ScoutingReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new ScoutingReportsPage(driver);
    browser.visit(url + 'player/31686');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
  });

  test.describe("#observations", function() {
    test.before(function() {
      // change values
      // reload browser
    });



  });

  test.describe("#profile", function() {

  });

  test.describe("#reports/notes", function() {

  });

  test.describe("#character/injury", function() {

  });  

  test.describe("#metrics", function() {

  });

  test.describe("#incidentReports", function() {

  });
});