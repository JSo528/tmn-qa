var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');

var navbar, playerPage, incidentReportdivNum, scoutingReportPage;

// Tests
test.describe('#Page: Player', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    scoutingReportPage = new ScoutingReportPage(driver);
    browser.visit(url + 'player/60193');
  })

  test.describe('#profile', function() {
    test.it('should have nfl team listed', function() {
      playerPage.getProfileTeamInput('NFL Team').then(function(stat) {
        assert.equal(stat, 'DEN');
      });
    });
  });

  test.describe('#scoutingReport', function() {
    test.it('clicking into scouting report should go to proScoutingReport page', function() {
      playerPage.goToScoutingReport(1);
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/proScoutingReport\//, 'page URL');
      });            
    });

    test.it('creating new scoutingReport should go to proScoutingReport page', function() {
      browser.back();
      playerPage.waitForPageToLoad();
      playerPage.clickCreateScoutingReportBtn();
      scoutingReportPage.waitForPageToLoad();
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/proScoutingReport\//, 'page URL');
      });            
    });
  });
});