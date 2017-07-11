var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
chai.should();
chai.use(require('chai-things'));
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamPage = require('../../../pages/nfl_scouting/teams/team_page.js');
var ScoutingReportPage = require('../../../pages/nfl_scouting/reports/scouting_report_page.js');
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var navbar, teamPage, filters;
var playerRowNum = 1;

test.describe('#Page: ProTeam', function() {
  test.before(function() {
    teamPage = new TeamPage(driver);
    scoutingReportPage = new ScoutingReportPage(driver);
    playerPage = new PlayerPage(driver);
    filters = new Filters(driver);
    browser.visit(url+'team/1132'); // TODO - Change this to a real pro team 
  });

  test.describe('#sorting', function() {
    var columns = [
      { colNum: 3, colName: 'Tier', sortType: 'enumerated', sortEnumeration: ['A', 'B', 'C', 'D', '?'] },
      { colNum: 4, colName: 'Jersey', sortType: 'number' },
      { colNum: 5, colName: 'First Name', sortType: 'string' },
      { colNum: 7, colName: 'Jags. Pos.', placeholder: 'Jags. Pos.'  },
      { colNum: 8, colName: 'Height', sortType: 'number' },
      { colNum: 9, colName: 'Weight', sortType: 'number' },
      { colNum: 10, colName: 'Speed', sortType: 'number' },
      { colNum: 11, colName: 'Age', sortType: 'number' },
      { colNum: 12, colName: 'NFL XP', sortType: 'number' },
      { colNum: 13, colName: 'Entry Year', sortType: 'number' },
      { colNum: 14, colName: 'College', sortType: 'string' },
      { colNum: 17, colName: 'Durability', sortType: 'number' },
    ];

    test.it('team list should be sorted alphabetically by last name asc initially', function() {
      teamPage.getTableStatsForCol(6).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'string');
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('clicking arrow next to last name header should reverse the sort', function() {
      teamPage.clickSortIcon(6);

      teamPage.getTableStatsForCol(6).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'string');
        var sortedArray = extensions.customSort(stats, 'desc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    var lastColNum = 6;
    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        teamPage.clickRemoveSortIcon(lastColNum);
        lastColNum = column.colNum;
        teamPage.clickTableHeader(column.colNum);

        teamPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
        teamPage.clickSortIcon(column.colNum);

        teamPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });
    });
  });

  test.describe('#filters', function() {
    test.it('filtering height between 5000 and 5110, should update player list', function() {
      filters.changeRangeFilter('Height', 5000, 5110);
      teamPage.getTableStatsForCol(8).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.below(5110)
        stats.should.all.be.above(5000)
      });
    });

    test.it('filtering weight between 100 and 200, should update player list', function() {
      filters.changeRangeFilter('Height', 5000, 8000);
      filters.changeRangeFilter('Weight', 100, 200);
      teamPage.getTableStatsForCol(9).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.below(200)
        stats.should.all.be.above(100)
      });
    });

    test.it('filtering speed between 0.00 and 4.60, should update player list', function() {
      filters.changeRangeFilter('Weight', 100, 1000);
      filters.changeRangeFilter('Speed', 0, 4.6);
      teamPage.getTableStatsForCol(10).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.below(4.6)
        stats.should.all.be.above(0)
      });
    });

    test.it('filtering nfl experience between 0 and 3, should update player list', function() {
      filters.changeRangeFilter('Speed', 0, 9.99);
      filters.changeRangeFilter('NFL Experience', 0, 3);
      teamPage.getTableStatsForCol(12).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.below(3)
        stats.should.all.be.above(0)
      });
    });

    test.it('filtering entry year between 2010 and 2016, should update player list', function() {
      filters.changeRangeFilter('NFL Experience', 0, 5);
      filters.changeRangeFilter('Entry Year', 2010, 2016);
      teamPage.getTableStatsForCol(13).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.below(2016)
        stats.should.all.be.above(2010)
      });
    });

    test.it('adding durability 8, should update player list', function() {
      filters.changeRangeFilter('Entry Year', 2000, 2017);
      filters.changeDropdownFilter('Durability', '8');
      teamPage.getTableStatsForCol(17).then(function(stats) {
        stats = extensions.normalizeArray(stats, 'number');
        stats.should.all.be.equal(8)
      });
    });

    test.it('adding tier C, should update player list', function() {
      filters.changeDropdownFilter('Durability', '8');
      filters.changeDropdownFilter('For Tier', 'A');
      teamPage.getTableStatsForCol(3).then(function(tiers) {
        var uniqueTiers = Array.from(new Set(tiers));
        assert.sameMembers(['A'], uniqueTiers);
      });
    });

    test.it('selecting Jags. Pos. = WR should update player list', function() {
      filters.changeDropdownFilter('For Tier', 'A');
      filters.changeDropdownFilter('Jags. Pos.', 'WR');
      driver.sleep(2000);
      teamPage.getTableStatsForCol(7).then(function(positions) {
        var uniquePositions = Array.from(new Set(positions));
        assert.sameMembers(['WR'], uniquePositions);
      });
    });
  });

  test.describe('#updatingPlayerInfo', function() {
    test.before(function() {
      browser.refresh();
      teamPage.waitForPageToLoad();
    });

    var attributes = [
      { field: 'Tier', col: 3, type: 'dropdown', originalValue: '?', updatedValue: 'C', placeholder: '?' },
      { field: 'Durability', col: 17, type: 'dropdown', originalValue: 'Select value', updatedValue: '8', placeholder: 'Select value' },
      { field: 'X Alert', col: 18, type: 'colorCheckbox', originalValue: false, updatedValue: true, selectedColor: 'rgba(217, 83, 79, 1)' },
      { field: 'C Alert', col: 19, type: 'colorCheckbox', originalValue: false, updatedValue: true, selectedColor: 'rgba(0, 0, 0, 1)' },
    ];      

    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.col, {selectedColor: attr.selectedColor}).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it('updating fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.updatedValue, {selectedColor: attr.selectedColor, placeholder: attr.placeholder});
      });
      browser.refresh();
      teamPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        teamPage.getTableStatField(attr.type, playerRowNum, attr.col, {selectedColor: attr.selectedColor}).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        teamPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.originalValue, {selectedColor: attr.selectedColor, placeholder: attr.placeholder});
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking create report goes to new scouting report page', function() {
      teamPage.clickCreateScoutingReport(1);
      scoutingReportPage.waitForPageToLoad();

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/proScoutingReport\//, 'page URL');
      });
    });

    test.it('clicking create player goes to new player page', function() {
      browser.back();
      teamPage.clickCreateNewPlayer();
      playerPage.waitForPageToLoad();

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/player\//, 'page URL');
      });
    });
  });
});