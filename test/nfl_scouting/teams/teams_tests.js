var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../../pages/nfl_scouting/teams/teams_page.js');
var navbar, teamsPage;

test.describe('#Page: Teams', function() {
  test.before(function() {
    teamsPage = new TeamsPage(driver);
    navbar = new Navbar(driver);
    browser.visit(url);
    navbar.goToTeamsPage();
  })

  test.it('should be on the correct page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /\/teams/, 'page URL');
    });
  });

  test.it('teams list should be initially populated', function() {
    teamsPage.getVisibleTeamsCount().then(function(teamCount) {
      assert.isAtLeast(teamCount, 1);
    });
  });

  test.describe('#sorting', function() {
    test.it('Teams List should be sorted alphabetically by code initially', function() {
      teamsPage.getTableStatsForCol(2).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('clicking arrow next to code header should reverse the sort', function() {
      teamsPage.clickSortIcon(2);
      teamsPage.getTableStatsForCol(2).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'desc');
        assert.deepEqual(stats, sortedArray);
      });
    });

    test.it('removing the code sorter and selecting the name sorter should sort the list by school name', function() {
      teamsPage.clickRemoveSortIcon(2);
      teamsPage.clickTableHeader(3);

      teamsPage.getTableStatsForCol(3).then(function(stats) {
        var sortedArray = extensions.customSort(stats, 'asc');
        assert.deepEqual(stats, sortedArray);
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into a team bring user to correct page', function() {
      teamsPage.clickTableRow(1);
       driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/team\//, 'page URL');
      });            
    });
  });
});