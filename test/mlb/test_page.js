var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

test.describe('#Standings Page', function() {
  test.before(function() {
    var StandingsPage = require('../../pages/mlb/standings_page.js');
    standingsPage = new StandingsPage(driver);
  });

  // Home/Standings Page
  test.describe('@ standings page', function() {
    test.it('should have the correct page title', function() {
      navbar.goToStandingsPage();

      driver.getTitle().then(function(title) {
        assert.equal( title, "Standing");
      });
    });

    test.it('changing year shows correct data', function() {
      standingsPage.changeYear(2015);
      
      standingsPage.getTeamName(constants.divisions.al_east, 1).then(function(teamName) {
        assert.equal( teamName, 'Orioles', 'Correct Team in 1st');
      });
      standingsPage.getPythWins(constants.divisions.al_east, 1).then(function(pythWins) {
        assert.equal( pythWins, 93.7, 'Correct Pyth Wins');
      });
    });

    test.it('changing season level shows correct data', function() {
      standingsPage.changeSeasonLevel("AA");
      
      standingsPage.getTeamName(constants.divisions.pcl_as, 1).then(function(teamName) {
        assert.equal( teamName, 'Redbirds (STL)', 'Correct Team in 1st');
      });
      standingsPage.getPythWins(constants.divisions.pcl_as, 1).then(function(pythWins) {
        assert.equal( pythWins, 83.4, 'Correct Pyth Wins');
      });
    });  

    test.it('clicking into team goes to the right page', function() {
      standingsPage.changeSeasonLevel("MLB");
      standingsPage.goToTeamPage(constants.divisions.al_east, 1).then(function() {
        
        driver.findElement(webdriver.By.css('h1.name')).getText().then(function(text) {
          assert.equal( text, 'Los Angeles Dodgers', 'goes to the correct team page');
        });
      });
    });
  });
});