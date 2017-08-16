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
var playerRowNum = 5;

test.describe('#Page: Team', function() {
  test.before(function() {
    teamPage = new TeamPage(driver);
    filters = new Filters(driver);
    browser.visit(url+'team/41');
  });

  test.describe('#sorting', function() {
    var columns = [
      { colName: 'Tier', sortType: 'enumerated', sortEnumeration: ['A', 'B', 'C', 'D', '?'] },
      { colName: 'Draft Year', sortType: 'number' }, 
      { colName: 'Class', sortType: 'enumerated', sortEnumeration: ['FR', 'SO', 'JR', 'SR'] },
      { colName: 'Jersey', sortType: 'number' },
      { colName: 'First Name', sortType: 'string' },
      { colName: 'Starter', sortType: 'boolean' },
      { colName: 'Pos', placeholder: 'Select value' },
      { colName: 'Jags. Pos.', placeholder: '--'  },
      { colName: 'Height', sortType: 'number' },
      { colName: 'Weight', sortType: 'number' },
      { colName: 'Speed', sortType: 'number' },
    ];

    test.it('team list should be sorted alphabetically by last name asc initially', function() {
      teamPage.getTableStatsForCol('Last Name').then(function(stats) {
        stats = extensions.normalizeArray(stats, 'string');
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('clicking arrow next to last name header should reverse the sort', function() {
      teamPage.clickSortIcon('Last Name');

      teamPage.getTableStatsForCol('Last Name').then(function(stats) {
        stats = extensions.normalizeArray(stats, 'string');
        var sortedArray = extensions.customSort(stats, 'desc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    var lastColName = 'Last Name';
    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        teamPage.clickRemoveSortIcon(lastColName);
        lastColName = column.colName;
        teamPage.clickTableHeader(column.colName);

        teamPage.getTableStatsForCol(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
        teamPage.clickSortIcon(column.colName);

        teamPage.getTableStatsForCol(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });
    });
  });

  test.describe('#filters', function() {
    test.it('adding draft year: 2020, class year: SO, and removing draftYear: 2018, class year: SR should update player list', function() {
      filters.changeDropdownFilter('For Draft Years', 2020);
      filters.changeDropdownFilter('For Draft Years', 2018);
      filters.changeDropdownFilter('For Class Years', 'SO');
      filters.changeDropdownFilter('For Class Years', 'SR');

      teamPage.getTableStatsForCol('Draft Year').then(function(years) {
        var uniqYears = Array.from(new Set(years));
        assert.sameMembers(['2020', '2019'], uniqYears);
      });
      
      teamPage.getTableStatsForCol('Class').then(function(years) {
        var uniqYears = Array.from(new Set(years));
        assert.sameMembers(uniqYears, ['SO', 'JR']);
      });
    });

    test.it('selecting starters only, should update player list', function() {
      filters.changeCheckboxFilter('Is Starter', true);
      teamPage.getTableCheckboxStats('Starter').then(function(statuses) {
        var uniqueStatuses = Array.from(new Set(statuses));
        assert.sameMembers([true], uniqueStatuses);
      });
    });

    test.it('selecting positions = DT should update player list', function() {
      filters.changeDropdownFilter('At Positions', 'DT');
      teamPage.getTableStatsForCol('Pos').then(function(positions) {
        var uniquePositions = Array.from(new Set(positions));
        assert.sameMembers(['DT'], uniquePositions);
      });
    });

    test.it('adding tier B, should update player list', function() {
      filters.changeDropdownFilter('For Tier', 'B');
      teamPage.getTableStatsForCol('Tier').then(function(tiers) {
        var uniqueTiers = Array.from(new Set(tiers));
        assert.sameMembers(['B'], uniqueTiers);
      });
    });
  });

  test.describe('#updatingPlayerInfo - Gage Batten (4508)', function() {
    var attributes = [
      { field: 'Tier', type: 'dropdown', originalValue: '?', updatedValue: 'C', placeholder: '?' },
      // { field: 'Draft Year', type: 'date', originalValue: 2017, updatedValue: 2018 },
      { field: 'Jersey', type: 'input', originalValue: 40, updatedValue: 32 },
      { field: 'Starter', type: 'checkbox', originalValue: false, updatedValue: true },
      { field: 'Pos', type: 'dropdown', originalValue: 'FB', updatedValue: 'RB' },
      { field: 'Height', type: 'input', originalValue: '6000', updatedValue: '6010e' },
      { field: 'Weight', type: 'input', originalValue: '235', updatedValue: '200e' },
      { field: 'Speed', type: 'input', originalValue: '', updatedValue: '4.60e' }
    ];    

    test.it('refreshing page', function() {
      browser.refresh();
      filters.changeDropdownFilter('For Draft Years', 2017);
    });
    
    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.field).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it('updating fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.field, attr.updatedValue, {placeholder: attr.placeholder} );
      });
    });

    test.it('refreshing page', function() {
      browser.refresh();
      filters.changeDropdownFilter('For Draft Years', 2017);
    })

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.field).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.field, attr.originalValue, {placeholder: attr.placeholder} );
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into player should redirect to correct page', function() {
      teamPage.clickTableStat(1,'First Name');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/player\//, 'page URL');
      });
    });
  });
});