var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var ListPage = require('../../../pages/nfl_scouting/lists/list_page.js');
var ListsPage = require('../../../pages/nfl_scouting/lists/lists_page.js');
var PlayerPage = require('../../../pages/nfl_scouting/players/player_page.js');
var navbar, listsPage, listPage, playerPage;
var playerRowNum = 1;

test.describe('#Page: List', function() {
  test.before(function() {
    navbar = new Navbar(driver);
    listPage = new ListPage(driver);
    listsPage = new ListsPage(driver);
    playerPage = new PlayerPage(driver);
  });
  
  test.describe('#table', function() {
    test.it('table title is labeled correctly', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('PA');
      listPage.waitForPageToLoad();

      listPage.getTableTitle().then(function(title) {
        assert.equal(title, 'PA:\nPLAYERS', 'table title');
      });
    });
  });

 test.describe('#sorting', function() {
    var columns = [
      { colNum: 2, colName: 'Draft Year', sortType: 'number' },
      { colNum: 3, colName: 'First Name', sortType: 'stringInsensitive' },
      { colNum: 4, colName: 'Last Name', sortType: 'stringInsensitive' },
      { colNum: 5, colName: 'Jersey', sortType: 'number' },
      { colNum: 6, colName: 'Pos' },
      { colNum: 7, colName: 'Height', sortType: 'number' },
      { colNum: 8, colName: 'Weight', sortType: 'number' },
      { colNum: 9, colName: 'Speed', sortType: 'number' },
      { colNum: 10, colName: 'Class', sortType: 'enumerated', sortEnumeration: ['FR', 'SO', 'JR', 'SR'] },    
      { colNum: 11, colName: 'Unenrolled', sortType: 'boolean' },
    ];

    var lastColNum;
    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        if (lastColNum) listPage.clickRemoveSortIcon(lastColNum);
        lastColNum = column.colNum;
        listPage.clickTableHeader(column.colNum);

        listPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
        listPage.clickSortIcon(column.colNum);

        listPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
          assert.deepEqual(stats, sortedArray);
        });
      });
    });
  });

  test.describe('#addingPlayer', function() {
    test.it('adding list to player', function() {
      browser.visit(url + 'player/31683');
      playerPage.addProfileList('GI');
    });

    test.it('player should show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable('ELLIS', 'RANDALL').then(function(exists) {
        assert.equal(exists, true);
      });
    });
  });

  test.describe('#removingPlayer', function() {
    test.it('removing list from player', function() {
      browser.visit(url + 'player/31683');
      playerPage.removeProfileList('GI');
    });

    test.it('player should not show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable('ELLIS', 'RANDALL').then(function(exists) {
        assert.equal(exists, false);
      });
    });
  });  
  
  test.describe('#updatingFields', function() {
    var attributes = [
      { field: 'Jersey', col: 5, type: 'input', updatedValue: 10 },
      { field: 'Pos', col: 6, type: 'dropdown', updatedValue: 'RB', placeholder: 'Select value' },
      { field: 'Height', col: 7, type: 'input', updatedValue: '6020i' },
      { field: 'Weight', col: 8, type: 'input', updatedValue: '220e' },
      { field: 'Speed', col: 9, type: 'input', updatedValue: '5.20e' },
      { field: 'Unenrolled', col: 11, type: 'checkbox', updatedValue: true }
    ];
    var firstName, lastName, newRowNum;

    test.it('get original values', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();
      
      listPage.getTableStatField('input', 1, 3).then(function(stat) {
        firstName = stat;
      });

      listPage.getTableStatField('input', 1, 4).then(function(stat) {
        lastName = stat;
      });

      attributes.forEach(function(attr, idx) {
        listPage.getTableStatField(attr.type, 1, attr.col).then(function(stat) {
          attributes[idx].originalValue = stat;
        });
      });
    });

    test.it('updating fields', function() {
      this.timeout(120000);
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.updatedValue );
      });
      browser.refresh();
      listPage.waitForPageToLoad();
      listPage.getRowNumForPlayer(firstName, lastName).then(function(stat) {
        newRowNum = stat;
      })
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        listPage.getTableStatField(attr.type, newRowNum, attr.col).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, newRowNum, attr.col, attr.originalValue );
      });
    });
  });
});