var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../../lib/credentials.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var LoginPage = require('../../../pages/login_page.js');
var TeamPage = require('../../../pages/mlb/teams/team_page.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var PlayersPage = require('../../../pages/mlb/players/players_page.js');
var Marlins = require('../../../pages/mlb/custom_reports/marlins.js');
var navbar, filters, loginPage, playersPage, teamsPage, teamPage, marlins;

test.describe('#CustomReports: Marlins', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    marlins = new Marlins(driver);
    playersPage = new PlayersPage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'marlins');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Marlins page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /marlins/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.search('Pittsburgh Pirates', 1);
    });

    test.describe('#SubSection: CustomBatting', function() {
      test.it('images start with 9 grid zones', function() {
        this.timeout(120000);
        marlins.goToSubSection('customBatting');
        marlins.getNumberOfGridZonesForImages().then(function(zones) {
          assert.equal(zones, 9);
        });
      });

      test.it('images update when changing to 4 grid zones', function() {
        marlins.changeGridZones(4);
        marlins.getNumberOfGridZonesForImages().then(function(zones) {
          assert.equal(zones, 4);
        });
      });
    });

    test.describe('#SubSection: DugoutCard', function() {
      test.before(function() {
        marlins.goToSubSection('dugoutCard');
      });

      test.it('removing player from batters modal updates the table', function() {
        var newTopPlayer;

        marlins.clickEditRosterBtn('batters');
        marlins.removePlayerFromModal(1);
        marlins.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        marlins.closeModal();

        marlins.getLineupTableStat(4,2).then(function(playerName) {
          assert.equal(playerName, newTopPlayer, 'top row player');
        });
      });

      test.it('adding player from pitchers modal updates the table', function() {
        var newPitcher = 'Mark Melancon';
        marlins.clickEditRosterBtn('pitchers');
        marlins.selectForAddPlayerSearch(newPitcher);
        marlins.closeModal();

        marlins.getBullpenTableStat('last()',6).then(function(lastPitcher) {
          assert.equal(lastPitcher, newPitcher, 'last pitcher in bullpen');
        });
      });

      test.it('selecting default roster from Batters modal updates the table', function() {
        var newTopPlayer;
        marlins.clickEditRosterBtn('batters');
        marlins.selectDefaultRoster();
        marlins.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        marlins.closeModal();

        marlins.getLineupTableStat(4,2).then(function(playerName) {
          // using include because the main table includes the player's batting hand
          assert.equal(playerName, newTopPlayer, 'top row player');
        });
      });
    });
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: CustomPitching', function() {
      test.before(function() {
        marlins.goToSubSection('customPitching');
      });

      test.it('changing filter (Date Range: 2016-4-1 to 2016-10-1) updates page', function() {
        this.timeout(180000);
        filters.changeDropdownForDateSidebarFilter('Date Range:', '2016 First Half');
        marlins.getHeaderForFirstPlayer().then(function(headerText) {
          assert.match(headerText, /2016-04-01[\n -]*2016-07-13/);
        });
      });
    });

    test.describe('#SubSection: Menechino Report', function() {
      test.before(function() {
        marlins.goToSubSection('menechinoReport');
      });
      
      test.it('first player shows 4 heatmap images', function() {
        marlins.getMenechinoFirstPlayerHeatMapCount ().then(function(count) {
          assert.equal(4, count);
        })
      });
    });
  });

  test.describe('#Section: PlayerBatting', function() {
    test.before(function() {
      navbar.goToPlayersPage();  
      playersPage.clickTableStat(1,3);
    });

    test.describe('#SubSection: CustomBatting', function() {
      test.before(function() {
        marlins.goToSubSection('customBatting');
      });

      test.it('page shows 15 heatmap images', function() {
        marlins.getPlayerHeatMapCount().then(function(count) {
          assert.equal(count, 15);
        })
      });
    });
  });  

  test.describe('#Section: PlayerPitching', function() {
    test.before(function() {
      navbar.search('Max Scherzer', 1)
    });

    test.describe('#SubSection: CustomPitching', function() {
      test.before(function() {
        marlins.goToSubSection('customPitching');
      });

      test.it('page shows 14 heatmap images', function() {
        marlins.getPlayerHeatMapCount().then(function(count) {
          assert.equal(count, 14);
        });
      });
    });

    test.describe('#SubSection: Menechino Report', function() {
      test.before(function() {
        marlins.goToSubSection('menechinoReport');
      });

      test.it('player shows 4 heatmap images', function() {
        marlins.getMenechinoFirstPlayerHeatMapCount ().then(function(count) {
          assert.equal(4, count);
        })
      });
    });
  });    
});