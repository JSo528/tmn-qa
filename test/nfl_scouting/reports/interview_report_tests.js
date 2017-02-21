var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var By = require('selenium-webdriver').By;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var InterviewReportPage = require('../../../pages/nfl_scouting/reports/interview_report_page.js');
var playerPage, reportPage;

// Tests
test.describe('#Page: InterviewReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new InterviewReportPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    reportPage.waitForPageToLoad();
  });
  
  test.describe("#profile", function() {
    var profileAttributes = [
      { field: 'player.firstName', title: 'First Name', type: 'input', originalValue: 'DAKOTA', updatedValue: 'Dakota-Test' },
      { field: 'player.lastName', title: 'Last Name', type: 'input', originalValue: 'CORNWELL', updatedValue: 'Cornwell-Test' },
      { field: 'Report Date', type: 'date', updatedValue: '11/09/2016', updatedValueInput: {year: 2016, month: 'Nov', day: 9} },
      { field: 'Event', type: 'dropdown', updatedValue: 'GI'},
      { field: 'phoneField', title: 'Phone', type: 'input', originalValue: '', updatedValue: '555-555-5555' },
      { field: 'player.email', title: 'Email', type: 'input', originalValue: '', updatedValue: 'dakota@test.com' },
      { field: 'player.address', title: 'Address', type: 'input', originalValue: '', updatedValue: '123 Fake Street' },
      { field: 'player.agent', title: 'Agent', type: 'input', originalValue: '', updatedValue: 'Test Agent' },
      { field: 'player.draft.position', title: 'Draft Position', type: 'dropdown', originalValue: '', updatedValue: 'QB', placeholder: 'Select value' },
    ];

    profileAttributes.forEach(function(attr) {
      if (attr.originalValue  != undefined) {
        var title = attr.title || attr.field;
        test.it(title+ ' should have correct initial value', function() {
          reportPage.getProfileField(attr.type, attr.field, attr.placeholder).then(function(value) {
            assert.equal(value, attr.originalValue, title);
          });
        });
      }
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      profileAttributes.forEach(function(attr) {
        var input = attr.updatedValueInput || attr.updatedValue
        reportPage.changeProfileField(attr.type, attr.field, input );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    profileAttributes.forEach(function(attr) {
      var title = attr.title || attr.field;
      test.it('updating ' + title + ' should persist on reload', function() {
        reportPage.getProfileField(attr.type, attr.field, attr.placeholder).then(function(value) {
          assert.equal(value, attr.updatedValue, title);
        });
      });
    });

    test.it('reverting fields', function() {
      profileAttributes.forEach(function(attr) {
        if (attr.originalValue != undefined) {
          var input = attr.originalValueInput || attr.originalValue;
         reportPage.changeProfileField(attr.type, attr.field, input );
        }
      });
    });
  });

  test.describe('#Character/Injury', function() {
    var characterAttributes = ['+Test', '+Test(s)', 'Arrest', 'DV', 'DUI', 'Suspension',
      'Conc', 'Conc(s)', 'ACL', 'Skill Foot', 'JUCO', 'RS', 'Transfer'
    ];

    test.it('updating character fields', function() {
      characterAttributes.forEach(function(attribute) {
        reportPage.changeCharacterCheckbox(attribute, true);
      });

      browser.refresh();
    });

    characterAttributes.forEach(function(attribute) {
      test.it('updating ' + attribute + ' should persist on reload', function() {
        reportPage.getCharacterCheckbox(attribute).then(function(value) {
          assert.equal(value, true, attribute);
        });
      });
    });

    test.it('reverting character fields back to false', function() {
      characterAttributes.forEach(function(attribute) {
        reportPage.changeCharacterCheckbox(attribute, false);
      });
    });
  });

  test.describe('#Intelligence', function() {
    var intelligenceAttributes = ['Alert', 'Articulate', 'Slow', 'Knowledgable', 'Solid',
      'Clever', 'Confident', 'Average', 'Responsive', 'Smart', 'Unfocused', 'Bright'
    ];

    test.it('updating intelligence fields', function() {
      intelligenceAttributes.forEach(function(attribute) {
        reportPage.changeIntelligenceCheckbox(attribute, true);
      });

      browser.refresh();
    });

    intelligenceAttributes.forEach(function(attribute) {
      test.it('updating ' + attribute + ' should persist on reload', function() {
        reportPage.getIntelligenceCheckbox(attribute).then(function(value) {
          assert.equal(value, true, attribute);
        });
      });
    });

    test.it('reverting intelligence fields back to false', function() {
      intelligenceAttributes.forEach(function(attribute) {
        reportPage.changeIntelligenceCheckbox(attribute, false);
      });
    });    
  });

  test.describe('#Presentation', function() {
    var presentationAttributes = ['Poised', 'Humble', 'Aloof', 'Honest', 'Confident',
      'Soft Spoken', 'Cocky', 'Odd', 'Intense', 'Boring', 'Vocal', 'Articulate', 'Easy Going',
      'Arrogant', 'Abrasive', 'Nervous', 'Receptive', 'Polite', 'Religious', 'Insane', 'Rehearsed',
      'Eccentric', 'Proud', 'Timid', 'Overbearing', 'Outgoing', 'Con', 'Attentive', 'Unstable',
      'Tough', 'Brazen', 'Upbeat', 'Competitive'
    ];

    test.it('updating intelligence fields', function() {
      presentationAttributes.forEach(function(attribute) {
        reportPage.changePresentationCheckbox(attribute, true);
      });

      browser.refresh();
    });

    presentationAttributes.forEach(function(attribute) {
      test.it('updating ' + attribute + ' should persist on reload', function() {
        reportPage.getPresentationCheckbox(attribute).then(function(value) {
          assert.equal(value, true, attribute);
        });
      });
    });

    test.it('reverting intelligence fields back to false', function() {
      presentationAttributes.forEach(function(attribute) {
        reportPage.changePresentationCheckbox(attribute, false);
      });
    });  
  });

  test.describe('#SectionFields', function() {
    var sectionAttributes = [
      { field: 'Family Structure', type: 'text', value: 'family structure test' },
      { field: 'Personal Status', type: 'text', value: 'personal status test' },
      { field: 'Comments', type: 'text', value: 'comments test' },
      { field: 'Can Player Learn Team System?', type: 'text', value: 'team system test' },
      { field: 'Married', type: 'checkbox', value: true },
      { field: 'Children', type: 'checkbox', value: true },
      { field: 'Number Children', type: 'numChildren', value: 3 },
      { field: 'Learn System Checkbox', type: 'learnSystem', value: true }
    ];

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      sectionAttributes.forEach(function(attr) {
        reportPage.changeSectionField(attr.type, attr.field, attr.value );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    sectionAttributes.forEach(function(attr) {
      test.it("updating " + attr.field + " should persist on reload", function() {
        reportPage.getSectionField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.value, attr.field);
        });
      });
    });    
  });
});