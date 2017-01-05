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
    browser.visit(url + 'player/31686');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateInterviewReportBtn();
    reportPage.waitForPageToLoad();
  });

  var profileUpdates = [
    { field: 'First Name', value: 'Dakota-Test', type: 'input', original: 'Dakota', parameterField: 'player.firstName'},
    { field: 'Last Name', value: 'Cornwell-Test', type: 'input', original: 'Cornwell', parameterField: 'player.lastName'},
    { field: 'Report Date', value: {year: 2016, month: 'Nov', day: 9}, expectedValue: '11/09/2016', type: 'date'},
    { field: 'Event', value: 'GI', type: 'dropdown'},
    { field: 'Phone', value: '555-555-5555', type: 'input', original: '', parameterField: 'player.phone' },
    { field: 'Email', value: 'dakota@test.com', type: 'input', original: '', parameterField: 'player.email' },
    { field: 'Address', value: '123 Fake Street', type: 'input', original: '', parameterField: 'player.address' },
    { field: 'Jags Pos', value: 'WR', type: 'dropdown', parameterField: 'position'},
    { field: 'Jersey', value: '28', type: 'input', parameterField: 'player.number', original: '11' }
  ];
  
  test.describe("#profile", function() {
    test.it('updating fields', function() {
    
      profileUpdates.forEach(function(attribute) {
        var field = attribute.parameterField || attribute.field;
        switch( attribute.type ) {
          case 'input':
            reportPage.changeProfileInput(field, attribute.value)
            break;
          case 'date':
            reportPage.changeProfileDate(field, attribute.value)
            break;
          case 'dropdown':
            reportPage.changeProfileDropdown(field, attribute.value)
            break;
        }
      })

      browser.refresh();
    });

    profileUpdates.forEach(function(attribute) {
      var field = attribute.parameterField || attribute.field;
      var expectedValue = attribute.expectedValue || attribute.value;

      test.it('updating ' + attribute.field + ' should persist on reload', function() {
        switch( attribute.type ) {
          case 'input':
            reportPage.getProfileInput(field).then(function(value) {
              assert.equal(value, expectedValue, attribute.field);
            });
            break;
          case 'date':
            reportPage.getProfileDate(field).then(function(value) {
              assert.equal(value, expectedValue, attribute.field);
            });
            break;
          case 'dropdown':
            reportPage.getProfileDropdown(field).then(function(value) {
              assert.equal(value, expectedValue, attribute.field);
            });
            break;
        }
      });
    });

    test.it('reverting profile fields back to original', function() {
      profileUpdates.forEach(function(attribute) {
        if (attribute.original != undefined) {
          var field = attribute.parameterField || attribute.field;
          switch( attribute.type ) {
            case 'input':
              reportPage.changeProfileInput(field, attribute.original)
              break;
            case 'date':
              reportPage.changeProfileDate(field, attribute.original)
              break;
            case 'dropdown':
              reportPage.changeProfileDropdown(field, attribute.original)
              break;
          }
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
    test.it('updating section fields', function() {
      reportPage.changeSectionText("Family Structure", 'family structure test');
      reportPage.changeSectionText("Personal Status", 'personal status test');
      reportPage.changeSectionText("Comments", 'comments test');
      reportPage.changeSectionText("Can Player Learn Team System?", 'team system test');
      reportPage.changePersonalStatusCheckbox('Married', true);
      reportPage.changePersonalStatusCheckbox('Children', true);
      reportPage.changeNumChildrenInput(3);
      reportPage.changeLearnSystemCheckbox(true)

      browser.refresh();
    });

    test.it('Family Structure text persists on reload', function() {
      reportPage.getSectionText('Family Structure').then(function(value) {
        assert.equal(value, 'family structure test', 'Family Structure text');
      });
    });

    test.it('Personal Status text persists on reload', function() {
      reportPage.getSectionText('Personal Status').then(function(value) {
        assert.equal(value, 'personal status test', 'Personal Status text');
      });
    });

    test.it('Comments text persists on reload', function() {
      reportPage.getSectionText('Comments').then(function(value) {
        assert.equal(value, 'comments test', 'Comments text');
      });
    });

    test.it('Can Player Learn Team System? text persists on reload', function() {
      reportPage.getSectionText('Can Player Learn Team System?').then(function(value) {
        assert.equal(value, 'team system test', 'Can Player Learn Team System? text');
      });
    });

    test.it('Married checkbox persists on reload', function() {
      reportPage.getPersonalStatusCheckbox('Married').then(function(value) {
        assert.equal(value, true, 'Married checkbox');
      });
    });

    test.it('Children checkbox persists on reload', function() {
      reportPage.getPersonalStatusCheckbox('Children').then(function(value) {
        assert.equal(value, true, 'Children checkbox');
      });
    });

    test.it('Can Player Learn System? checkbox persists on reload', function() {
      reportPage.getLearnSystemCheckbox().then(function(value) {
        assert.equal(value, true, 'Can Player Learn System? checkbox');
      });
    });

    test.it('Num children input persists on reload', function() {
      reportPage.getNumChildrenInput().then(function(value) {
        assert.equal(value, 3, 'Num children input');
      });
    })
  });
});