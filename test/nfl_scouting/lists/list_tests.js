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
var firstName, lastName;

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
      listsPage.clickTableRowWithListName('list1');
      listPage.waitForPageToLoad();

      listPage.getTableTitle().then(function(title) {
        assert.equal(title, 'LIST1:\nPLAYERS', 'table title');
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
      browser.visit(url + 'player/31686');
      playerPage.addProfileList('test');

      playerPage.getProfileInput('First Name').then(function(name) {
        firstName = name;
      });

      playerPage.getProfileInput('Last Name').then(function(name) {
        lastName = name;
      });
    });

    test.it('player should show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('test');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable(firstName, lastName).then(function(exists) {
        assert.equal(exists, true);
      });
    });
  });
  
  test.describe('#updatingPlayerInfo: Dakota Cornwell', function() {
    test.before(function() {
      browser.refresh();
      listPage.waitForPageToLoad();
    });

    var attributes = [
      // { field: 'Draft Year', col: 2, type: 'date', originalValue: 2017, updatedValue: 2018 },
      { field: 'Jersey', col: 5, type: 'input', originalValue: 11, updatedValue: 32 },
      { field: 'Pos', col: 6, type: 'dropdown', originalValue: 'QB', updatedValue: 'CB' },
      { field: 'Height', col: 7, type: 'input', originalValue: '5090', updatedValue: '6010' },
      { field: 'Weight', col: 8, type: 'input', originalValue: '170', updatedValue: '200' },
      { field: 'Speed', col: 9, type: 'input', originalValue: '4.70', updatedValue: '4.60' },
      { field: 'Unenrolled', col: 11, type: 'checkbox', originalValue: false, updatedValue: true }
    ];

    attributes.forEach(function(attr) {
      test.it(attr.field + ' should have correct initial value', function() {
        listPage.getTableStatField(attr.type, 1, attr.col).then(function(value) {
          assert.equal(value, attr.originalValue, attr.field);
        });
      });
    });

    test.it("updating fields (if this test fails, itll cause a cascading effect for the other tests in this section", function() {
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, 1, attr.col, attr.updatedValue );
      });
      browser.refresh();
      listPage.waitForPageToLoad();
    });

    attributes.forEach(function(attr) {
      test.it('updating ' + attr.field + ' should persist on reload', function() {
        listPage.getTableStatField(attr.type, 1, attr.col).then(function(value) {
          assert.equal(value, attr.updatedValue, attr.field);
        });
      });
    });

    test.it('reverting fields', function() {
      attributes.forEach(function(attr) {
        listPage.changeTableStatField(attr.type, 1, attr.col, attr.originalValue );
      });
    });
  });

  test.describe('#removingPlayer', function() {
    test.it('removing list from player', function() {
      browser.visit(url + 'player/31686');
      playerPage.removeProfileList('test');
    });

    test.it('player should not show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('test');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable(firstName, lastName).then(function(exists) {
        assert.equal(exists, false);
      });
    });
  });
});