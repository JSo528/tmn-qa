var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var ScoutPage = require('../../../pages/nfl_scouting/scout/scout_page.js');
var navbar, scoutPage;

test.describe('#Page: Scout', function() {
  test.before(function() {
    scoutPage = new ScoutPage(driver);
    navbar = new Navbar(driver);
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

  test.describe('#sorting', function() {
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

    test.it('selecting jags position should sort the list by final grade asc', function() {
      scoutPage.clickRemoveSortIcon(8);
      scoutPage.clickTableHeader(3);

      scoutPage.getTableStatsForCol(3).then(function(grades) {
        var sortedArray = extensions.customSort(grades, 'asc');
        assert.deepEqual(grades, sortedArray);
      });
    });
  });

  test.describe('#filters', function() {
    test.it('removing "SR" from class year filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Class Years', 'SR');
      scoutPage.getTableStatsForCol(5).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['JR'], uniqueStats);
      });
    });

    test.it('adding "SO" from class year filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Class Years', 'SO');
      scoutPage.getTableStatsForCol(5).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['SO', 'JR'], uniqueStats);
      });
    });

    test.it('adding "DC" to position filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Jags. Pos.', 'DC');
      scoutPage.getTableStatsForCol(11).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['DC'], uniqueStats);
      });
    });   

    test.it('adding "CB" from position filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Jags. Pos.', 'FS');
      scoutPage.getTableStatsForCol(11).then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['DC', 'FS'], uniqueStats);
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