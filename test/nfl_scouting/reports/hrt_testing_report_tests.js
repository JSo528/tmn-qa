var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var By = require('selenium-webdriver').By;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var HrtTestingReportPage = require('../../../pages/nfl_scouting/reports/hrt_testing_report_page.js');
var playerPage, reportPage;

// Tests
test.describe('#Page: HrtTestingReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new HrtTestingReportPage(driver);
    browser.visit(url + 'player/31690');
    playerPage.waitForPageToLoad();
    playerPage.clickHrtTestingLink();
  });

  // test.describe('#profileSection', function() {
  //   var attributes = [
  //     { field: 'First Name', type: 'input', originalValue: 'SEAN', updatedValue: 'SEAN-Test' },
  //     { field: 'Last Name', type: 'input', originalValue: 'TITUS', updatedValue: 'TITUS-Test' },
  //     { field: 'Address', type: 'input', originalValue: '', updatedValue: '123 Fake Street' },
  //     { field: 'Report Date', type: 'reportDate', updatedValueInput: {year: 2012, month: 'Jun', day: 15}, updatedValue: '06/15/2012', originalValueInput: {year: 2014, month: 'Feb', day: 2}, originalValue: '02/02/2014' },
  //     { field: 'Draft Position', type: 'draftPosition', originalValue: 'DC', updatedValue: 'FB' },
  //     { field: 'Phone', type: 'input', originalValue: '', updatedValue: '628-214-2383' },
  //     { field: 'Email', type: 'input', originalValue: '', updatedValue: 'sean.titus@gmail.com' },
  //     { field: 'Agent', type: 'input', originalValue: '', updatedValue: 'Test Agent' },
  //   ];

  //   attributes.forEach(function(attr) {
  //     if (attr.originalValue  != undefined) {
  //       var title = attr.title || attr.field;
  //       test.it(title+ ' should have correct initial value', function() {
  //         reportPage.getProfileField(attr.type, attr.field).then(function(value) {
  //           assert.equal(value, attr.originalValue, title);
  //         });
  //       });
  //     }
  //   });

  //   test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
  //     this.timeout(120000);
  //     attributes.forEach(function(attr) {
  //       var input = attr.updatedValueInput || attr.updatedValue
  //       reportPage.changeProfileField(attr.type, attr.field, input );
  //     });
  //     browser.refresh();
  //     reportPage.waitForPageToLoad();
  //   });

  //   attributes.forEach(function(attr) {
  //     var title = attr.title || attr.field;
  //     test.it('updating ' + title + ' should persist on reload', function() {
  //       reportPage.getProfileField(attr.type, attr.field).then(function(value) {
  //         assert.equal(value, attr.updatedValue, title);
  //       });
  //     });
  //   });

  //   test.it('reverting fields', function() {
  //     attributes.forEach(function(attr) {
  //       if (attr.originalValue != undefined) {
  //         var input = attr.originalValueInput || attr.originalValue;
  //        reportPage.changeProfileField(attr.type, attr.field, input );
  //       }
  //     });
  //   });
  // });

  test.describe('#sigmaMotivation', function() {
    var sigmaAttributes = [
      { title: 'Dedication', inject: 'dedication', value: 6, originalValue: 0 },
      { title: 'Self-Efficacy', inject: 'selfEfficacy', value: 8, originalValue: 0 },
      { title: 'Focus', inject: 'focus', value: 3, originalValue: 0 },
      { title: 'Receptivity to Coaching', inject: 'receptivityToCoaching', value: 6, originalValue: 0 },
      { title: 'Affective Commitment', inject: 'affectiveCommitment', value: 10, originalValue: 0 },
      { title: 'Social Maturity', inject: 'socialMaturity', value: 5, originalValue: 0 },
      { title: 'Leadership Potential', inject: 'leadershipPotential', value: 4, originalValue: 0 },
      { title: 'Combative Attitude', inject: 'combativeAttitude', value: 1, originalValue: 0 }
    ];

    sigmaAttributes.forEach(function(attr) {
      if (attr.originalValue  != undefined) {
        var title = attr.title || attr.field;
        test.it(title+ ' should have correct initial value', function() {
          reportPage.getSigmaMotivationField(attr.inject).then(function(value) {
            assert.equal(value, attr.originalValue, title);
          });
        });
      }
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      this.timeout(120000);
      sigmaAttributes.forEach(function(attr) {
        reportPage.changeSigmaMotivationField(attr.inject, attr.value);
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    sigmaAttributes.forEach(function(attr) {
      var title = attr.title || attr.field;
      test.it('updating ' + title + ' should persist on reload', function() {
        reportPage.getSigmaMotivationField(attr.inject).then(function(value) {
          assert.equal(value, attr.value, title);
        });
      });
    });

    test.it('reverting fields', function() {
      sigmaAttributes.forEach(function(attr) {
        reportPage.changeSigmaMotivationField(attr.inject, attr.originalValue );
        driver.sleep(1000)
      });
    });
  });

  test.describe('#scoresSection', function() {
    var attributes = [
      { title: 'Matrices', inject:'matrices', type: 'input', originalValue: 0, updatedValue: 10 },
      { title: 'Mental Quickness', inject:'mentalQuickness', type: 'input', originalValue: 1, updatedValue: 5 },
      { title: 'Strengths', inject:'strengths', type: 'text', originalValue: '', updatedValue: 'strengths test' },
      { title: 'Weaknesses', inject:'weaknesses', type: 'text', originalValue: '', updatedValue: 'weaknesses tests' },
      { title: 'Overall Profile Score', type: 'profileScore', originalValue: '1 Poor', updatedValue: "7 Above Average" },
    ]

      attributes.forEach(function(attr) {
      if (attr.originalValue  != undefined) {
        var title = attr.title;
        test.it(title+ ' should have correct initial value', function() {
          reportPage.getScoresSectionField(attr.type, attr.inject).then(function(value) {
            assert.equal(value, attr.originalValue, title);
          });
        });
      }
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      this.timeout(120000);
      attributes.forEach(function(attr) {
        var input = attr.updatedValue
        reportPage.changeScoresSectionField(attr.type, attr.inject, input );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      var title = attr.title;
      test.it('updating ' + title + ' should persist on reload', function() {
        reportPage.getScoresSectionField(attr.type, attr.inject).then(function(value) {
          assert.equal(value, attr.updatedValue, title);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        if (attr.originalValue != undefined) {
          var input = attr.originalValue;
         reportPage.changeScoresSectionField(attr.type, attr.inject, input );
        }
      });
    });
  });
});