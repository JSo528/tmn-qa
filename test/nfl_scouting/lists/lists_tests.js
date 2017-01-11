var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var ListsPage = require('../../../pages/nfl_scouting/lists/lists_page.js');
var navbar, listsPage;

test.describe('#Page: Lists', function() {
  test.before(function() {
    listsPage = new ListsPage(driver);
    navbar = new Navbar(driver);
    browser.visit(url);
    navbar.goToListsPage();
  })

  test.it('should be on the correct page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /\/tags/, 'page URL');
    });
  });

  test.it('lists table should be initially populated', function() {
    listsPage.getVisibleListsCount().then(function(listCount) {
      assert.isAtLeast(listCount, 1);
    });
  });

  test.it('lists name should appear', function() {
    listsPage.getTableStat(1,2).then(function(listName) {
      assert.isNotNull(listName);
    });
  });

  test.describe('#sorting', function() {
    test.it('clicking name header should sort lists by name asc', function() {
      listsPage.clickTableHeader(2);
      listsPage.getTableStatsForCol(2).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('clicking arrow next to name header should reverse sort', function() {
      listsPage.clickSortIcon(2);
      listsPage.getTableStatsForCol(2).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'desc');
        assert.deepEqual(stats, sortedArray);
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into a list bring user to correct page', function() {
      listsPage.clickTableRow(1);
       driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/tag\//, 'page URL');
      });            
    });
  });
});