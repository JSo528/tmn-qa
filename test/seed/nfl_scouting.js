var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../lib/credentials.js');

// Page Objects
var Navbar = require('../../pages/nfl_scouting/navbar.js');
var PlayerPage = require('../../pages/nfl_scouting/players/player_page.js');
var LoginPage = require('../../pages/login_page.js');
var ScoutingReportPage = require('../../pages/nfl_scouting/reports/scouting_report_page.js');
var InterviewReportPage = require('../../pages/nfl_scouting/reports/interviewreport_page.js');
var EvaluationReportPage = require('../../pages/nfl_scouting/reports/evaluation_report_page.js');

var navbar, playerPage, loginPage, scoutingReportPage, interviewReportPage, evaluationReportPage;

test.describe('#Seed', function() {
  test.before(function() {
    navbar = new Navbar(driver);
    playerPage = new PlayerPage(driver);
    loginPage = new LoginPage(driver);

    loginPage.visit(url);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('adding data for scenarios/incident_report_tests', function() {
    this.timeout(600000);
    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();

    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();

    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();

    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();

    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();

    browser.visit(url+'player/31680');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
  });

  test.it('adding data for user_access_control_tests', function() {
    this.timeout(600000);
    
    navbar.clickLogoutLink();
    loginPage.login(credentials.testUser3.email, credentials.testUser3.password);
    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});
    scoutingReportPage.changeProfileField('dropdown', 'display.type', 'Fall');

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
    evaluationReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    interviewReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});

    playerPage.clickIncidentReportSpacer();
    playerPage.createIncidentReport('W10', {year: 2016, month: 'Nov', day: 20}, 'X', 'user access control tests');


    navbar.clickLogoutLink();
    loginPage.login(credentials.testUser2.email, credentials.testUser2.password);
    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});
    scoutingReportPage.changeProfileField('dropdown', 'display.type', 'All Star');

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
    evaluationReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    interviewReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});
    
    playerPage.clickIncidentReportSpacer();
    playerPage.createIncidentReport('W11', {year: 2016, month: 'Nov', day: 20}, 'X', 'user access control tests');


    navbar.clickLogoutLink();
    loginPage.login(credentials.adminTestUser.email, credentials.adminTestUser.password);
    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();

    browser.visit(url+'player/31685');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    playerPage.clickIncidentReportSpacer();
    playerPage.createIncidentReport('W12', {year: 2016, month: 'Nov', day: 20}, 'X', 'user access control tests');
  });

  test.it('adding data lists_tests', function() {
    this.timeout(600000);

    browser.visit(url+'player/31684');
    playerPage.addProfileList('TEST');

    browser.visit(url+'player/31688');
    playerPage.addProfileList('TEST');
  });

  test.it('adding data players_tests', function() {
    this.timeout(600000);

    // Delete Miles Young
    browser.visit(url+'player/31681');
    playerPage.clickDeleteBtn();

    // Add alerts for Vickers
  });
});