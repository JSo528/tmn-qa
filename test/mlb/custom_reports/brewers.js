var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../../lib/credentials.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var LoginPage = require('../../../pages/login_page.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var Brewers = require('../../../pages/mlb/custom_reports/brewers.js');
var navbar, filters, loginPage, teamsPage, brewers;

test.describe('#CustomReports: Brewers', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    brewers = new Brewers(driver);
    teamsPage = new TeamsPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'brewers');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Brewers page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /brewers/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      teamsPage.clickTeamTableCell(4,3);
    });

    test.describe('#SubSection: HittingSituationMaps', function() {
      test.before(function() {
        brewers.goToSubSection('hittingSituationMaps');
      });

      test.it('should show the correct filters inititually', function() {
        filters.getCurrentFiltersForDropdownFilter('Pitch Type:').then(function(pitches) {
          assert.sameMembers(pitches, [ 'Fastball','Cutter','Sinker','Splitter','Changeup','Curveball','Slider','Knuckleball','Screwball' ]);

        });
      });

      test.it('should show the correct heatmaps', function() {
        var firstPlayer, secondPlayer;
        brewers.getPlayerNameForRow(1,1).then(function(playerName) {
          firstPlayer = playerName;
        })

        brewers.getPlayerNameForRow(1,2).then(function(playerName) {
          secondPlayer = playerName;
        })

        brewers.getHeatmapTitle(1,1,1).then(function(title) {
          assert.equal(firstPlayer, title, 'title of 1st row, 1st col heatmap');
        });

        brewers.getHeatmapTitle(1,2,2).then(function(title) {
          assert.equal(secondPlayer, title, 'title of 2nd row, 2nd col heatmap');
        });
      });
    });
  });
});