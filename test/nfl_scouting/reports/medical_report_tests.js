var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var By = require('selenium-webdriver').By;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var MedicalReportPage = require('../../../pages/nfl_scouting/reports/medical_report_page.js');
var playerPage, reportPage;

// Tests
test.describe('#Page: MedicalReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new MedicalReportPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateMedicalReportBtn();
    reportPage.waitForPageToLoad();
  });
  
  test.describe("#profile", function() {
    test.it("computedGrade should display after checking profile boxes", function() {
      reportPage.changeProfileCheckbox("1", true);
      reportPage.changeProfileCheckbox("2*", true);
      reportPage.changeProfileCheckbox("L", true);
      reportPage.changeProfileCheckbox("m", true);
      reportPage.getComputedGrade().then(function(stat) {
        assert.equal(stat, '12*Lm', "computedGrade field")
      })
    });

    test.it("computedGrade should persist checkboxes on reload", function() {
      browser.refresh();
      reportPage.getProfileCheckbox("1").then(function(stat) {
        assert.equal(stat, true, '1 input value')
      });

      reportPage.getProfileCheckbox("2*").then(function(stat) {
        assert.equal(stat, true, '2* input value')
      });

      reportPage.getProfileCheckbox("L").then(function(stat) {
        assert.equal(stat, true, 'L input value')
      });

      reportPage.getProfileCheckbox("m").then(function(stat) {
        assert.equal(stat, true, 'm input value')
      });

      reportPage.getProfileCheckbox("2").then(function(stat) {
        assert.equal(stat, false, '2 input value')
      });
    });

    test.it("computedGrade should persist computedGrade on reload", function() {
      reportPage.getComputedGrade().then(function(stat) {
        assert.equal(stat, '12*Lm', "computedGrade field")
      })
    });
  });

  test.describe("#comments", function() {
    var commentAttributes = [
      { field: 'General Comments', type: 'text', value: 'general comments test' },
      { field: 'General Comments', type: 'date', value: {year: 2015, month: 'Feb', day: 11}, displayValue: '02/11/2015' },
      { field: 'Orthopedic Comments', type: 'text', value: 'orthopedic comments test' },
      { field: 'Orthopedic Comments', type: 'date', value: {year: 2016, month: 'Apr', day: 20}, displayValue: '04/20/2016' },
      { field: 'Orthopedic Comments', type: 'doctor', value: 'Joe Doctor' },
      { field: 'Radiology Comments', type: 'text', value: 'radiology comments test' },
      { field: 'Radiology Comments', type: 'date', value: {year: 2015, month: 'Dec', day: 8}, displayValue: '12/08/2015' },
      { field: 'Radiology Comments', type: 'doctor', value: 'Jane Doctor' },
      { field: 'Internal Comments', type: 'text', value: 'internal comments test' },
      { field: 'Internal Comments', type: 'date', value: {year: 2015, month: 'Feb', day: 7}, displayValue: '02/07/2015' },
      { field: 'Internal Comments', type: 'doctor', value: 'Jane Doctor' },
    ];

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      commentAttributes.forEach(function(attr) {
        reportPage.changeCommentsField(attr.type, attr.field, attr.value );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    commentAttributes.forEach(function(attr) {
      test.it("updating " + attr.field + ": " + attr.type +  " should persist on reload", function() {
        var expValue = attr.displayValue || attr.value;
        reportPage.getCommentsField(attr.type, attr.field).then(function(value) {
          assert.equal(value, expValue, attr.field);
        });
      });
    });    
  });
});