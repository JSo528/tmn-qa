var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');
var playerPage, reportPage;           
           
// Tests
test.describe('#Page: ProScoutingReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new ScoutingReportPage(driver);
    browser.visit(url + 'player/4893');
    playerPage.waitForPageToLoad();
  });

  test.it('should go to proScoutingReport page', function() {
    playerPage.clickCreateScoutingReportBtn();
    reportPage.waitForPageToLoad();
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /\/proScoutingReport\//, 'page URL');
    });            
  });

  test.describe("#profile", function() {
    var attributes = [
      { field: 'K', title: 'K Flag', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'P', title: 'P Flag', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: '5', title: '5 Flag', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'T', title: 'T Flag', type: 'checkbox', updatedValue: true },
      { field: 'Speed', type: 'input', updatedValue: '5.40i' },
      { field: 'Height', type: 'input', updatedValue: '6010v' },
      { field: 'Weight', type: 'input', updatedValue: '240i' },
      { field: 'flags', title: 'Flags', type: 'input', updatedValue: 'ac' },
      { field: 'display.proType', title: 'Report Type', type: 'dropdown', updatedValue: 'UFA' },
      { field: 'overallGrade', title: 'Grade', type: 'dropdown', updatedValue: '6.9 Starter 3 Downs' },
      { field: 'player.tierGrade', title: 'Tier Grade', type: 'dropdown', updatedValue: 'B' },
      { field: 'acquire', title: 'Acquire', type: 'dropdown', updatedValue: 'Y' },
      { field: 'trend', title: 'Trend', type: 'dropdown', updatedValue: '↑' },
      { field: 'Report Date', type: 'date', updatedValueInput: {year: 2017, month: 'Jun', day: 15}, updatedValue: '06/15/2017' },
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
      this.timeout(120000);
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

  test.describe("#observations", function() {
    var observationAttributes = [
      { field: 'Jags. Pos.', type: 'dropdown', originalValue: 'WR', value: 'WB' },
      { field: 'Flex', type: 'dropdown', value: 'WR' },
      { field: 'ST Pos. 1', type: 'dropdown', value: 'PR' },
      { field: 'ST Pos. 2', type: 'dropdown', value: 'KR' },
      { field: 'ST Grade', type: 'dropdown', value: '5 Above Average' },
      { field: 'frame', title: 'Frame', type: 'text', value: 'frame test' },
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

  test.describe("#gameReports", function() {
    test.it("creating new game persists on reload", function() {
      reportPage.clickGameReportsSpacer();
      reportPage.createNewGame(1, 'OS', {year: 2017, month: 'Jun', day: 15}, 'TEST');
      browser.refresh();
      reportPage.clickGameReportsSpacer();
      reportPage.getGameInfo(1,1).then(function(stat) {
        assert.equal(stat, "TEST 6/15/2017");
      });

    });

    test.it("updating grade for game persists on reload", function() {
      reportPage.setGameGrade(1,1, "6 Good");
      browser.refresh();
      reportPage.clickGameReportsSpacer();
      reportPage.getGameInfo(1,1).then(function(stat) {
        assert.equal(stat, "TEST 6/15/2017 [6]");
      });
    });

    test.it("updating game notes persists on reload", function() {
      reportPage.changeGameNotesText("game reports text test");
      browser.refresh();
      reportPage.clickGameReportsSpacer();
      reportPage.getGameNotesText().then(function(stat) {
        assert.equal(stat, "game reports text test");
      });
    });
  });

  test.describe("#notes", function() {
    var notesAttributes = [
  //     { field: 'Game Reports', type: 'text', value: 'game reports text test' },
      { field: 'Run', type: 'text', value: 'run text test' },
      { field: 'Pass', type: 'text', value: 'pass text test' },
      { field: 'Summary', type: 'text', value: 'summary text test' },
      { field: 'Help Jags', type: 'text', value: 'help jags text test' },
      { field: 'One Liner', type: 'text', value: 'one liner text test' },
      { field: 'Production', type: 'text', value: 'production text test' },
      { field: 'Durability', type: 'text', value: 'durability text test' },
      { field: 'Notes', type: 'text', value: 'notes text test' },
      { field: 'Run', type: 'grade', value: 6 },
      { field: 'Pass', type: 'grade', value: 5 },
      { field: 'Help Jags', type: 'jagsCheckbox', value: true },
    ];

    test.it("updating fields (if this test fails, itll cause a cascading effect for the other tests in this section)", function() {
      this.timeout(120000);
  
      notesAttributes.forEach(function(attr) {
        reportPage.changeNotesField(attr.type, attr.field, attr.value );
      });
      browser.refresh();
      reportPage.waitForPageToLoad();
  //     reportPage.clickGameReportsSpacer();
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
      { title: 'Hands', value: 9 },
      
      { title: 'Release', value: 3 },
      { title: 'Routes', value: 4 },
      { title: 'Separation', value: 6 },
      { title: 'Vertical Threat', value: 5 },
      { title: 'Catching Skills', value: 4 },
      { title: 'RAC', value: 8 },
      { title: 'Key Plays', value: 5 },
      { title: 'Blocking', value: 7 }
    ];

    var metricsSectionAverages = [
      { title: 'Major Factors', value: 5.9 },
      { title: 'Critical Factors', value: 7.0 },
      { title: 'Position Skills', value: 5.3 }
    ];

    var gradeGroupSkills = [
      { title: 'Top Starter', inject: 'topStarterSkills', value: ['Personal Character', 'Durability', 'Productivity', 'Athletic Ability', 'Speed', 'Play Strength', 'ACC Long', 'Drop Set', 'Release', 'Mobility'] },
      { title: 'Starter', inject: 'starterSkills', value: ['Run Game', 'Football Character', 'Explosion', 'ACC Short', 'Awareness'] },
      { title: 'Backup', inject: 'backupSkills', value: ['Pass Game', 'Compete & Toughness', 'Size', 'Arm Strength', 'Security', 'Mechanics', 'Throw on Move'] }
    ]; 

    test.describe("#position: WR", function() {
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
  });

  test.describe("#submitting", function() {
    test.it('clicking save button updates the report type', function() {
      reportPage.clickSubmitButton();
      reportPage.getProfileDropdown('display.proType').then(function(reportType) {
        assert.equal(reportType, 'UFA', 'report type');
      });
    });
  });
});