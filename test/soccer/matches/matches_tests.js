var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/soccer/navbar.js');
var Filters = require('../../../pages/soccer/filters.js');
var MatchesPage = require('../../../pages/soccer/matches/matches_page.js');
var navbar, filters, matchesPage;

test.describe('#Page: Scores', function() {
  test.it('navigating to scores page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    matchesPage = new MatchesPage(driver);
  });

  test.it('clicking the scores link goes to the correct page', function() {
    navbar.goToMatchesPage();

    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /match\-results/);
    });
  });  

  test.it('changing the season shows correct data in the box score summary', function() {
    matchesPage.changeSeason('Premier League 2015/2016 (England)');

    matchesPage.getBoxScoreDatetime(1).then(function(datetimeText) {
      assert.equal(datetimeText, '2016-05-17 7:00 PM UTC', 'Correct datetime');
    });

    matchesPage.getBoxScoreAttendance(1).then(function(attendance) {
      assert.equal(attendance, 74363, 'Correct attendance');
    });

    matchesPage.getBoxScoreScore(1).then(function(score) {
      assert.equal(score, '3-1', 'Correct score');
    });      

    matchesPage.getBoxScoreTeam(1, 'away').then(function(team) {
      assert.equal( team, 'AFC Bournemouth');
    })

    matchesPage.isBoxScoreTeamLogoDisplayed(1, "home").then(function(displayed) {
      assert.equal( displayed, true);
    })

    matchesPage.getBoxScoreEventPlayer(1, "home", 1).then(function(player) {
      assert.equal(player, 'W. Rooney', 'Manchester United 1st goal scorer');
    })
  });

  test.it('changing the week shows correct data in the box score summary', function() {
    matchesPage.changeWeek('12/15');

    matchesPage.getBoxScoreDatetime(3).then(function(datetimeText) {
      assert.equal(datetimeText, '2015-12-20 1:30 PM UTC', 'Correct datetime');
    });

    matchesPage.getBoxScoreAttendance(3).then(function(attendance) {
      assert.equal(attendance, 20707, 'Correct attendance');
    });

    matchesPage.getBoxScoreScore(3).then(function(score) {
      assert.equal(score, '3-0', 'Correct score');
    });      

    matchesPage.getBoxScoreTeam(3, 'home').then(function(team) {
      assert.equal( team, 'Watford');
    })

    matchesPage.isBoxScoreTeamLogoDisplayed(3, "away").then(function(displayed) {
      assert.equal( displayed, true);
    })

    matchesPage.getBoxScoreEventPlayer(3, "home", 2).then(function(player) {
      assert.equal(player, 'O. Ighalo', 'Manchester United 1st goal scorer');
    })
  });

  test.describe('#checkingLinks', function() {
    test.beforeEach(function() {
      var newUrl = url + '/soccer/match-results/Premier%20League%202015%2F2016%20(England)/5wh9ugb0hxaogfh3vu6wz7g89/18';
      matchesPage.visit(newUrl);
    });

    test.it("clicking box score goes to the correct page", function() {
      driver.sleep(5000);
      matchesPage.clickBoxScore(1);

      driver.getCurrentUrl().then(function(url) {
          assert.match(url, /soccer\/match-result\/Arsenal-Manchester-City\/2015-12-21/);
        });      
    });

    test.it('clicking into team goes to the correct page', function() {
      matchesPage.clickBoxScoreTeam(1, "home");
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /soccer\/team\/Arsenal/);
      });
    });

    test.it('clicking into player goes to the correct page', function() {
      matchesPage.clickBoxScoreEventPlayer(1, "home", 1);
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /soccer\/player\/T.%20Walcott/);
      });
    });

    test.it('clicking into league goes to the correct page', function() {
      matchesPage.clickBoxScoreLeague(1);
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /league-table\/Premier%20League/);
      });
    });    

    var footerLinks = [
      {linkNum: 1, linkName: 'Stats', urlMatch: /soccer\/match-result/},
      {linkNum: 2, linkName: 'Win Probability', urlMatch: /win-prob/}
    ]

    footerLinks.forEach(function(link) {
      test.it('clicking into footer: ' + link.linkName + ' goes to the correct page', function() {
        matchesPage.clickBoxScoreFooter(1, link.linkName);
        
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, link.urlMatch);
        });      
      });    
    })
  });
});