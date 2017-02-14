var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../../pages/nfl_scouting/teams/teams_page.js');
var TeamPage = require('../../../pages/nfl_scouting/teams/team_page.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var navbar, teamsPage, teamPage, filters;
var playerRowNum = 3;

test.describe('#Page: Team', function() {
  test.before(function() {
    teamPage = new TeamPage(driver);
    filters = new Filters(driver);
    browser.visit(url+'team/41');
  });

  test.describe('#sorting', function() {
    test.it('roster list should be sorted alphabetically by last name asc initially', function() {
      teamPage.getTableStats(7).then(function(lastNames) {
        var sortedArray = extensions.customSort(lastNames, 'asc');
        assert.deepEqual(lastNames, sortedArray);
      });
    });

    test.it('reversing the sort should sort the list by last name desc', function() {
      teamPage.clickTableHeader(7);
      teamPage.getTableStats(7).then(function(lastNames) {
        var sortedArray = extensions.customSort(lastNames, 'desc');
        assert.deepEqual(lastNames, sortedArray);
      });
    });

    test.it('selecting speed sort should sort list by speed asc', function() {
      teamPage.clickRemoveSortIcon(7);
      teamPage.clickTableHeader(12);
      teamPage.getTableStats(12).then(function(speeds) {
        var sortedArray = extensions.customSort(speeds, 'asc');
        assert.deepEqual(speeds, sortedArray);
      });
    });    
  });

  test.describe('#filters', function() {
    test.it('selecting starters only, should update player list', function() {
      filters.changeCheckboxFilter('Is Starter', true);
      teamPage.getTableCheckboxStats(8).then(function(statuses) {
        var uniqueStatuses = Array.from(new Set(statuses));
        assert.sameMembers([true], uniqueStatuses);
      });
    });

    test.it('selecting no starters, should update player list', function() {
      filters.changeCheckboxFilter('Is Starter', false);
      teamPage.getTableCheckboxStats(8).then(function(statuses) {
        var uniqueStatuses = Array.from(new Set(statuses));
        assert.sameMembers([false], uniqueStatuses);
      });
    });

    test.it('selecting both starters, should update player list', function() {
      filters.changeCheckboxFilter('Is Starter', 'both');
      teamPage.getTableCheckboxStats(8).then(function(statuses) {
        var uniqueStatuses = Array.from(new Set(statuses));
        assert.sameMembers([true,false], uniqueStatuses);
      });
    });

    test.it('removing top draft year, should update player list', function() {
      filters.changeDropdownFilter('For Draft Years', 2017);
      teamPage.getTableStats(3).then(function(years) {
        assert.notInclude(years, '2017');
      });
    });

    test.it('adding tier C, should update player list', function() {
      filters.changeDropdownFilter('For Tier', 'C');
      teamPage.getTableStats(2).then(function(tiers) {
        var uniqueTiers = Array.from(new Set(tiers));
        assert.sameMembers(['C'], uniqueTiers);
      });
    });

    test.it('selecting positions = DL should update player list', function() {
      filters.changeDropdownFilter('At Positions', 'FS');
      teamPage.getTableStats(9).then(function(positions) {
        var uniquePositions = Array.from(new Set(positions));
        assert.sameMembers(['FS'], uniquePositions);
      });
    });
  });

  test.describe('#updatingPlayerInfo - Gage Batten (4508)', function() {
    test.before(function() {
      browser.refresh();
      teamPage.waitForPageToLoad();
    });

    var attributes = [
      { field: 'Tier', col: 2, type: 'dropdown', originalValue: '?', updatedValue: 'C' },
      // { field: 'Draft Year', col: 3, type: 'date', originalValue: 2017, updatedValue: 2018 },
      { field: 'Jersey', col: 5, type: 'input', originalValue: 40, updatedValue: 32 },
      { field: 'Starter', col: 8, type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'Pos', col: 9, type: 'dropdown', originalValue: 'FB', updatedValue: 'RB' },
      { field: 'Height', col: 10, type: 'input', originalValue: '6000', updatedValue: '6010e' },
      { field: 'Weight', col: 11, type: 'input', originalValue: '235', updatedValue: '200e' },
      { field: 'Speed', col: 12, type: 'input', originalValue: '', updatedValue: '4.60e' }
    ];    

    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.col).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it('updating fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.updatedValue );
      });
      browser.refresh();
      teamPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.col).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.originalValue );
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into player should redirect to correct page', function() {
      teamPage.clickTableStat(1,6);

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/player\//, 'page URL');
      });
    });
  });
});