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

  test.describe('#table', function() {
    test.it('table title is labeled correctly', function() {
      listPage.getTableTitle().then(function(title) {
        assert.equal(title, 'TEST:\nPLAYERS', 'table title');
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

    test.it('sorting by draft year asc, sorts the table accordingly', function() {
      listPage.clickRemoveSortIcon(2);
      listPage.clickTableHeader(3);

      listPage.getTableStats(3).then(function(names) {
        var sortedArray = extensions.customSort(names, 'asc');
        assert.deepEqual(names, sortedArray);
      });
    });

    test.it('sorting by first name desc, sorts the table accordingly', function() {
      listPage.clickSortIcon(3);

      listPage.getTableStats(3).then(function(names) {
        var sortedArray = extensions.customSort(names, 'desc');
        assert.deepEqual(names, sortedArray);
      });
    });
  });

  test.describe('#removingPlayer', function() {
    test.it('removing list from player', function() {
      browser.visit(url + 'player/31686');
      playerPage.removeProfileList('test');
    });

    test.it('player should show up on list', function() {
      navbar.goToListsPage();
      listsPage.clickTableRowWithListName('test');
      listPage.waitForPageToLoad();

      listPage.playerExistsInTable(firstName, lastName).then(function(exists) {
        assert.equal(exists, false);
      });
    });
  });
});