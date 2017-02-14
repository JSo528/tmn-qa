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
    test.it('sorting by draft year asc, sorts the table accordingly', function() {
      listPage.clickTableHeader(2);

      listPage.getTableStats(2).then(function(draftYears) {
        var sortedArray = extensions.customSort(draftYears, 'asc');
        assert.deepEqual(draftYears, sortedArray);
      });
    });

    test.it('sorting by draft year desc, sorts the table accordingly', function() {
      listPage.clickSortIcon(2);

      listPage.getTableStats(2).then(function(draftYears) {
        var sortedArray = extensions.customSort(draftYears, 'desc');
        assert.deepEqual(draftYears, sortedArray);
      });
    });

    test.it('sorting by first name asc, sorts the table accordingly', function() {
      listPage.clickRemoveSortIcon(2);
      listPage.clickTableHeader(3);

      listPage.getTableStats(3).then(function(names) {
        var sortedArray = extensions.customSortStringsInsensitive(names, 'asc');
        assert.deepEqual(names, sortedArray);
      });
    });

    test.it('sorting by first name desc, sorts the table accordingly', function() {
      listPage.clickSortIcon(3);

      listPage.getTableStats(3).then(function(names) {
        var sortedArray = extensions.customSortStringsInsensitive(names, 'desc');
        assert.deepEqual(names, sortedArray);
      });
    });
  });

  test.describe('#addingPlayer', function() {
    test.it('adding list to player', function() {
      browser.visit(url + 'player/31682');
      playerPage.addProfileList('GI');
    });

    test.it('player should show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable('DAKOTA', 'CORNWELL').then(function(exists) {
        assert.equal(exists, true);
      });
    });
  });

  test.describe('#removingPlayer', function() {
    test.it('removing list from player', function() {
      browser.visit(url + 'player/31682');
      playerPage.removeProfileList('GI');
    });

    test.it('player should not show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable('DAKOTA', 'CORNWELL').then(function(exists) {
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

    test.it('get original values', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('GI');
      listPage.waitForPageToLoad();
      listPage.clickTableHeader('4')
      attributes.forEach(function(attr, idx) {
        listPage.getTableStatField(attr.type, playerRowNum, attr.col).then(function(stat) {
          attributes[idx].originalValue = stat;
        });
      });
    });

    test.it('updating fields', function() {
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.updatedValue );
      });
      browser.refresh();
      listPage.waitForPageToLoad();
      listPage.clickTableHeader('4')
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        listPage.getTableStatField(attr.type, playerRowNum, attr.col).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, playerRowNum, attr.col, attr.originalValue );
      });
    });
  });
});