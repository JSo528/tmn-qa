var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../lib/credentials.js');

// Page Objects
var Navbar = require('../../pages/nfl_scouting/navbar.js');
var PlayerPage = require('../../pages/nfl_scouting/players/player_page.js');
var LoginPage = require('../../pages/login_page.js');
var navbar, playerPage, loginPage;

/* NOTE
For player Kevin Medler, users qatest1@trumedianetworks.com, qatest2@trumedianetworks.com, and 
qatest3@trumedianetworks.com have all created an interview report, evaluation report, and scouting report.
qatest1@ is an admin user and should be able to see everyone's reports while qatest2@ and qatest3@ are 
regular users and should only be able to see their own reports.
*/

test.describe('#User Access Control Tests', function() {
  test.before(function() {
    navbar = new Navbar(driver);
    playerPage = new PlayerPage(driver);
    loginPage = new LoginPage(driver);
  });

  test.it('regular user should only be able to see own scouting reports', function() {
    navbar.clickLogoutLink();
    loginPage.login(credentials.testUser2.email, credentials.testUser2.password);
    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();

    playerPage.getScoutingReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest2@trumedianetworks.com'], emails);
    });
  });

  test.it('regular user should only be able to see own interview reports', function() {
    playerPage.getInterviewReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest2@trumedianetworks.com'], emails);
    });
  });

  test.it('regular user should only be able to see own evaluation reports', function() {
    playerPage.getEvaluationReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest2@trumedianetworks.com'], emails);
    });
  });

  test.it('regular user should be able to see all incident reports', function() {
    playerPage.getIncidentReportCount().then(function(count) {
      assert.equal(count, 3);
    });
  });

  test.it('admin user should be able to see all scouting reports', function() {
    navbar.clickLogoutLink();
    loginPage.login(credentials.adminTestUser.email, credentials.adminTestUser.password);
    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();

    playerPage.getScoutingReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest1@trumedianetworks.com', 'qatest2@trumedianetworks.com', 'qatest3@trumedianetworks.com'], emails);
    });
  });

  test.it('admin user should be able to see all interview reports', function() {
    playerPage.getInterviewReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest1@trumedianetworks.com', 'qatest2@trumedianetworks.com', 'qatest3@trumedianetworks.com'], emails);
    });
  });

  test.it('admin user should be able to see all evaluation reports', function() {
    playerPage.getEvaluationReportAuthors().then(function(emails) {
      assert.sameMembers(['qatest1@trumedianetworks.com', 'qatest2@trumedianetworks.com', 'qatest3@trumedianetworks.com'], emails);
    });
  });

  test.it('admin user should be able to see all incident reports', function() {
    playerPage.getIncidentReportCount().then(function(count) {
      assert.equal(count, 3);
    });
  });  
});