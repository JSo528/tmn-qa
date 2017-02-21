var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var ScoutPage = require('../../../pages/nfl_scouting/scout/scout_page.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var navbar, scoutPage, filters;

test.describe('#Page: Scout', function() {
  test.before(function() {
    scoutPage = new ScoutPage(driver);
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    navbar.goToScoutPage();
  })

  test.it('should be on the correct page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /\/scout/, 'page URL');
    });
  });

  test.it('scouting reports list should be initially populatted', function() {
    scoutPage.getVisibleReportsCount().then(function(numRows) {
      assert.equal(numRows, 30, 'size of visible list');
    });
  });

  test.describe('#filters', function() {
    test.it('adding "QB" to position filter should update the list', function() {
      filters.changeDropdownFilter('Jags. Pos.', 'QB');
      scoutPage.getTableStatsForCol(11).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['QB'], uniqueStats);
      });
    });   

    test.it('adding "RB" from position filter should update the list', function() {
      filters.changeDropdownFilter('Jags. Pos.', 'RB');
      scoutPage.getTableStatsForCol(11).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['QB', 'RB'], uniqueStats);
      });
    });  

    test.it('removing "SR" from class year filter should update the list', function() {
      filters.changeDropdownFilter('For Class Years', 'SR');
      scoutPage.getTableStatsForCol(5).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['JR'], uniqueStats);
      });
    });

    test.it('adding "SO" from class year filter should update the list', function() {
      filters.changeDropdownFilter('For Class Years', 'SO');
      scoutPage.getTableStatsForCol(5).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['SO', 'JR'], uniqueStats);
      });
    });

    test.it('adding "FR" from class year filter should update the list', function() {
      filters.changeDropdownFilter('For Class Years', 'FR');
      scoutPage.getTableStatsForCol(5).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['FR', 'SO', 'JR'], uniqueStats);
      });
    });   
  });

  test.describe('#sorting', function() {
    var columns = [
      { colNum: 2, colName: 'Team Code' },
      { colNum: 3, colName: 'Tier', sortType: 'enumerated', sortEnumeration: ['A', 'B', 'C', 'D', '?'] },
      { colNum: 4, colName: 'Draft Year', sortType: 'number' },
      { colNum: 5, colName: 'Class', sortType: 'enumerated', sortEnumeration: ['FR', 'SO', 'JR', 'SR'] },
      { colNum: 6, colName: 'Jersey', sortType: 'number' },
      { colNum: 7, colName: 'First Name', sortType: 'string' },
      { colNum: 9, colName: 'Starter', sortType: 'boolean' },
      { colNum: 10, colName: 'Pos' },
      { colNum: 11, colName: 'Jags. Pos.' },
      { colNum: 12, colName: 'Height', sortType: 'number' },
      { colNum: 13, colName: 'Weight', sortType: 'number' },
      { colNum: 14, colName: 'Speed', sortType: 'number' },
      { colNum: 15, colName: 'Final Grade', sortType: 'number' },
      { colNum: 16, colName: 'T', sortType: 'boolean' },
    ];

    test.it('scouting reports list should be sorted alphabetically by last name asc initially', function() {
      scoutPage.getTableStatsForCol(8).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('clicking arrow next to last name header should reverse the sort', function() {
      scoutPage.clickSortIcon(8);

      scoutPage.getTableStatsForCol(8).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'desc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    var lastColNum = 8;
    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        scoutPage.clickRemoveSortIcon(lastColNum);
        lastColNum = column.colNum;
        scoutPage.clickTableHeader(column.colNum);

        scoutPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
        scoutPage.clickSortIcon(column.colNum);

        scoutPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });
    });
  });


  test.describe('#links', function() {
    test.it('clicking into a player goes to the correct page', function() {
      scoutPage.clickTableStat(1, 7);
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/player\//, 'page URL');
      });   
    });

    test.it('clicking into a scouting report goes to the correct page', function() {
      navbar.goToScoutPage();
      scoutPage.clickTableRow(1);
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/scoutingReport\//, 'page URL');
      });         
    });
  });
});