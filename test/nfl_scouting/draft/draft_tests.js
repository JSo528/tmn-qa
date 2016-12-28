var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var DraftPage = require('../../../pages/nfl_scouting/draft/draft_page.js');
var navbar, draftPage;

test.describe('#Page: Draft', function() {
  test.before(function() {
    draftPage = new DraftPage(driver);
    navbar = new Navbar(driver);
    browser.visit(url);
    navbar.goToDraftPage();
  })

  test.it('should be on the correct page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /\/draft/, 'page URL');
    });
  });

  test.it('page should be initially populated with draft cards', function() {
    draftPage.getCardCount().then(function(cards) {
      assert.isAtLeast(cards, 1);
    });
  });

  test.it('draft cards should be sorted by value grade', function() {
    var gradeA, gradeB, gradeC;

    draftPage.getValueGrade(1).then(function(grade) {
      gradeA = grade;
    });

    draftPage.getValueGrade(10).then(function(grade) {
      gradeB = grade;
    });

    draftPage.getValueGrade(30).then(function(grade) {
      gradeC = grade;
      assert.isAtLeast(gradeA, gradeB, "row1 grade is smaller than row10 grade");
      assert.isAtLeast(gradeB, gradeC, "row10 grade is smaller than row30 grade");
    });
  });
});