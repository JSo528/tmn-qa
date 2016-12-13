var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

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
      var lastNameA, lastNameB, lastNameC;

      scoutPage.getTableStat(1,8).then(function(name) {
        lastNameA = name;
      });

      scoutPage.getTableStat(10,8).then(function(name) {
        lastNameB = name;
      });

      scoutPage.getTableStat(30,8).then(function(name) {
        lastNameC = name;
        assert.isAtMost(lastNameA, lastNameB, "row1 last name is smaller than row10 last name");
        assert.isAtMost(lastNameB, lastNameC, "row10 last name is smaller than row30 last name");
      });
    });

    test.it('clicking arrow next to last name header should reverse the sort', function() {
      scoutPage.clickSortIcon(8);

      scoutPage.getTableStat(1,8).then(function(name) {
        lastNameA = name;
      });

      scoutPage.getTableStat(10,8).then(function(name) {
        lastNameB = name;
      });

      scoutPage.getTableStat(30,8).then(function(name) {
        lastNameC = name;
        assert.isAtLeast(lastNameA, lastNameB, "row1 last name is smaller than row10 last name");
        assert.isAtLeast(lastNameB, lastNameC, "row10 last name is smaller than row30 last name");
      });
    });

    test.it('removing the last name sorter and selecting jags position should sort the list by jags position asc', function() {
      scoutPage.clickRemoveSortIcon(8);
      scoutPage.clickTableHeader(11);

      var posA, posB, posC;
      scoutPage.getTableStat(1,11).then(function(pos) {
        posA = pos;
      });

      scoutPage.getTableStat(10,11).then(function(pos) {
        posB = pos;
      });

      scoutPage.getTableStat(30,11).then(function(pos) {
        posC = pos;
        assert.isAtMost(posA, posB, "row1 pos is smaller than row10 pos");
        assert.isAtMost(posB, posC, "row10 pos is smaller than row30 pos");
      });      
    });
  });

  test.describe('#filters', function() {
    test.it('removing "SR" from class year filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Class Years', 'SR');
      scoutPage.getTableStat(1,5).then(function(stat) {
        assert.equal(stat, 'JR', '1st row class');
      });
    });

    test.it('adding "SO" from class year filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Class Years', 'JR');
      scoutPage.toggleDropdownFilter('Class Years', 'SO');
      scoutPage.getTableStat(1,5).then(function(stat) {
        assert.equal(stat, 'SO', '1st row class');
      });
    });

    test.it('removing "DC" from position filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Jags. Pos.', 'DC');
      scoutPage.getTableStat(1,11).then(function(stat) {
        assert.equal(stat, 'DE', '1st row Pos');
      });
    }); 

    test.it('adding "DC" to position filter should update the list', function() {
      scoutPage.toggleDropdownFilter('Jags. Pos.', 'DC');
      scoutPage.getTableStat(1,11).then(function(stat) {
        assert.equal(stat, 'DC', '1st row Pos');
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