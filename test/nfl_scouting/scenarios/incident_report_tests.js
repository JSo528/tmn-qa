var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var By = require('selenium-webdriver').By;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');
var InterviewReportPage = require('../../../pages/nfl_scouting/reports/interview_report_page.js');
var ManageDraftPage = require('../../../pages/nfl_scouting/draft/manage_draft_page.js');
var playerPage, scoutingReportPage, interviewReportPage, manageDraftPage, generatedText;

// Tests
test.describe('#Scenario: IncidentReport Editing', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    scoutingReportPage = new ScoutingReportPage(driver);
    interviewReportPage = new InterviewReportPage(driver);
    manageDraftPage = new ManageDraftPage(driver);
  });

  test.describe('#editing from scouting page', function() {
    test.before(function() {
      generatedText = extensions.generateRandomText(10);
    });

    test.it('start at player page', function() {
      browser.visit(url + 'player/31680');
    });

    test.it('edit incident report comment from scouting page', function() {
      playerPage.goToScoutingReport(1);
      scoutingReportPage.waitForPageToLoad();
      scoutingReportPage.clickIncidentReportSpacer();
      scoutingReportPage.changeIncidentReport(1, { comment: generatedText });
    });

    test.it('incident report on player profile displays changes', function() {
      scoutingReportPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.clickIncidentReportSpacer();
      playerPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on draft management page displays change', function() {
      playerPage.clickManageDraftLink();
      manageDraftPage.waitForPageToLoad();
      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on interview page displays change', function() {
      manageDraftPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.goToInterviewReport(1);
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.clickIncidentReportSpacer();
      interviewReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on other scouting page displays change', function() {
      interviewReportPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.goToScoutingReport(2);
      scoutingReportPage.waitForPageToLoad();
      scoutingReportPage.clickIncidentReportSpacer();
      scoutingReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });
  });

  test.describe('#editing from player profile', function() {
    test.before(function() {
      generatedText = extensions.generateRandomText(10);
    });

    test.it('start at player page', function() {
      browser.visit(url + 'player/31680');
    });

    test.it('edit incident report comment from player profile page', function() {
      playerPage.clickIncidentReportSpacer();
      playerPage.changeIncidentReport(1, { comment: generatedText });
    });

    test.it('incident report on scouting report page displays changes', function() {
      playerPage.goToScoutingReport(1);
      scoutingReportPage.waitForPageToLoad();
      scoutingReportPage.clickIncidentReportSpacer();
      scoutingReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on draft management page displays change', function() {
      scoutingReportPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.clickManageDraftLink();
      manageDraftPage.waitForPageToLoad();
      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on interview report page displays changes', function() {
      manageDraftPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.goToInterviewReport(1);
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.clickIncidentReportSpacer();
      interviewReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });
  });

  test.describe('#editing from draft management page', function() {
    test.before(function() {
      generatedText = extensions.generateRandomText(10);
    });

    test.it('start at player page', function() {
      browser.visit(url + 'player/31680');
    });

    test.it('edit incident report comment from draft management page', function() {
      playerPage.clickManageDraftLink();
      manageDraftPage.waitForPageToLoad();
      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.changeIncidentReport(1, { comment: generatedText });
    });

    test.it('incident report on player profile page displays change', function() {
      manageDraftPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.clickIncidentReportSpacer();
      playerPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on scouting report page displays changes', function() {
      playerPage.goToScoutingReport(1);
      scoutingReportPage.waitForPageToLoad();
      scoutingReportPage.clickIncidentReportSpacer();
      scoutingReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on interview report page displays changes', function() {
      scoutingReportPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.goToInterviewReport(1);
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.clickIncidentReportSpacer();
      interviewReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });
  });

  test.describe('#editing from interview report page', function() {
    test.before(function() {
      generatedText = extensions.generateRandomText(10);
    });

    test.it('start at player page', function() {
      browser.visit(url + 'player/31680');
    });

    test.it('edit incident report comment from interview page', function() {
      playerPage.goToInterviewReport(1);
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.clickIncidentReportSpacer();
      interviewReportPage.changeIncidentReport(1, { comment: generatedText });
    });

    test.it('incident report on player profile displays changes', function() {
      interviewReportPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.clickIncidentReportSpacer();
      playerPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on draft management page displays change', function() {
      playerPage.clickManageDraftLink();
      manageDraftPage.waitForPageToLoad();
      manageDraftPage.clickIncidentReportSpacer();
      manageDraftPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });

    test.it('incident report on other interview page displays change', function() {
      manageDraftPage.clickPlayerLink();
      playerPage.waitForPageToLoad();
      playerPage.goToInterviewReport(2);
      interviewReportPage.waitForPageToLoad();
      interviewReportPage.clickIncidentReportSpacer();
      interviewReportPage.getIncidentReportValue(1, 'comment').then(function(text) {
        assert.equal(text, generatedText);
      });
    });    
  });
});