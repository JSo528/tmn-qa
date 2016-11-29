var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var credentials = require('../../../lib/credentials.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var LoginPage = require('../../../pages/login_page.js');
var TeamPage = require('../../../pages/mlb/team/team_page.js');
var TeamsPage = require('../../../pages/mlb/teams/teams_page.js');
var TeamsStatsPage = require('../../../pages/mlb/teams/stats_page.js');
var PlayersPage = require('../../../pages/mlb/players/players_page.js');
var PlayerPage = require('../../../pages/mlb/player/player_page.js');
var Tigers = require('../../../pages/mlb/custom_reports/tigers.js');
var PlayersStatsPage = require('../../../pages/mlb/players/stats_page.js');
var navbar, filters, loginPage, playersPage, tigers, playersStatsPage;

test.describe('#CustomReports: Tigers', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    tigers = new Tigers(driver);
    playersPage = new PlayersPage(driver);
    playersStatsPage = new PlayersStatsPage(driver, 'batting');
    playerPage = new PlayerPage(driver, 'batting');
    teamsPage = new TeamsPage(driver);
    teamsStatsPage = new TeamsStatsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'tigers.analyst');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Tigers page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /tigers\.analyst/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      teamsStatsPage.clickTeamTableCell(1,3);
    });

    test.describe('#SubSection: OpposingHittingMatchupsWOBA', function() {
      test.before(function() {
        tigers.goToSubSection('opposingHittingMatchupsWOBA');
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Manny Machado';
        tigers.clickEditRosterBtn('batters');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat('last()',1,1,1).then(function(lastPlayer) {
          assert.equal(lastPlayer, newPlayer);
        });
      });

      test.it('adding a sp adds player to table', function() {
        var newPlayer = 'Marco Estrada';
        tigers.clickEditRosterBtn('sp');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat(1, 'last()',1,1).then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer, 'last starting pitcher');
        });
      });

      test.it('removing a rp removes player to table', function() {
        var newFirstPitcher;
        
        tigers.clickEditRosterBtn('rp');
        tigers.removePlayerFromModal(1);
        tigers.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        tigers.closeModal();
        tigers.getOpposingPlayerRelieverTableStat(1,2,1,1).then(function(playerName) {
          assert.include(playerName, newFirstPitcher, 'first relief pitcher');
        });
      });
    });

    test.describe('#SubSection: OpposingHittingMatchupsAVG', function() {
      test.before(function() {
        tigers.goToSubSection('opposingHittingMatchupsAVG');
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Manny Machado';
        tigers.clickEditRosterBtn('batters');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat('last()',1,1,1).then(function(lastPlayer) {
          assert.equal(lastPlayer, newPlayer);
        });
      });

      test.it('adding a sp adds player to table', function() {
        var newPlayer = 'Marco Estrada';
        tigers.clickEditRosterBtn('sp');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat(1,'last()',1,1).then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer);
        });
      });

      test.it('removing a rp removes player to table', function() {
        var newFirstPitcher;
        
        tigers.clickEditRosterBtn('rp');
        tigers.removePlayerFromModal(1);
        tigers.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        tigers.closeModal();
        tigers.getOpposingPlayerRelieverTableStat(1,2,1,1).then(function(playerName) {
          assert.include(playerName, newFirstPitcher, 'first relief pitcher');
        });
      });
    });

    test.describe('#SubSection: HittingTendencies', function() {
      test.before(function() {
        tigers.goToSubSection('hittingTendencies');
      });

      test.it('title of heatmaps are correct', function() {
        tigers.getHeatmapTitle(1,1,1).then(function(title) {
          assert.equal(title, 'FB AVG RHP', 'top left heatmap title');
        });

        tigers.getHeatmapTitle(1,1,2).then(function(title) {
          assert.equal(title, 'Offspeed AVG RHP', 'top right heatmap title');
        });

        tigers.getHeatmapTitle(2,2,1).then(function(title) {
          assert.equal(title, 'FB Miss% LHP', 'bottom left heatmap title');
        });

        tigers.getHeatmapTitle(2,2,2).then(function(title) {
          assert.equal(title, 'Offspeed Miss% LHP', 'bottom right heatmap title');
        });
      });
    });

    test.describe('#SubSection: TendenciesByCount', function() {
      test.before(function() {
        tigers.goToSubSection('tendenciesByCount');
      });

      test.it('headers for table are correct', function() {
        tigers.getTendenciesByCountTableHeader(3).then(function(header) {
          assert.equal(header, 'SW %', 'col 3 header');
        });

        tigers.getTendenciesByCountTableHeader(4).then(function(header) {
          assert.equal(header, 'AVG.', 'col 4 header');
        });

         tigers.getTendenciesByCountTableHeader(6).then(function(header) {
          assert.equal(header, 'SW %', 'col 6 header');
        });

        tigers.getTendenciesByCountTableHeader(7).then(function(header) {
          assert.equal(header, 'AVG.', 'col 7 header');
        });
      });
    });

    test.describe('#SubSection: SprayCharts', function() {
      test.before(function() {
        tigers.goToSubSection('sprayCharts');
      });

      test.it('outfield spray chart is displayed', function() {
        tigers.isSprayChartDisplayed(1, 'outfield').then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        })
      });

      test.it('infield spray chart is displayed', function() {
        tigers.isSprayChartDisplayed(1, 'infield').then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        })
      });
    });
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: OpposingPitchingMatchupsWOBA', function() {
      test.before(function() {
        tigers.goToSubSection('opposingPitchingMatchupsWOBA');
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Manny Machado';
        tigers.clickEditRosterBtn('batters');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getPitcherWOBAOpposingPlayerTableStat(1,'last()',1,1,1).then(function(lastPlayer) {
          assert.equal(lastPlayer, newPlayer);
        });
      });

      test.it('adding a sp adds player to table', function() {
        var newPlayer = 'Marco Estrada';
        tigers.clickEditRosterBtn('sp');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getPitcherWOBAOpposingPlayerTableStat(1,1,'last()',1,1).then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer);
        });
      });

      test.it('removing a rp removes player to table', function() {
        var newFirstPitcher;
        
        tigers.clickEditRosterBtn('rp');
        tigers.removePlayerFromModal(1);
        tigers.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        tigers.closeModal();
        tigers.getPitcherWOBAOpposingPlayerTableStat(2,1,2,1,1).then(function(playerName) {
          assert.include(playerName, newFirstPitcher, 'first relief pitcher');
        });
      });
    });

    test.describe('#SubSection: OpposingPitchingMatchupsAVG', function() {
      test.before(function() {
        tigers.goToSubSection('opposingPitchingMatchupsAVG');
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Manny Machado';
        tigers.clickEditRosterBtn('batters');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat('last()',1,1,1).then(function(lastPlayer) {
          assert.equal(lastPlayer, newPlayer);
        });
      });

      test.it('adding a sp adds player to table', function() {
        var newPlayer = 'Marco Estrada';
        tigers.clickEditRosterBtn('sp');
        tigers.selectForAddPlayerSearch(newPlayer);
        tigers.closeModal();

        tigers.getOpposingPlayerStarterTableStat(1,'last()',1,1).then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer);
        });
      });

      test.it('removing a rp removes player to table', function() {
        var newFirstPitcher;
        
        tigers.clickEditRosterBtn('rp');
        tigers.removePlayerFromModal(1);
        tigers.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        tigers.closeModal();
        tigers.getOpposingPlayerRelieverTableStat(1,2,1,1).then(function(playerName) {
          assert.include(playerName, newFirstPitcher, 'first relief pitcher');
        });
      });
    });

    test.describe('#SubSection: PitcherTendencies', function() {
      test.before(function() {
        tigers.goToSubSection('pitcherTendencies');
      });

      test.it('headers for table are correct', function() {
        tigers.getPitcherTendenciesTableHeader(1).then(function(header) {
          assert.equal(header, 'Last Name', 'col 1 header');
        });

        tigers.getPitcherTendenciesTableHeader(6).then(function(header) {
          assert.equal(header, 'Total GB%', 'col 6 header');
        });

         tigers.getPitcherTendenciesTableHeader(9).then(function(header) {
          assert.equal(header, 'GB% vs. LHH', 'col 9 header');
        });
      });
    });
  });

  test.describe('#Section: PlayerBatting', function() {
    test.before(function() {
      navbar.goToPlayersPage();  
      playersPage.goToSection('batting');
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      playersStatsPage.clickTableStat(1,3);
    });

    test.describe('#SubSection: HittingTendencies', function() {
      test.before(function() {
        tigers.goToSubSection('hittingTendencies');
      });

      test.it('title of heatmaps are correct', function() {
        tigers.getHeatmapTitle(2,1,1).then(function(title) {
          assert.equal(title, 'FB AVG LHP', 'top left heatmap title');
        });

        tigers.getHeatmapTitle(2,1,2).then(function(title) {
          assert.equal(title, 'Offspeed AVG LHP', 'top right heatmap title');
        });

        tigers.getHeatmapTitle(1,2,1).then(function(title) {
          assert.equal(title, 'FB Miss% RHP', 'bottom left heatmap title');
        });

        tigers.getHeatmapTitle(1,2,2).then(function(title) {
          assert.equal(title, 'Offspeed Miss% RHP', 'bottom right heatmap title');
        });
      });
    });
  });
});