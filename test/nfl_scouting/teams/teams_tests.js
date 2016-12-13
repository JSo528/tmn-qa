var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../../pages/nfl_scouting/teams/teams_page.js');
var navbar, teamsPage;

test.describe('#Page: Teams', function() {
  test.before(function() {
    teamsPage = new TeamsPage(driver);
    navbar = new Navbar(driver);
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
      var codeA, codeB, codeC;

      teamsPage.getTableStat(1,2).then(function(name) {
        codeA = name;
      });

      teamsPage.getTableStat(10,2).then(function(name) {
        codeB = name;
      });

      teamsPage.getTableStat(30,2).then(function(name) {
        codeC = name;
        assert.isAtMost(codeA, codeB, "row1 code is smaller than row10 code");
        assert.isAtMost(codeB, codeC, "row10 code is smaller than row30 code");
      });
    });

    test.it('clicking arrow next to code header should reverse the sort', function() {
      teamsPage.clickSortIcon(2);

      teamsPage.getTableStat(1,2).then(function(name) {
        codeA = name;
      });

      teamsPage.getTableStat(10,2).then(function(name) {
        codeB = name;
      });

      teamsPage.getTableStat(30,2).then(function(name) {
        codeC = name;
        assert.isAtLeast(codeA, codeB, "row1 code is smaller than row10 code");
        assert.isAtLeast(codeB, codeC, "row10 code is smaller than row30 code");
      });
    });

    test.it('removing the code sorter and selecting the name sorter should sort the list by school name', function() {
      teamsPage.clickRemoveSortIcon(2);
      teamsPage.clickTableHeader(3);

      var nameA, nameB, nameC;
      teamsPage.getTableStat(1,3).then(function(name) {
        nameA = name;
      });

      teamsPage.getTableStat(10,3).then(function(name) {
        nameB = name;
      });

      teamsPage.getTableStat(30,3).then(function(name) {
        nameC = name;
        assert.isAtMost(nameA, nameB, "row1 name is smaller than row10 name");
        assert.isAtMost(nameB, nameC, "row10 name is smaller than row30 name");
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