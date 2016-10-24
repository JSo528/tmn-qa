var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
  
// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var ScoresPage = require('../../pages/mlb/scores_page.js');
var navbar, scoresPage;

test.describe('#Scores Page', function() {
  test.before(function() {
    navbar  = new Navbar(driver);
    scoresPage = new ScoresPage(driver);
  });

  test.it('clicking the scores link goes to the correct page', function() {
    navbar.goToScoresPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Scores', 'Correct title');
    });
  });

  test.it('changing the date shows correct data in the box score summary', function() {
    scoresPage.changeDate('2016-10-02');

    scoresPage.getBoxScoreDatetime(1).then(function(datetimeText) {
      assert.equal( datetimeText, '10/2/2016, 3:05 PM ET', 'Correct datetime');
    });

    scoresPage.getBoxScoreRunsForInning(1, "home", 4).then(function(runs) {
      assert.equal( runs, 1, 'Correct runs');
    });

    scoresPage.getBoxScoreTotalRuns(1, "away", 2).then(function(runs) {
      assert.equal( runs, 5, 'Correct total runs');
    });      

    scoresPage.getBoxScorePitcher(1, 'win').then(function(pitcher) {
      assert.equal( pitcher, 'Kevin Gausman')
    })

    scoresPage.teamLogoDisplayed(1, "home").then(function(displayed) {
    assert.equal( displayed, true)
    })
  });

  test.it('shows the winner highlighted in the box score summary', function() {
    scoresPage.getBoxScoreRowColor(1, "away").then(function(color) {
      assert.equal( color, 'rgba(179, 255, 186, 1)', 'Correct background-color for winner');
    })
  }); 

  test.it('changing the season level shows correct data', function() {
    scoresPage.changeDate('2016-5-02').then()
    scoresPage.changeSeasonLevel("A+");
    
    scoresPage.getBoxScorePitcher(1, 'win').then(function(pitcher) {
      assert.equal( pitcher, 'Jordan Milbrath');
    });
  });    

  test.describe('#Checking Links', function() {
    test.beforeEach(function() {
      var newUrl = url + "/baseball/scores?pc=%7B%22bbslvls%22%3A%22MLB%22%2C%22bgd%22%3A%222016-10-02%22%7D&is=true"
      scoresPage.visit(newUrl);
    });

    test.it('clicking into team goes to the correct page', function() {
      scoresPage.clickTeam(1, "home");
      
      // TODO - make sure right team
      driver.getTitle().then(function(title) {
        assert.equal( title, 'Team Batting');
      });
    });

    test.it('clicking into player goes to the correct page', function() {
      scoresPage.clickPitcher(1, "loss");
      
      // TODO - make sure right player
      driver.getTitle().then(function(title) {
        assert.equal( title, 'Player Pitching');
      });
    });           

    var footerLinks = [
      {linkNum: 1, linkName: 'Batting', expectedTitle: 'Game - Box Score - Batting'},
      {linkNum: 2, linkName: 'Pitching', expectedTitle: 'Game - Box Score - Pitching'},
      {linkNum: 3, linkName: 'Pitch By Pitch', expectedTitle: 'Game - Box Score - Pitch By Pitch'},
      {linkNum: 4, linkName: 'Pitching Splits', expectedTitle: 'Game - Box Score - Pitching Splits'}
    ]

    footerLinks.forEach(function(link) {
      test.it('clicking into footer: ' + link.linkName + ' goes to the correct page', function() {
        scoresPage.clickBoxScoreFooter(1, link.linkName);
        
        // TODO - more data validation
        driver.getTitle().then(function(title) {
          assert.equal( title, link.expectedTitle);
        });      
      });    
    })

    test.it('clicking box score goes to the correct page', function() {
      scoresPage.clickBoxScore(1);

      // TODO - more data validation
      driver.getTitle().then(function(title) {
        assert.equal( title, 'Game - Box Score - Batting');
      });              
    });    
  })
})