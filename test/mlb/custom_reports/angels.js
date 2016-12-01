var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../../lib/credentials.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var LoginPage = require('../../../pages/login_page.js');
var TeamPage = require('../../../pages/mlb/teams/team_page.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var Angels = require('../../../pages/mlb/custom_reports/angels.js');
var navbar, loginPage, teamsPage, teamPage, angels;

test.describe('#CustomReports: Angels', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    loginPage = new LoginPage(driver);
    angels = new Angels(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'angels');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Angels page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /angels/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      teamsPage.clickTeamTableCell(1,3);
    });

    test.describe('#SubSection: SprayCharts', function() {
      test.before(function() {
        angels.goToSubSection('sprayCharts');
      });

      test.it('changing last balls in play input to 20 updates spray charts', function() {
        angels.changeLastBallsInPlayInput(20);
        
        angels.getSprayChartBallCount(1,1,1).then(function(count) {
          assert.isAtMost(count, 20, '1st player 1st row 1st col ball count');
        });

        angels.getSprayChartBallCount(2,1,2).then(function(count) {
          assert.isAtMost(count, 20, '2nd player 1st row 2nd col ball count');
        });

        angels.getSprayChartBallCount(3,2,1).then(function(count) {
          assert.isAtMost(count, 20, '3rd player 2nd row 1st col ball count');
        });

        angels.getSprayChartBallCount(4,2,2).then(function(count) {
          assert.isAtMost(count, 20, '4th player 2nd row 2nd col ball count');
        });
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Eric Hosmer';
        angels.clickEditRosterBtn('batters');
        angels.selectForAddPlayerSearch(newPlayer);
        angels.closeModal();

        angels.getSprayChartPlayerName('last()').then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer, 'last hitter');
        });
      });      
    });
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: SprayCharts', function() {
      test.before(function() {
        angels.goToSubSection('sprayCharts');
      });

      test.it('changing last balls in play input to 20 updates spray charts', function() {
        angels.changeLastBallsInPlayInput(20);
        
        angels.getSprayChartBallCount(1,1,1).then(function(count) {
          assert.isAtMost(count, 20, '1st player 1st row 1st col ball count');
        });

        angels.getSprayChartBallCount(2,1,2).then(function(count) {
          assert.isAtMost(count, 20, '2nd player 1st row 2nd col ball count');
        });

        angels.getSprayChartBallCount(3,2,1).then(function(count) {
          assert.isAtMost(count, 20, '3rd player 2nd row 1st col ball count');
        });

        angels.getSprayChartBallCount(4,2,2).then(function(count) {
          assert.isAtMost(count, 20, '4th player 2nd row 2nd col ball count');
        });
      });

      test.it('removing a SP removes player to table', function() {
        var newFirstPlayer;
        
        angels.clickEditRosterBtn('sp');
        angels.removePlayerFromModal(1);
        angels.getModalTableStat(1,3).then(function(playerName) {
          newFirstPlayer = playerName;
        }); 
        angels.closeModal();
        angels.getSprayChartPlayerName(1).then(function(playerName) {
          assert.equal(playerName, newFirstPlayer, 'first SP');
        });
      });      

      test.it('adding a RP adds player to table', function() {
        var newPlayer = 'Kenley Jansen';
        angels.clickEditRosterBtn('rp');
        angels.selectForAddPlayerSearch(newPlayer);
        angels.closeModal();

        angels.getSprayChartPlayerName('last()').then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer, 'last RP');
        });
      });
    });
  });
});