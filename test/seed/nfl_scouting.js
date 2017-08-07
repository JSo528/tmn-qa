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
var InterviewReportPage = require('../../pages/nfl_scouting/reports/interview_report_page.js');
var EvaluationReportPage = require('../../pages/nfl_scouting/reports/evaluation_report_page.js');
var ManageDraftPage = require('../../pages/nfl_scouting/draft/manage_draft_page.js');
var MeasurablesPage = require('../../pages/nfl_scouting/players/measurables_page.js');
var TeamPage = require('../../pages/nfl_scouting/teams/team_page.js');
var navbar, playerPage, loginPage, scoutingReportPage, interviewReportPage, evaluationReportPage, manageDraftPage, measurablesPage, teamPage;

test.describe('#Seed', function() {
  test.before(function() {
    navbar = new Navbar(driver);
    playerPage = new PlayerPage(driver);
    loginPage = new LoginPage(driver);
    scoutingReportPage = new ScoutingReportPage(driver);
    interviewReportPage = new InterviewReportPage(driver);
    evaluationReportPage = new EvaluationReportPage(driver);
    manageDraftPage = new ManageDraftPage(driver);
    measurablesPage = new MeasurablesPage(driver);
    teamPage = new TeamPage(driver);
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
    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});
    scoutingReportPage.changeProfileField('dropdown', 'display.type', 'Fall');

    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
    evaluationReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});

    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    interviewReportPage.changeProfileField('date', 'Report Date', {year: 2012, month: 'Jun', day: 15});

    playerPage.clickIncidentReportSpacer();
    playerPage.createIncidentReport('W10', {year: 2016, month: 'Nov', day: 20}, 'X', 'user access control tests');


    navbar.clickLogoutLink();
    loginPage.login(credentials.testUser2.email, credentials.testUser2.password);
    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});
    scoutingReportPage.changeProfileField('dropdown', 'display.type', 'All Star');

    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
    evaluationReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});

    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    interviewReportPage.changeProfileField('date', 'Report Date', {year: 2015, month: 'Dec', day: 7});
    
    playerPage.clickIncidentReportSpacer();
    playerPage.createIncidentReport('W11', {year: 2016, month: 'Nov', day: 20}, 'X', 'user access control tests');


    navbar.clickLogoutLink();
    loginPage.login(credentials.adminTestUser.email, credentials.adminTestUser.password);
    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();

    browser.visit(url+'player/3690');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();

    browser.visit(url+'player/3690');
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
    navbar.clickLogoutLink();
    loginPage.login(credentials.adminTestUser.email, credentials.adminTestUser.password);

    // Delete Miles Young
    browser.visit(url+'player/31681');
    playerPage.clickDeleteBtn();

    // Add alerts for Vickers
    browser.visit(url+'player/31684');
    playerPage.clickManageDraftLink();
    manageDraftPage.changeProfileInput('Alerts', 'au')
  });

  test.it('adding data measurables_tests', function() {
    // Add NIC data for live row
    browser.visit(url + 'player/31682');
    playerPage.clickMeasurablesLink();
    
    measurablesPage.clickCreateButton();
    measurablesPage.changeStatField('dropdown', 1, 'event', 'NIC');
    measurablesPage.changeStatField('date', 1, 'date', '02/15/2017');
    measurablesPage.changeStatField('', 1, 'fieldCondition', 'FO2 V');
    measurablesPage.changeStatField('', 1, 'height', '6040');
    measurablesPage.changeStatField('', 1, 'weight', '320');
    measurablesPage.changeStatField('', 1, 'arm', '12 1/2');
    measurablesPage.changeStatField('', 1, 'wing', '20 1/2');
    measurablesPage.changeStatField('', 1, 'hand', '8 1/2');
    measurablesPage.changeStatField('', 1, 'm40_1', '4.3');
    measurablesPage.changeStatField('', 1, 'm10_1', '1.2');
    measurablesPage.changeStatField('', 1, 'm20_1', '2.4');
    measurablesPage.changeStatField('', 1, 'verticalJump', '4030');
    measurablesPage.changeStatField('', 1, 'broadJump', "7'09");
    measurablesPage.changeStatField('', 1, 'benchPress', '32');
    measurablesPage.changeStatField('', 1, 'shuttles20', '8.5');
    measurablesPage.changeStatField('', 1, 'shuttles60', '19.5');
    measurablesPage.changeStatField('', 1, 'shuttles3', '5.0');
  });

  test.it('adding proScoutingReport', function() {
    browser.visit(url + 'player/4893');
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeProfileField("dropdown", "acquire", "Y" );
    scoutingReportPage.changeProfileField("dropdown", "acquire", "↑" );
  });

  test.it('adding scoutingReport', function() {
    browser.visit(url + 'player/4487');
    playerPage.clickCreateScoutingReportBtn();
    scoutingReportPage.changeObservationField("input", "Speed", "4.2" );
  });

  test.it('adding proTeam data', function() {
    browser.visit(url + 'team/1147');
    teamPage.changeTableStatField('colorCheckbox', 1, 'X Alert', true, {selectedColor: 'rgba(217, 83, 79, 1)'});
    teamPage.changeTableStatField('colorCheckbox', 1, 'C Alert', true, {selectedColor: 'rgba(0, 0, 0, 1)'});
  });
});