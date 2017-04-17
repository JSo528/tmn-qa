var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var ScoresPage = require('../../../pages/nfl/scores/scores_page.js');
var TeamPage = require('../../../pages/nfl/teams/team_page.js');
var navbar, filters, scoresPage;

test.describe('#Page: Scores', function() {
  test.it('navigating to scores page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    scoresPage = new ScoresPage(driver);
    teamPage = new TeamPage(driver);
  });

  test.it('clicking the scores link goes to the correct page', function() {
    navbar.goToScoresPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Scores', 'Correct title');
    });
  });  

  test.it('changing the year & week shows correct data in the box score summary', function() {
    scoresPage.changeYearAndWeek(2016, 'W14');

    scoresPage.getBoxScoreDatetime(1).then(function(datetimeText) {
      assert.equal( datetimeText, '12/8/2016, 8:25 PM ET', 'Correct datetime');
    });

    scoresPage.getBoxScorePtsForQuarter(1, "home", 2).then(function(points) {
      assert.equal( points, 21, 'Correct pts');
    });

    scoresPage.getBoxScoreTotalPts(1, "away").then(function(points) {
      assert.equal( points, 13, 'Correct total pts');
    });      

    scoresPage.getBoxScoreTeam(1, 'away').then(function(team) {
      assert.equal( team, 'Raiders');
    })

    scoresPage.teamLogoDisplayed(1, "home").then(function(displayed) {
      assert.equal( displayed, true);
    })
  });

  test.it('shows the winner highlighted box score summary', function() {
    scoresPage.getBoxScoreRowColor(1, "home").then(function(color) {
      assert.equal( color, 'rgba(229, 255, 231, 1)', 'Correct background-color for winner');
    })
  });

  test.describe('#checkingLinks', function() {
    test.beforeEach(function() {
      var newUrl = url + '/football/scores/nfl?pc=%7B"fws"%3A"14"%7D&is=true';
      scoresPage.visit(newUrl);
    });

    test.it('clicking into team goes to the correct page', function() {
      scoresPage.clickTeam(1, "home");
      teamPage.waitForTableToLoad();
      
      driver.getTitle().then(function(title) {
        assert.equal( title, 'Chiefs Overview');
      });
    });

    var footerLinks = [
      {linkNum: 1, linkName: 'Box Score', urlMatch: /Box Score/},
      {linkNum: 2, linkName: 'Team Summary', urlMatch: /Team Summary/},
      {linkNum: 3, linkName: 'Play By Play', urlMatch: /Play By Play/},
      {linkNum: 4, linkName: 'Drives', urlMatch: /Drives/}
    ]

    footerLinks.forEach(function(link) {
      test.it('clicking into footer: ' + link.linkName + ' goes to the correct page', function() {
        scoresPage.clickBoxScoreFooter(1, link.linkName);
        
        driver.getTitle().then(function(title) {
          assert.match( title, link.urlMatch);
        });      
      });    
    })

    test.it("clicking box score goes to the correct page", function() {
      scoresPage.clickBoxScore(1);

      // TODO - more data validation
      driver.getTitle().then(function(title) {
        assert.match( title, /Box Score/);
      });              
    });
  });
});