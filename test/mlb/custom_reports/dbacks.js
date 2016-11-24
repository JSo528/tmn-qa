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
var Dbacks = require('../../../pages/mlb/custom_reports/dbacks.js');
var PlayersStatsPage = require('../../../pages/mlb/players/stats_page.js');
var UmpiresPage = require('../../../pages/mlb/umpires_page.js');
var UmpirePage = require('../../../pages/mlb/umpire_page.js');

var navbar, filters, loginPage, playersPage, dbacks, playersStatsPage, umpiresPage, umpirePage;

test.describe('#CustomReports: Dbacks', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    dbacks = new Dbacks(driver);
    playersPage = new PlayersPage(driver);
    playersStatsPage = new PlayersStatsPage(driver, 'batting');
    playerPage = new PlayerPage(driver, 'batting');
    teamsPage = new TeamsPage(driver);
    teamsStatsPage = new TeamsStatsPage(driver);
    teamPage = new TeamPage(driver);
    umpiresPage = new UmpiresPage(driver)
    umpirePage = new UmpirePage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'dbacks');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Dbacks page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /dbacks/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      teamsStatsPage.clickTeamTableCell(1,3);
    });

    test.describe('#SubSection: HittingSituationMaps', function() {
      test.before(function() {
        dbacks.goToSubSection('hittingSituationMaps');
      });

      test.it('heatmaps have the correct titles for slg charts', function() {
        dbacks.getTeamHeatMapTitle(1,'slg',1,1).then(function(title) {
          assert.equal(title, 'LHP - SLG vs. FB', '1st row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',1,2).then(function(title) {
          assert.equal(title, 'RHP - SLG vs. FB', '1st row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',2,1).then(function(title) {
          assert.equal(title, 'LHP - SLG vs. OFFSPEED', '2nd row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',2,2).then(function(title) {
          assert.equal(title, 'RHP - SLG vs. OFFSPEED', '2nd row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',3,1).then(function(title) {
          assert.equal(title, 'LHP - HITTER AHEAD SLG vs. FB', '3rd row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',3,2).then(function(title) {
          assert.equal(title, 'RHP - HITTER AHEAD SLG vs. FB', '3rd row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',4,1).then(function(title) {
          assert.equal(title, 'LHP - HITTER AHEAD SLG vs. OFFSPEED', '4th row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'slg',4,2).then(function(title) {
          assert.equal(title, 'RHP - HITTER AHEAD SLG vs. OFFSPEED', '4th row, 2nd col heatmap title');
        });
      });

      test.it('heatmaps have the correct titles for avg charts', function() {
        dbacks.getTeamHeatMapTitle(1,'avg',1,1).then(function(title) {
          assert.equal(title, 'LHP - AVG vs. FB', '1st row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',1,2).then(function(title) {
          assert.equal(title, 'RHP - AVG vs. FB', '1st row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',2,1).then(function(title) {
          assert.equal(title, 'LHP - AVG vs. OFFSPEED', '2nd row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',2,2).then(function(title) {
          assert.equal(title, 'RHP - AVG vs. OFFSPEED', '2nd row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',3,1).then(function(title) {
          assert.equal(title, 'LHP - RISP AVG vs. FB', '3rd row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',3,2).then(function(title) {
          assert.equal(title, 'RHP - RISP AVG vs. FB', '3rd row, 2nd col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',4,1).then(function(title) {
          assert.equal(title, 'LHP - RISP AVG vs. OFFSPEED', '4th row, 1st col heatmap title');
        });

        dbacks.getTeamHeatMapTitle(1,'avg',4,2).then(function(title) {
          assert.equal(title, 'RHP - RISP AVG vs. OFFSPEED', '4th row, 2nd col heatmap title');
        });
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Corey Seager';
        dbacks.clickEditRosterBtn('batters');
        dbacks.selectForAddPlayerSearch(newPlayer);
        dbacks.closeModal();

        dbacks.getPlayerName('last()').then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer, 'last hitter');
        });
      });
    });
  }); 

  test.describe('#Section: Umpire', function() {
    test.before(function() {
      navbar.goToUmpiresPage();  
      umpiresPage.goToUmpirePage(1);
    });

    test.describe('#SubSection: HeatMaps', function() {
      test.before(function() {
        dbacks.goToSubSection('heatMaps');
      });
    
      test.it('heatmap section has the correct titles for LHP', function() {
        dbacks.getUmpireHeatMapSectionTitle(1).then(function(title) {
          assert.match(title, /LHP/);
        });
      });

      test.it('heatmap section has the correct titles for RHP', function() {
        dbacks.getUmpireHeatMapSectionTitle(2).then(function(title) {
          assert.match(title, /RHP/);
        });
      });

      test.it('heatmaps have the correct titles for LHP', function() {
        dbacks.getUmpireHeatMapTitle(1,1,1).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. LHH', '1st row 1st col heatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,1,2).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. RHH', '1st row 2nd colheatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,2,1).then(function(title) {
          assert.equal(title, 'SLAA vs. LHH', '2nd row 1st col heatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,2,2).then(function(title) {
          assert.equal(title, 'SLAA vs. RHH', '2nd row 2nd col heatmap title');
        });
      });

      test.it('heatmaps have the correct titles for RHP', function() {
        dbacks.getUmpireHeatMapTitle(1,1,1).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. LHH', '1st row 1st col heatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,1,2).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. RHH', '1st row 2nd colheatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,2,1).then(function(title) {
          assert.equal(title, 'SLAA vs. LHH', '2nd row 1st col heatmap title');
        });

        dbacks.getUmpireHeatMapTitle(1,2,2).then(function(title) {
          assert.equal(title, 'SLAA vs. RHH', '2nd row 2nd col heatmap title');
        });
      });      
    });
  });
});