var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var MeasurablesPage = require('../../../pages/nfl_scouting/players/measurables_page.js');
var playerPage, measurablesPage, newRowNum;

// Tests
test.describe('#Page: Measurables', function() {
  test.before(function() {
    playerPage = new PlayerPage(driver);
    measurablesPage = new MeasurablesPage(driver);
    browser.visit(url + 'player/31682');
    playerPage.waitForPageToLoad();
    playerPage.clickMeasurablesLink();
    measurablesPage.waitForPageToLoad();
  })

  test.describe('#creating', function() {
    var attributes = [
      { field: 'event', type: 'dropdown', values: ["APT", "NFS", "ALLSTAR"] },
      { field: 'date', type: 'date', values: ["02/11/2015", "11/04/2014", "06/02/2017"] },
      { field: 'fieldCondition', values: ['FI1E', 'GO2 V', 'TI3'], invalidValue: 'TEST' },
      { field: 'fieldType' },
      { field: 'height', values: [5100, 6020, 5050], invalidValue: 500 },
      { field: 'weight', values: [250, 300, 175], invalidValue: 1000 },
      { field: 'hand', values: ["8 1/2", "10", "9 3/4"], invalidValue: 'L' },
      { field: 'arm', values: ["10 1/4", "12 2/3", "11"], invalidValue: 'L' },
      { field: 'wing', values: ["20", "20 1/2", "22 1/3"], invalidValue: 'L' },
      { field: 'm40_1', values: ['4.2v', 4.6, 5.1], invalidValue: 'L' },
      { field: 'm40_2', values: ['4.2v', 4.6, 5.1], invalidValue: 'L' },
      { field: 'm10_1', values: ['1.2v', 1.6, 2.1], invalidValue: 'L' },
      { field: 'm10_2', values: ['1.2v', 1.6, 2.1], invalidValue: 'L' },
      { field: 'm20_1', values: ['2.5v', 2.9, 3.5], invalidValue: 'L' },
      { field: 'm20_2', values: ['2.5v', 2.9, 3.5], invalidValue: 'L' },
      { field: 'verticalJump', values: [4010, 3060, 2110], invalidValue: 'L' },
      { field: 'broadJump', values: ["7'10", "8'02", "8'0"], invalidValue: 'L' },
      { field: 'benchPress', values: [30, 15, 5], invalidValue: 'L' },
      { field: 'shuttles20', values: [8.5, 7.9, 10.2], invalidValue: 'L' },
      { field: 'shuttles60', values: [21.5, 19.9, 23.2], invalidValue: 'L' },
      { field: 'shuttles3', values: [3.5, 6.9, 5.2], invalidValue: 'L' },
    ];

    test.it('click create button', function() {
      measurablesPage.clickCreateButton();
      measurablesPage.waitForPageToLoad();
      measurablesPage.getRowNumForValue('fieldType', '').then(function(rowNum) {
        newRowNum = rowNum;
      });
    });

    attributes.forEach(function(attribute, idx) {
      test.it('inputting valid value for ' + attribute.field, function() {
        var value = attribute.values ? extensions.chooseRandom(attribute.values) : extensions.generateRandomText(10);

        attributes[idx].inputValue = value;
        measurablesPage.changeStatField(attribute.type, newRowNum, attribute.field, value);
      });
    });

    test.it('reloading page', function() {
      browser.refresh();
      measurablesPage.waitForPageToLoad();
      measurablesPage.getRowNumForValue('fieldType', attributes[3].inputValue).then(function(rowNum) {
        newRowNum = rowNum;
      });
    });

    attributes.forEach(function(attribute) {
      test.it('valid value for ' + attribute.field + ' persists on page reload', function() {
        measurablesPage.getStatField(attribute.type, newRowNum, attribute.field).then(function(stat) {
          assert.equal(stat, attribute.inputValue);
        });
      });
    });

    attributes.forEach(function(attribute) {
      test.it('inputting invalid value for ' + attribute.field + ' displays error message', function() {
        if (attribute.invalidValue) {
          measurablesPage.changeStatField(attribute.type, newRowNum, attribute.field, attribute.invalidValue);
          measurablesPage.errorMessageDisplayed(newRowNum, attribute.field).then(function(displayed) {
            assert.equal(displayed, true);
          });
        }
      });
    });

    test.it('reloading page', function() {
      browser.refresh();
      measurablesPage.waitForPageToLoad();
      measurablesPage.getRowNumForValue('fieldType', attributes[3].inputValue).then(function(rowNum) {
        newRowNum = rowNum;
      });
    });

    attributes.forEach(function(attribute) {
      if (attribute.invalidValue) {
        test.it('invalid value for ' + attribute.field + ' does not persist on page reload', function() {
          measurablesPage.getStatField(attribute.type, newRowNum, attribute.field).then(function(stat) {
            assert.equal(stat, attribute.inputValue);
          });
        });
      }
    });
  });

  test.describe('#liveRow', function() {
    var attributes = [
      { field: 'event', value: 'NIC' },
      { field: 'date', type: 'date', value: '2/15/2017' },
      { field: 'fieldCondition', value: 'FO2 V' },
      { field: 'height', value: '6040' },
      { field: 'weight', value: '320' },
      { field: 'hand', value: '8 1/2' },
      { field: 'arm', value: '12 1/2' },
      { field: 'wing', value: '20 1/2' },
      { field: 'm40_1', value: '4.3' },
      { field: 'm10_1', value: '1.2' },
      { field: 'm20_1', value: '2.4' },
      { field: 'verticalJump', value: '4030' },
      { field: 'broadJump', value: "7'09" },
      { field: 'benchPress', value: '32' },
      { field: 'shuttles20', value: '8.5' },
      { field: 'shuttles60', value: '19.5' },
      { field: 'shuttles3', value: '5.0' },
    ];

    attributes.forEach(function(attribute) {
      test.it('liveRow value for ' + attribute.field + ' should be correct', function() {
        measurablesPage.getLiveRowField(attribute.type, attribute.field).then(function(stat) {
          assert.equal(stat, attribute.value);
        });
      });
    });    
  });

  test.describe('#sorting', function() {

  });
});