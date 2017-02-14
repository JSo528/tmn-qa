var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var By = require('selenium-webdriver').By;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var EvaulationReportPage = require('../../../pages/nfl_scouting/reports/evaluation_report_page.js');
var playerPage, reportPage;

// Tests
test.describe('#Page: EvaulationReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new EvaulationReportPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
  });

  test.describe("#reportSections", function() {
    var sections = [
      { field: 'Game Reports', type: 'text', initialValue: 'game report test', updatedValue: 'game report test update' },
      { field: 'Athletic Ability', type: 'grade', initialValue: 5, updatedValue: 3 },
      { field: 'Athletic Ability', type: 'text', initialValue: 'athletic ability test', updatedValue: 'athletic ability test update' },
      { field: 'Competes', type: 'grade', initialValue: 8, updatedValue: 6 },
      { field: 'Competes', type: 'text', initialValue: 'competes test', updatedValue: 'competes test update' },
      { field: 'Production', type: 'grade', initialValue: 9, updatedValue: 4 },
      { field: 'Production', type: 'text', initialValue: 'production test', updatedValue: 'production test update' },
      { field: 'Help Jags', type: 'checkbox', initialValue: true, updatedValue: false },
      { field: 'Help Jags', type: 'text', initialValue: 'helps jags test', updatedValue: 'help jags test update' },
      { field: 'Summary', type: 'text', initialValue: 'summary test', updatedValue: 'summary test update' }
    ];

    test.it("setting fields (if this test fails, itll cause a cascading effect for the other tests in this section)", function() {
      reportPage.clickGameReportsSpacer();
      sections.forEach(function(sect) {
        reportPage.changeSectionField(sect.type, sect.field, sect.initialValue );
      });
      browser.refresh();
      reportPage.clickGameReportsSpacer();
    });

    sections.forEach(function(sect) {
      test.it(`setting  ${sect.field} (${sect.type}) should persist on reload`, function() {
        reportPage.getSectionField(sect.type, sect.field).then(function(value) {
          assert.equal(value, sect.initialValue, sect.field);
        });
      });
    });

    test.it('updating fields (if this test fails, itll cause a cascading effect for the other tests in this section)', function() {
      sections.forEach(function(sect) {
        reportPage.changeSectionField(sect.type, sect.field, sect.updatedValue );
      });
      browser.refresh();
      reportPage.clickGameReportsSpacer();
    });

    sections.forEach(function(sect) {
      test.it(`updating  ${sect.field} (${sect.type}) should persist on reload`, function() {
        reportPage.getSectionField(sect.type, sect.field).then(function(value) {
          assert.equal(value, sect.updatedValue, sect.field);
        });
      });
    });
  });

  test.describe("#updating profile", function() {
    var attributes = [
      { field: 'First Name', type: 'input', originalValue: 'DAKOTA', updatedValue: 'Dakota-Test' },
      { field: 'Last Name', type: 'input', originalValue: 'CORNWELL', updatedValue: 'Cornwell-Test' },
      { field: 'Jersey', type: 'jersey', originalValue: 11, updatedValue: 16 },
      // { field: 'Draft Year', type: 'draftYear', originalValue: 2017, updatedValue: 2018 },
      { field: 'Position', type: 'position', originalValue: 'QB', updatedValue: 'RB' },
      { field: 'Height', type: 'input', originalValue: 6000, updatedValue: 6010 },
      { field: 'Weight', type: 'input', originalValue: 200, updatedValue: 220 },
      { field: 'Speed', type: 'input', originalValue: 5, updatedValue: 6 },
      // { field: 'Overall Grade', type: 'grade', originalValue: '', updatedValue: '8.0' },
    ];

    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        reportPage.getProfileField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it("updating fields (if this test fails, itll cause a cascading effect for the other tests in this section", function() {
      attributes.forEach(function(attr) {
        reportPage.changeProfileField(attr.type, attr.field, attr.updatedValue );
      });
      reportPage.changeProfileReportDate({year: 2012, month: 'Jun', day: 15});
      reportPage.changeProfileOverallGrade('8.0');
      browser.refresh();
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        reportPage.getProfileField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('changing report date should persist on reload', function() {
      reportPage.getProfileStat('Report Date').then(function(stat) {
        assert.equal(stat, '06/15/2012', 'Profile report date');
      });
    });

    test.it('changing overall grade should persist on reload', function() {
      reportPage.getProfileOverallGrade().then(function(stat) {
        assert.equal(stat, "8.0 1ˢᵗ Year Starter", 'Profile overall grade');
      });      
    });      

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        reportPage.changeProfileField(attr.type, attr.field, attr.originalValue );
      });
      reportPage.changeProfileOverallGrade('8.0');
    });
  });

  test.describe("#deleting", function() {
    test.it('selecting delete should change color and text of button', function() {
      reportPage.clickDeleteBtn();

      reportPage.getDeleteBtnText().then(function(text) {
        assert.equal(text, 'Undelete', 'button text');
      });

      reportPage.getDeleteBtnBgColor().then(function(bgColor) {
        assert.equal(bgColor, 'rgba(68, 157, 68, 1)', 'button bg color');
      });

    });
  });
});