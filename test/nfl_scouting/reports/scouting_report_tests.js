var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');
var playerPage, reportsPage;           
           
// Tests
test.describe('#Page: ScoutingReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new ScoutingReportPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateScoutingReportBtn();
    reportPage.waitForPageToLoad();
  });

  test.describe("#observations", function() {
    var observationAttributes = [
      { field: 'Jags. Pos.', type: 'dropdown', originalValue: 'QB', value: 'FB' },
      { field: 'Height', type: 'input', value: '5900i' },
      { field: 'Flex', type: 'dropdown', value: 'WR' },
      { field: 'ST Pos. 1', type: 'dropdown', value: 'KR' },
      { field: 'ST Pos. 2', type: 'dropdown', value: 'LS' },
      { field: 'ST Grade', type: 'dropdown', value: '4 Average' },
      { field: 'Speed', type: 'input', value: '5.50e' },
      { field: 'frame', title: 'Frame', type: 'text', value: 'muscular' },
      { field: 'specialTeams', title: 'Special Teams', type: 'text', value: 'st test' },
      { field: 'alignment', title: 'Alignment', type: 'text', value: 'left' }
    ];

    test.it("updating fields (if this test fails, itll cause a cascading effect for the other tests in this section", function() {
      observationAttributes.forEach(function(attr) {
        reportPage.changeObservationField(attr.type, attr.field, attr.value );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    observationAttributes.forEach(function(attr) {
      var title = attr.title || attr.field;
      test.it('updating ' + title + ' should persist on reload', function() {
        reportPage.getObservationField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.value, title);
        });
      });
    });

    test.it('reverting fields', function() {
      observationAttributes.forEach(function(attr) {
        if (attr.originalValue != undefined) {
         reportPage.changeObservationField(attr.type, attr.field, attr.originalValue );
        }
      });
    });
  });

  test.describe("#profile", function() {
    var attributes = [
      { field: 'First Name', type: 'input', originalValue: 'DAKOTA', updatedValue: 'Dakota-Test2' },
      { field: 'Last Name', type: 'input', originalValue: 'CORNWELL', updatedValue: 'Cornwell-Test2' },
      { field: 'player.class', title: 'Class', type: 'dropdown', originalValue: 'SR', updatedValue: 'JR' },
      { field: 'Hometown', type: 'input', originalValue: '', updatedValue: 'Mobile, AL' },
      { field: 'player.number', title: 'Jersey', type: 'input', originalValue: 11, updatedValue: 16 },
      // { field: 'Draft Year', type: 'date', originalValue: 2017, updatedValue: 2018, originalValueInput: { year: 2017 }, updatedValueInput: { year: 2018 } },
      { field: 'Starter', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'JUCO', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'RS', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'T', title: 'T Flag', type: 'checkbox', updatedValue: true },
      { field: 'Transfer', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'position', title: 'Position', type: 'dropdown', originalValue: 'QB', updatedValue: 'RB' },
      { field: 'Speed', type: 'input', updatedValue: '5.40i' },
      { field: 'Height', type: 'input', updatedValue: '6010v' },
      { field: 'Weight', type: 'input', updatedValue: '240i' },
      { field: 'flags', title: 'Flags', type: 'input', updatedValue: 'ac' },
      { field: 'display.type', title: 'Report Type', type: 'dropdown', updatedValue: 'Fall' },
      { field: 'overallGrade', title: 'Grade', type: 'dropdown', updatedValue: '9.0 1ˢᵗ Year Starter' },
      { field: 'Report Date', type: 'date', updatedValueInput: {year: 2012, month: 'Jun', day: 15}, updatedValue: '06/15/2012' },
      { field: 'DOB', type: 'date', updatedValueInput: {year: 2012, month: 'May', day: 11}, updatedValue: '05/11/2012' },
    ];

    attributes.forEach(function(attr) {
      if (attr.originalValue  != undefined) {
        var title = attr.title || attr.field;
        test.it(title+ ' should have correct initial value', function() {
          reportPage.getProfileField(attr.type, attr.field).then(function(value) {
            assert.equal(value, attr.originalValue, title);
          });
        });
      }
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      attributes.forEach(function(attr) {
        var input = attr.updatedValueInput || attr.updatedValue
        reportPage.changeProfileField(attr.type, attr.field, input );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      var title = attr.title || attr.field;
      test.it('updating ' + title + ' should persist on reload', function() {
        reportPage.getProfileField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.updatedValue, title);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        if (attr.originalValue != undefined) {
          var input = attr.originalValueInput || attr.originalValue;
         reportPage.changeProfileField(attr.type, attr.field, input );
        }
      });
    });
  });

  test.describe("#notes", function() {
    var notesAttributes = [
      { field: 'Game Reports', type: 'text', value: 'game reports text test' },
      { field: 'Run', type: 'text', value: 'run text test' },
      { field: 'Pass', type: 'text', value: 'pass text test' },
      { field: 'Summary', type: 'text', value: 'summary text test' },
      { field: 'Help Jags', type: 'text', value: 'help jags text test' },
      { field: 'One Liner', type: 'text', value: 'one liner text test' },
      { field: 'Football Character', type: 'text', value: 'football character text test' },
      { field: 'Production', type: 'text', value: 'production text test' },
      { field: 'Personal Character', type: 'text', value: 'personal character text test' },
      { field: 'Durability', type: 'text', value: 'durability text test' },
      { field: 'Mental/Learning', type: 'text', value: 'mental learning text test' },
      { field: 'Notes', type: 'text', value: 'notes text test' },
      { field: 'Run', type: 'grade', value: 6 },
      { field: 'Pass', type: 'grade', value: 5 },
      { field: 'Football Character', type: 'grade', value: 4 },
      { field: 'Personal Character', type: 'grade', value: 3 },
      { field: 'Mental/Learning', type: 'grade', value: 2 },
      { field: 'Help Jags', type: 'jagsCheckbox', value: true },
      
    ];

    test.it("updating fields (if this test fails, itll cause a cascading effect for the other tests in this section)", function() {
      reportPage.clickGameReportsSpacer();
      notesAttributes.forEach(function(attr) {
        reportPage.changeNotesField(attr.type, attr.field, attr.value );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
      reportPage.clickGameReportsSpacer();
    });

    notesAttributes.forEach(function(attr) {
      test.it(`updating ${attr.field} (${attr.type}) should persist on reload`, function() {
        reportPage.getNotesField(attr.type, attr.field).then(function(value) {
          assert.equal(value, attr.value, attr.field);
        });
      });
    });
  });

  test.describe("#character/injury", function() {
    var characterAttributes = [
      { field: 'Conc(s)', originalValue: false, updatedValue: true },
      { field: '+Test', originalValue: false, updatedValue: true },
      { field: '+Test(s)', originalValue: false, updatedValue: true },
      { field: 'Arrest', originalValue: false, updatedValue: true },
      { field: 'DV', originalValue: false, updatedValue: true },
      { field: 'DUI', originalValue: false, updatedValue: true },
      { field: 'Suspension', originalValue: false, updatedValue: true },
      { field: 'Jags Fit', originalValue: false, updatedValue: true },
      { field: 'Conc', originalValue: false, updatedValue: true },
      { field: 'ACL', originalValue: false, updatedValue: true },
      { field: 'Skill Foot', originalValue: false, updatedValue: true },
      { field: 'JUCO', originalValue: false, updatedValue: true },
      { field: 'RS', originalValue: false, updatedValue: true },
      { field: 'Transfer', originalValue: false, updatedValue: true }
    ];

    characterAttributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        reportPage.getCharacterCheckbox(attr.field).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
      characterAttributes.forEach(function(attr) {
        reportPage.changeCharacterCheckbox(attr.field, attr.updatedValue );
      });

      browser.refresh();
      reportPage.waitForPageToLoad();
    });

    characterAttributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        reportPage.getCharacterCheckbox(attr.field).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      characterAttributes.forEach(function(attr) {
        reportPage.changeCharacterCheckbox(attr.field, attr.originalValue );
      });
    });
  });  

  test.describe('#metrics', function() {
    var metricInputs = [
      { title: 'Football Character', value: 6 },
      { title: 'Personal Character', value: 8 },
      { title: 'Work Ethic', value: 4 },
      { title: 'Compete & Toughness', value: 5 },
      { title: 'Durability', value: 9 },
      { title: 'Mental/Learning', value: 2 },
      { title: 'Productivity', value: 7 },
      { title: 'Athletic Ability', value: 8 },
      { title: 'Explosion', value: 6 },
      { title: 'Instincts', value: 4 },
      { title: 'Speed', value: 8 },
      { title: 'Size', value: 5 },
      { title: 'Play Strength', value: 9 },
      { title: 'ACC Short', value: 6 },
      { title: 'ACC Long', value: 8 },
      { title: 'Arm Strength', value: 5 },
      { title: 'Leadership', value: 3 },
      { title: 'Dependability', value: 4 },
      { title: 'Awareness', value: 6 },
      { title: 'Security', value: 5 },
      { title: 'Pocket Str', value: 4 },
      { title: 'Drop Set', value: 8 },
      { title: 'Mechanics', value: 5 },
      { title: 'Release', value: 7 },
      { title: 'Delivery', value: 4 },
      { title: 'Mobility', value: 8 },
      { title: 'Throw on Move', value: 5 }
    ];

    var metricsSectionAverages = [
      { title: 'Major Factors', value: 5.9 },
      { title: 'Critical Factors', value: 6.0 },
      { title: 'Position Skills', value: 5.8 }
    ];

    var gradeGroupSkills = [
      { title: 'Top Starter', inject: 'topStarterSkills', value: ['Personal Character', 'Durability', 'Productivity', 'Athletic Ability', 'Speed', 'Play Strength', 'ACC Long', 'Drop Set', 'Release', 'Mobility'] },
      { title: 'Starter', inject: 'starterSkills', value: ['Run Game', 'Football Character', 'Explosion', 'ACC Short', 'Awareness'] },
      { title: 'Backup', inject: 'backupSkills', value: ['Pass Game', 'Compete & Toughness', 'Size', 'Arm Strength', 'Security', 'Mechanics', 'Throw on Move'] }
    ]; 

    test.describe("#position: QB", function() {
      test.it("updating fields (if this test fails, it'll cause a cascading effect for the other tests in this section)", function() {
        this.timeout(120000);
        metricInputs.forEach(function(attribute) {
          reportPage.changeMetricsInput(attribute.title, attribute.value);
        });
        browser.refresh();
        reportPage.waitForPageToLoad();
      });

      metricInputs.forEach(function(attribute) {
        test.it(attribute.title + ' should persist on reload', function() {
          reportPage.getMetricsInput(attribute.title).then(function(stat) {
            assert.equal(stat, attribute.value, 'Metrics - ' + attribute.title);
          });
        }); 
      });

      metricsSectionAverages.forEach(function(section) {
        test.it(section.title + ' average should persist on reload', function() {
          reportPage.getMetricsSectionAverage(section.title).then(function(stat) {
            assert.equal(stat, section.value, section.title + ' avg');
          });
        });
      });

      gradeGroupSkills.forEach(function(group) {
        test.it(group.title + ' skills should show correct skills', function() {
          reportPage.getGradeGroupSkills(group.inject).then(function(skills) {
            assert.sameMembers(group.value, skills, group.title + ' skills');
          });
        });
      });
    });

    var positionMetrics = [
      {
        position: 'DC', // FS, SS
        inputs: [
          { title: 'Concentration', value: 4 },
          { title: 'Coverage Press Man', value: 8 },
          { title: 'Coverage Off Man', value: 3 },
          { title: 'Coverage Zone', value: 6 },
          { title: 'Close', value: 2 },
          { title: 'Pedal', value: 7 },
          { title: 'Transition', value: 9 },
          { title: 'Range', value: 1 },
          { title: 'Ball Skills', value: 5 },
          { title: 'Run Support', value: 8 },
          { title: 'Tackling', value: 7 }
        ], 
        sectionAvg: 5.5
      },
      {
        position: 'DE', // DT, LEO, NT
        inputs: [
          { title: 'First Step Explosion', value: 4 },
          { title: '1 Gap Ability', value: 8 },
          { title: '2 Gap Ability', value: 3 },
          { title: 'Lateral Leverage', value: 6 },
          { title: 'Disengage/UOH', value: 2 },
          { title: 'Pursuit', value: 7 },
          { title: 'Tackling', value: 9 },
          { title: 'Pass Rush Power', value: 1 },
          { title: 'Pass Rush Speed', value: 5 },
          { title: 'Pass Rush Moves', value: 8 }
        ], 
        sectionAvg: 5.3
      },
      {
        position: 'FB',
        inputs: [
          { title: 'Start', value: 4 },
          { title: 'Adjust', value: 8 },
          { title: 'Blocking', value: 3 },
          { title: 'Blocking Run', value: 6 },
          { title: 'Blocking Pass', value: 2 },
          { title: 'Routes', value: 7 },
          { title: 'Catching Skills', value: 9 },
          { title: 'RAC', value: 1 },
          { title: 'Ball Security', value: 5 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 5.0
      },       
      {
        position: 'K', // P
        inputs: [
          { title: 'Right Left', value: 4 },
          { title: 'Leg Speed', value: 8 },
          { title: 'Leg Strength', value: 3 },
          { title: 'Accuracy Short', value: 6 },
          { title: 'Accuracy Long', value: 2 },
          { title: 'Rise', value: 7 },
          { title: 'In Elements', value: 9 },
          { title: 'Pressure Kicks', value: 1 },
          { title: 'Kickoff', value: 5 },
          { title: 'Coverage', value: 8 },
        ], 
        sectionAvg: 5.3
      },   
      {
        position: 'KR', // PR, RS, ST-D, ST-O
        inputs: [
          { title: 'Catching Skills', value: 4 },
          { title: 'Run Skills', value: 8 },
          { title: 'Ball Security', value: 3 },
          { title: 'Courage', value: 6 },
          { title: 'Key Plays', value: 2 }
        ], 
        sectionAvg: 4.6
      },   
      {
        position: 'LS',
        inputs: [
          { title: 'Accuracy', value: 4 },
          { title: 'Velocity', value: 8 },
          { title: 'Blocking', value: 3 },
          { title: 'Coverage Ability', value: 6 },
          { title: 'Tackling', value: 2 },
          { title: 'Position Versatility', value: 9 }
        ], 
        sectionAvg: 5.3
      }, 
      {
        position: 'LT', // OC, OG, RT
        inputs: [
          { title: 'Initial Quickness', value: 4 },
          { title: 'Second Level', value: 8 },
          { title: 'Pull', value: 3 },
          { title: 'Sustain', value: 6 },
          { title: 'Pass Set', value: 2 },
          { title: 'Pass Set vs Power', value: 9 },
          { title: 'Pass Set vs Speed', value: 4 },
          { title: 'Pass Set vs Counter', value: 8 },
          { title: 'Pass Set vs Blitz', value: 8 },
          { title: 'Second Position Value', value: 7 }
        ], 
        sectionAvg: 5.9
      },     
      {
        position: 'MB', // OTTO, WB
        inputs: [
          { title: 'Stack Ability', value: 8 },
          { title: 'Disengage/UOH', value: 5 },
          { title: 'Lateral Ability', value: 3 },
          { title: 'Pursuit', value: 6 },
          { title: 'Tackling', value: 2 },
          { title: 'Coverage Man', value: 9 },
          { title: 'Coverage Zone', value: 4 },
          { title: 'Ball Skills', value: 8 },
          { title: 'Blitz', value: 8 }
        ], 
        sectionAvg: 5.9
      }, 
      {
        position: 'RB',
        inputs: [
          { title: 'Inside Run', value: 8 },
          { title: 'Outside Run', value: 5 },
          { title: 'Start', value: 3 },
          { title: 'Vision', value: 6 },
          { title: 'Elude', value: 2 },
          { title: 'YAC', value: 9 },
          { title: 'Ball Security', value: 4 },
          { title: 'Routes', value: 8 },
          { title: 'Catching Skills', value: 7 },
          { title: 'Blocking', value: 9 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 6.1
      }, 
      {
        position: 'TEF', // TEY
        inputs: [
          { title: 'Initial Quickness', value: 4 },
          { title: 'Blocking Run', value: 8 },
          { title: 'Blocking Pass', value: 3 },
          { title: 'Release', value: 6 },
          { title: 'Routes', value: 2 },
          { title: 'Separation Ability', value: 9 },
          { title: 'Vertical Threat', value: 4 },
          { title: 'Catching Skills', value: 8 },
          { title: 'RAC', value: 8 },
          { title: 'Key Plays', value: 7 }
        ], 
        sectionAvg: 5.9
      },        
      {
        position: 'WR',
        inputs: [
          { title: 'Release', value: 8 },
          { title: 'Routes', value: 5 },
          { title: 'Separation', value: 3 },
          { title: 'Vertical Threat', value: 6 },
          { title: 'Catching Skills', value: 2 },
          { title: 'RAC', value: 9 },
          { title: 'Key Plays', value: 4 },
          { title: 'Blocking', value: 9 },
          { title: 'Hands', value: 8 },
        ], 
        sectionAvg: 5.8
      },       
    ]
    
    positionMetrics.forEach(function(positionAttributes) {
      test.describe("#position: "+ positionAttributes.position, function() {
        test.it('should be able to input values into position skills', function() {
          reportPage.changeProfileDropdown('position', positionAttributes.position);
          positionAttributes.inputs.forEach(function(attribute) {
            reportPage.changeMetricsInput(attribute.title, attribute.value);
          });
          browser.refresh();
          reportPage.waitForPageToLoad();
        });

        positionAttributes.inputs.forEach(function(attribute) {
          test.it(attribute.title + ' should persist on reload', function() {
            reportPage.getMetricsInput(attribute.title).then(function(stat) {
              assert.equal(stat, attribute.value, 'Metrics - ' + attribute.title);
            });
          }); 
        });

        test.it('Position Skills average should persist on reload', function() {
          reportPage.getMetricsSectionAverage('Position Skills').then(function(stat) {
            assert.equal(stat, positionAttributes.sectionAvg, 'Position Skills avg');
          });
        });
      });
    });

    // test.after(function() {
    //   reportPage.changeProfileDropdown('position', 'QB');
    // });
  });

  test.describe("#submitting", function() {
    test.it('clicking save button updates the report type & removes the save button', function() {
      reportPage.clickSubmitButton();
      reportPage.getProfileDropdown('display.type').then(function(reportType) {
        assert.equal(reportType, 'Fall (Locked)', 'report type');
      });

      reportPage.isSubmitButtonDisplayed().then(function(displayed) {
        assert.equal(displayed, false, 'submit button displayed?');
      });
    });
  });
});