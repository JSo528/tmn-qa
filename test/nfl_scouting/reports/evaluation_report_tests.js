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

// Update Data
var originalAttributes = {
  firstName: 'Dakota',
  lastName: 'Cornwell',
  position: 'QB',
  jersey: 11,
  draftYear: 2017,
  height: '6010',
  weight: '240',
  speed: '5',
  overallGrade: ''
};

var updatedAttributes = {
  firstName: 'Dakota-Test',
  lastName: 'Cornwell-Test',
  height: '6040',
  weight: '260',
  speed: '6',
  position: 'RB',
  jersey: 16,
  draftYear: 2018,
  overallGrade: '8.0',
  reportDateObject: {year: 2012, month: 'Jun', day: 15},
  reportDate: '06/15/2012'
};

var sectionData = {
  gameReportsText: 'game report test',
  athleticAbility: 5,
  athleticAbilityText: 'athletic ability test',
  competes: 8,
  competesText: 'competes test',
  production: 9,
  productionText: 'production test',
  helpJags: true,
  helpJagsText: 'helps jags test',
  summaryText: 'summary test',
};

var sectionDataUpdate = {
  gameReportsText: 'game report test update',
  athleticAbility: 3,
  athleticAbilityText: 'athletic ability test update',
  competes: 6,
  competesText: 'competes test update',
  production: 4,
  productionText: 'production test update',
  helpJags: false,
  helpJagsText: 'helps jags test update',
  summaryText: 'summary test update'
};

// Tests
test.describe('#Page: EvaulationReports', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    reportPage = new EvaulationReportPage(driver);
    browser.visit(url + 'player/31686');
    playerPage.waitForPageToLoad();
    playerPage.clickCreateEvaluationReportBtn();
  });

  test.describe("#reportSections", function() {
    test.describe('#initialInput', function() {
      test.before(function() {
        reportPage.clickGameReportsSpacer();
        reportPage.changeSectionText('Game Reports', sectionData.gameReportsText);
        reportPage.changeSectionGrade('Athletic Ability', sectionData.athleticAbility);
        reportPage.changeSectionText('Athletic Ability', sectionData.athleticAbilityText);
        reportPage.changeSectionGrade('Competes', sectionData.competes);
        reportPage.changeSectionText('Competes', sectionData.competesText);
        reportPage.changeSectionGrade('Production', sectionData.production);
        reportPage.changeSectionText('Production', sectionData.productionText);
        reportPage.toggleHelpJagsCheckbox();
        reportPage.changeSectionText('Help Jags', sectionData.helpJagsText);
        reportPage.changeSectionText('Summary', sectionData.summaryText);

        browser.refresh();
      });

      test.it('game reports text should persist on reload', function() {
        reportPage.clickGameReportsSpacer();
        reportPage.getSectionText('Game Reports').then(function(text) {
          assert.equal(text, sectionData.gameReportsText, 'game reports text');
        });
      });

      test.it('athletic ability grade should persist on reload', function() {
        reportPage.getSectionGrade('Athletic Ability').then(function(grade) {
          assert.equal(grade, sectionData.athleticAbility, 'athletic ability grade');
        });
      });

      test.it('athletic ability text should persist on reload', function() {
        reportPage.getSectionText('Athletic Ability').then(function(text) {
          assert.equal(text, sectionData.athleticAbilityText, 'athletic ability text');
        });
      });

      test.it('competes grade should persist on reload', function() {
        reportPage.getSectionGrade('Competes').then(function(grade) {
          assert.equal(grade, sectionData.competes, 'Competes grade');
        });
      });

      test.it('competes text should persist on reload', function() {      
        reportPage.getSectionText('Competes').then(function(text) {
          assert.equal(text, sectionData.competesText, 'Competes text');
        });
      });

      test.it('production grade should persist on reload', function() {      
        reportPage.getSectionGrade('Production').then(function(grade) {
          assert.equal(grade, sectionData.production, 'Production grade');
        });
      });

      test.it('production text should persist on reload', function() {
        reportPage.getSectionText('Production').then(function(text) {
          assert.equal(text, sectionData.productionText, 'Production text');
        });
      });

      test.it('help jags checkbox should persist on reload', function() {
        reportPage.getHelpJagsCheckbox().then(function(text) {
          assert.equal(text, 'check_box', 'Helps Jag Checkbox');
        });
      });

      test.it('help jags text should persist on reload', function() {
        reportPage.getSectionText('Help Jags').then(function(text) {
          assert.equal(text, sectionData.helpJagsText, 'Help Jags text');
        });      
      });

      test.it('summary text should persist on reload', function() {
        reportPage.getSectionText('Summary').then(function(text) {
          assert.equal(text, sectionData.summaryText, 'Summary text');
        });            
      });  
    });   

    test.describe('#updatingInput', function() {
      test.before(function() {
        reportPage.changeSectionText('Game Reports', sectionDataUpdate.gameReportsText);
        reportPage.changeSectionGrade('Athletic Ability', sectionDataUpdate.athleticAbility);
        reportPage.changeSectionText('Athletic Ability', sectionDataUpdate.athleticAbilityText);
        reportPage.changeSectionGrade('Competes', sectionDataUpdate.competes);
        reportPage.changeSectionText('Competes', sectionDataUpdate.competesText);
        reportPage.changeSectionGrade('Production', sectionDataUpdate.production);
        reportPage.changeSectionText('Production', sectionDataUpdate.productionText);
        reportPage.toggleHelpJagsCheckbox();
        reportPage.changeSectionText('Help Jags', sectionDataUpdate.helpJagsText);
        reportPage.changeSectionText('Summary', sectionDataUpdate.summaryText);

        browser.refresh();
      });

      test.it('game reports text should persist on reload', function() {
        reportPage.clickGameReportsSpacer();
        reportPage.getSectionText('Game Reports').then(function(text) {
          assert.equal(text, sectionDataUpdate.gameReportsText, 'game reports text');
        });
      });

      test.it('athletic ability grade should persist on reload', function() {
        reportPage.getSectionGrade('Athletic Ability').then(function(grade) {
          assert.equal(grade, sectionDataUpdate.athleticAbility, 'athletic ability grade');
        });
      });

      test.it('athletic ability text should persist on reload', function() {
        reportPage.getSectionText('Athletic Ability').then(function(text) {
          assert.equal(text, sectionDataUpdate.athleticAbilityText, 'athletic ability text');
        });
      });

      test.it('competes grade should persist on reload', function() {
        reportPage.getSectionGrade('Competes').then(function(grade) {
          assert.equal(grade, sectionDataUpdate.competes, 'Competes grade');
        });
      });

      test.it('competes text should persist on reload', function() {      
        reportPage.getSectionText('Competes').then(function(text) {
          assert.equal(text, sectionDataUpdate.competesText, 'Competes text');
        });
      });

      test.it('production grade should persist on reload', function() {      
        reportPage.getSectionGrade('Production').then(function(grade) {
          assert.equal(grade, sectionDataUpdate.production, 'Production grade');
        });
      });

      test.it('production text should persist on reload', function() {
        reportPage.getSectionText('Production').then(function(text) {
          assert.equal(text, sectionDataUpdate.productionText, 'Production text');
        });
      });

      test.it('help jags checkbox should persist on reload', function() {
        reportPage.getHelpJagsCheckbox().then(function(text) {
          assert.equal(text, 'check_box_outline_blank', 'Helps Jag Checkbox');
        });
      });

      test.it('help jags text should persist on reload', function() {
        reportPage.getSectionText('Help Jags').then(function(text) {
          assert.equal(text, sectionDataUpdate.helpJagsText, 'Help Jags text');
        });      
      });

      test.it('summary text should persist on reload', function() {
        reportPage.getSectionText('Summary').then(function(text) {
          assert.equal(text, sectionDataUpdate.summaryText, 'Summary text');
        });            
      });  
    });   
  });

  test.describe("#updating profile", function() {
    test.before(function() {
      reportPage.changeProfileStat('First Name', updatedAttributes.firstName);
      reportPage.changeProfileStat('Last Name', updatedAttributes.lastName);
      reportPage.changeProfileDraftYear(updatedAttributes.draftYear);
      reportPage.changeProfileStat('Height', updatedAttributes.height);
      reportPage.changeProfileStat('Weight', updatedAttributes.weight);
      reportPage.changeProfileStat('Speed', updatedAttributes.speed);
      reportPage.changeProfileOverallGrade(updatedAttributes.overallGrade);
      reportPage.changeProfileReportDate(updatedAttributes.reportDateObject);
      reportPage.changeProfilePosition(updatedAttributes.position);
      reportPage.changeProfileJersey(updatedAttributes.jersey);
      browser.refresh();
    });

    test.it('changing first name should persist on reload', function() {
      reportPage.getProfileStat('First Name').then(function(stat) {
        assert.equal(stat, updatedAttributes.firstName, 'Profile first name');
      });
    });

    test.it('changing last name should persist on reload', function() {
      reportPage.getProfileStat('Last Name').then(function(stat) {
        assert.equal(stat, updatedAttributes.lastName, 'Profile last name');
      });
    });

    test.it('changing draft year should persist on reload', function() {
      reportPage.getProfileStat('Draft Year').then(function(stat) {
        assert.equal(stat, updatedAttributes.draftYear, 'Profile draft year');
      });
    });

    test.it('changing height should persist on reload', function() {
      reportPage.getProfileStat('Height').then(function(stat) {
        assert.equal(stat, updatedAttributes.height, 'Profile height');
      });
    });

    test.it('changing weight should persist on reload', function() {
      reportPage.getProfileStat('Weight').then(function(stat) {
        assert.equal(stat, updatedAttributes.weight, 'Profile weight');
      });
    });

    test.it('changing speed should persist on reload', function() {
      reportPage.getProfileStat('Speed').then(function(stat) {
        assert.equal(stat, updatedAttributes.speed, 'Profile speed');
      });      
    });

    test.it('changing overall grade should persist on reload', function() {
      reportPage.getProfileOverallGrade().then(function(stat) {
        assert.equal(stat, "8.0 1ˢᵗ Year Starter", 'Profile overall grade');
      });      
    });    

    test.it('changing report date should persist on reload', function() {
      reportPage.getProfileStat('Report Date').then(function(stat) {
        assert.equal(stat, updatedAttributes.reportDate, 'Profile report date');
      });
    });

    test.it('changing position should persist on reload', function() {
      reportPage.getProfilePosition('Position').then(function(stat) {
        assert.equal(stat, updatedAttributes.position, 'Profile position');
      });
    });

    test.it('changing jersey should persist on reload', function() {
      reportPage.getProfileJersey().then(function(stat) {
        assert.equal(stat, updatedAttributes.jersey, 'Profile jersey');
      });
    });    

    test.after(function() {
      reportPage.changeProfileStat('First Name', originalAttributes.firstName);
      reportPage.changeProfileStat('Last Name', originalAttributes.lastName);
      reportPage.changeProfileDraftYear(originalAttributes.draftYear);
      reportPage.changeProfileStat('Height', originalAttributes.height);
      reportPage.changeProfileStat('Weight', originalAttributes.weight);
      reportPage.changeProfileStat('Speed', originalAttributes.speed);
      reportPage.changeProfileOverallGrade('8.0');
      reportPage.changeProfilePosition(originalAttributes.position);
      reportPage.changeProfileJersey(originalAttributes.jersey);

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