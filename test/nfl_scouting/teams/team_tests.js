var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var TeamsPage = require('../../../pages/nfl_scouting/teams/teams_page.js');
var TeamPage = require('../../../pages/nfl_scouting/teams/team_page.js');
var navbar, teamsPage, teamPage;

test.describe('#Page: Team', function() {
  test.before(function() {
    teamPage = new TeamPage(driver);
    browser.visit(url+'team/41');
  });

  test.describe('#sorting', function() {
    test.it('roster list should be sorted alphabetically by last name asc initially', function() {
      teamPage.getTableStats(7).then(function(lastNames) {
        var sortedArray = extensions.customSort(lastNames, 'asc');
        assert.deepEqual(lastNames, sortedArray);
      });
    });

    test.it('reversing the sort should sort the list by last name desc', function() {
      teamPage.clickTableHeader(7);
      teamPage.getTableStats(7).then(function(lastNames) {
        var sortedArray = extensions.customSort(lastNames, 'desc');
        assert.deepEqual(lastNames, sortedArray);
      });
    });

    test.it('removing last name sort and selecting speed sort should sort list by speed asc', function() {
      teamPage.clickRemoveSortIcon(7)
      teamPage.clickTableHeader(12);
      teamPage.getTableStats(12).then(function(speeds) {
        var sortedArray = extensions.customSort(speeds, 'asc');
        assert.deepEqual(speeds, sortedArray);
      });
    });    
  });

  test.describe('#filters', function() {
    test.it('removing top draft year, should update player list', function() {
      teamPage.toggleDropdownFilter('Draft Years', 2017);
      teamPage.getTableStats(3).then(function(years) {
        assert.notInclude(years, '2017');
      });
    });

    test.it('adding tier B, should update player list', function() {
      teamPage.toggleDropdownFilter('Tier', 'B');
      teamPage.getTableStats(2).then(function(tiers) {
        var uniqueTiers = Array.from(new Set(tiers));
        assert.sameMembers(uniqueTiers, ['B']);
      });
    });

    test.it('selecting starters only, should update player list', function() {
      teamPage.toggleCheckboxFilter('Starter');
      teamPage.getTableCheckboxStats(8).then(function(statuses) {
        var uniqueStatuses = Array.from(new Set(statuses));
        assert.sameMembers(uniqueStatuses, ['check_box']);
      });
    });
  });

  test.describe('#updates', function() {
    test.before(function() {
      driver.navigate().refresh();
    });

    test.it('Devin Adams should be listed as non-starter', function() {
      teamPage.getTableStat(2,6).then(function(name) {
        assert.equal(name, 'Devin', 'row 2 - first name');
      });

      teamPage.getTableStat(2,7).then(function(name) {
        assert.equal(name, 'Adams', 'row 2 - last name');
      });

      teamPage.getTableCheckboxStat(2,8).then(function(status) {
        assert.equal(status, 'check_box_outline_blank', 'row 2 - starter status');
      });
    });

    test.it('selecting Devin Adams as a stater should list him as a starter', function() {
      teamPage.clickTableCheckboxStat(2,8);
      driver.navigate().refresh();

      teamPage.getTableCheckboxStat(2,8).then(function(status) {
        assert.equal(status, 'check_box', 'row 2 - starter status');
      });
    });

    test.it('removing Devin Adams as a stater should list him as a non-starter', function() {
      teamPage.clickTableCheckboxStat(2,8);
      driver.navigate().refresh();

      teamPage.getTableCheckboxStat(2,8).then(function(status) {
        assert.equal(status, 'check_box_outline_blank', 'row 2 - starter status');
      });
    });

    test.it('Devin Adams should not have a speed rating', function() {
      teamPage.getTableStat(2,12).then(function(speed) {
        assert.equal(speed, '', 'row 2 - speed rating');
      });
    });

    test.it('adding a speed rating to Devin Adams should persist', function() {
      teamPage.updateTableStat(2,12, '4.90e');
      driver.navigate().refresh();
      teamPage.getTableStat(2,12).then(function(speed) {
        assert.equal(speed, '4.90e', 'row 2 - speed rating');
      });
    });

    test.it('removing speed rating from Devin Adams should persist', function() {
      teamPage.updateTableStat(2,12, '');
      driver.navigate().refresh();
      teamPage.getTableStat(2,12).then(function(speed) {
        assert.equal(speed, '', 'row 2 - speed rating');
      });
    });

    test.it('Devin Adams should not have a tier rating', function() {
      teamPage.getTableStat(2,2).then(function(speed) {
        assert.equal(speed, '?', 'row 2 - tier rating');
      });
    });

    test.it('changing the tier rating for Devin Adams should persist', function() {
      teamPage.updateTableStatDropdown(2,2, 'C');
      teamPage.getTableStat(2,2).then(function(speed) {
        assert.equal(speed, 'C', 'row 2 - tier rating');
      });
    });

    test.it('removing the tier rating for Devin Adams should persist', function() {
      teamPage.updateTableStatDropdown(2,2, 'C');
      teamPage.getTableStat(2,2).then(function(speed) {
        assert.equal(speed, '?', 'row 2 - tier rating');
      });
    });
  });

  test.describe('#clicking', function() {
    test.it('clicking into player should redirect to correct page', function() {
      teamPage.clickTableStat(1,6);

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /\/player\//, 'page URL');
      });
    });
  });
});