var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../../pages/nfl_scouting/teams/teams_page.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var navbar, teamsPage, filters;

test.describe('#Page: Teams', function() {
  test.before(function() {
    teamsPage = new TeamsPage(driver);
    navbar = new Navbar(driver);
    filters = new Filters(driver);
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

  test.describe('#NCAA', function() {
    test.describe('#sorting', function() {
      var columns = [
        { colNum: 2, colName: 'Team Code', sortType: 'string', initialCol: true },
        { colNum: 4, colName: 'Name', sortType: '' },
        { colNum: 5, colName: 'Overall Record', sortType: 'number' },
        { colNum: 6, colName: 'Conference Record', sortType: 'number' },
        { colNum: 7, colName: 'PS', sortType: 'number' },
        { colNum: 8, colName: 'PA', sortType: 'number' },
        { colNum: 9, colName: 'Streak', sortType: 'string' },
      ];

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          this.timeout(120000);
          if (!column.initialCol) {
            teamsPage.clickRemoveSortIcon(lastColNum);
            teamsPage.clickTableHeader(column.colNum);
          }
          
          lastColNum = column.colNum;

          teamsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
          this.timeout(120000);
          teamsPage.clickSortIcon(column.colNum);

          teamsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });
      });
    });
  });

  test.describe('#NFL', function() {
    test.it('sorting by team code', function() {
      teamsPage.clickTableHeader(2);
    });

    test.it('changing filter to nfl updates the columns of the table', function() {
      filters.changeTextFilter('League', 'NFL');
      teamsPage.tableHeaderExists('Roster').then(function(stat) {
        assert.equal(stat, true, 'Roster col exists');
      });

      teamsPage.tableHeaderExists('PUP').then(function(stat) {
        assert.equal(stat, true, 'PUP col exists');
      });
    });

    test.it('changing filter to nfl updates the rows of the table', function() {
      teamsPage.getTableStat(2,4).then(function(stat) {
        assert.equal(stat, 'Arizona Cardinals', '2nd team should be Arizona Cardinals');
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colNum: 2, colName: 'Team Code', sortType: 'string', initialCol: true },
        { colNum: 4, colName: 'Name', sortType: '' },
        { colNum: 5, colName: 'Roster', sortType: 'number' },
        { colNum: 6, colName: 'PSQ', sortType: 'number' },
        { colNum: 7, colName: 'IR', sortType: 'number' },
        { colNum: 8, colName: 'PUP', sortType: 'number' },
        { colNum: 9, colName: 'A', sortType: 'number' },
        { colNum: 10, colName: 'B', sortType: 'number' },
        { colNum: 11, colName: 'C', sortType: 'number' },
        { colNum: 12, colName: 'D', sortType: 'number' },
      ];

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          this.timeout(120000);
          if (!column.initialCol) {
            teamsPage.clickRemoveSortIcon(lastColNum);
            teamsPage.clickTableHeader(column.colNum);
          }
          
          lastColNum = column.colNum;

          teamsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
          this.timeout(120000);
          teamsPage.clickSortIcon(column.colNum);

          teamsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });
      });
    });
  });  

  test.describe('#filters', function() {
    test.it('sorting by team code', function() {
      teamsPage.clickTableHeader(2);
    });

    test.it('changing filter to NCAA should update columns', function() {
      filters.changeTextFilter('League', 'NCAA');
      teamsPage.tableHeaderExists('Roster').then(function(stat) {
        assert.equal(stat, false, "Roster col doesn't exists");
      });

      teamsPage.tableHeaderExists('Overall Record').then(function(stat) {
        assert.equal(stat, false, 'Overall Record col does exists');
      });
    });

    test.it('changing filter to NCAA should update rows', function() {
      teamsPage.getTableStat(2,4).then(function(stat) {
        assert.equal(stat, 'Auburn University', '2nd team should be Auburn University');
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