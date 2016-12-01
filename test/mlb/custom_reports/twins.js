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
var Twins = require('../../../pages/mlb/custom_reports/twins.js');
var UmpiresPage = require('../../../pages/mlb/umpires/umpires_page.js');

var navbar, filters, loginPage, playersPage, twins, teamsPage, teamPage, umpiresPage;

test.describe('#CustomReports: Twins', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    twins = new Twins(driver);
    playersPage = new PlayersPage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    umpiresPage = new UmpiresPage(driver)
    
    var newURL = url.replace(/\/\b\w+\b/, 'twins');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Twins page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /twins/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      teamsPage.clickTeamTableCell(1,3);
    });

    test.describe('#SubSection: HittingMaps', function() {
      test.before(function() {
        twins.goToSubSection('hittingMaps');
      });

      test.it('heatmaps have the correct titles', function() {
        twins.getTeamHeatMapTitle(1,1,1).then(function(title) {
          assert.equal(title, 'Swings/Misses LHP', '1st row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,1,2).then(function(title) {
          assert.equal(title, 'Swings/Misses RHP', '1st row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,1).then(function(title) {
          assert.equal(title, 'FB Swings/Misses LHP', '2nd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,2).then(function(title) {
          assert.equal(title, 'FB Swings/Misses RHP', '2nd row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,1).then(function(title) {
          assert.equal(title, '2 Strikes Swing & Miss LHP', '3rd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,2).then(function(title) {
          assert.equal(title, '2 Strikes Swing & Miss RHP', '3rd row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,4,1).then(function(title) {
          assert.equal(title, 'ForwVel on FB in Zone LHP', '4th row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,4,2).then(function(title) {
          assert.equal(title, 'ForwVel on FB in Zone RHP', '4th row, 2nd col heatmap title');
        });
      });
    });

    test.describe('#SubSection: SprayCharts', function() {
      test.before(function() {
        twins.goToSubSection('sprayCharts');
      });

      test.it('Stats are displayed correctly', function() {
        twins.getSprayChartStat(1,1,1).then(function(stat) {
          assert.match(stat, /Fly\% \: \d{1,3}\.\d{1}\%/, 'format of 1st row');
        });

        twins.getSprayChartStat(1,1,2).then(function(stat) {
          assert.match(stat, /Line\% \: \d{1,3}\.\d{1}\%/, 'format of 2nd row');
        });

        twins.getSprayChartStat(1,1,3).then(function(stat) {
          assert.match(stat, /Ground\% \: \d{1,3}\.\d{1}\%/, 'format of 3rd row');
        });

        twins.getSprayChartStat(1,1,4).then(function(stat) {
          assert.match(stat, /Popup\% \: \d{1,3}\.\d{1}\%/, 'format of 4th row');
        });

        twins.getSprayChartStat(1,1,5).then(function(stat) {
          assert.match(stat, /Bunt\% \: \d{1,3}\.\d{1}\%/, 'format of 5th row');
        });
      });
    });

    test.describe('#SubSection: InfieldSprayCharts', function() {
      test.before(function() {
        twins.goToSubSection('infieldSprayCharts');
      });

      test.it('adding a batter adds player to table', function() {
        var newPlayer = 'Eric Hosmer';
        twins.clickEditRosterBtn('batters');
        twins.selectForAddPlayerSearch(newPlayer);
        twins.closeModal();

        twins.getSprayChartPlayerName('last()').then(function(lastPlayer) {
          assert.equal(lastPlayer, newPlayer, 'last hitter');
        });
      });
    });
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: SwingMissMaps', function() {
      test.before(function() {
        twins.goToSubSection('swingMissMaps');
      });
      
      test.it('heatmaps have the correct titles', function() {
        twins.getTeamHeatMapTitle(1,1,1).then(function(title) {
          assert.equal(title, 'Swings/Misses LHH', '1st row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,1,2).then(function(title) {
          assert.equal(title, 'Swings/Misses RHH', '1st row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,1).then(function(title) {
          assert.equal(title, 'FB Swings/Misses LHH', '2nd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,2).then(function(title) {
          assert.equal(title, 'FB Swings/Misses RHH', '2nd row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,1).then(function(title) {
          assert.equal(title, '2 Strikes Swing/Miss LHH', '3rd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,2).then(function(title) {
          assert.equal(title, '2 Strikes Swing/Miss RHH', '3rd row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,4,1).then(function(title) {
          assert.equal(title, 'ForwVel on FB in Zone LHH', '4th row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,4,2).then(function(title) {
          assert.equal(title, 'ForwVel on FB in Zone RHH', '4th row, 2nd col heatmap title');
        });
      });      
    });

    test.describe('#SubSection: TwoStrikeMaps', function() {
      test.before(function() {
        twins.goToSubSection('twoStrikeMaps');
      });

      test.it('heatmaps have the correct titles', function() {
        twins.getTeamHeatMapTitle(1,1,1).then(function(title) {
          assert.equal(title, '2 Strike Fastball LHH', '1st row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,1,2).then(function(title) {
          assert.equal(title, '2 Strike Fastball RHH', '1st row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,1).then(function(title) {
          assert.equal(title, '2 Strike Breaking LHH', '2nd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,2,2).then(function(title) {
          assert.equal(title, '2 Strike Breaking RHH', '2nd row, 2nd col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,1).then(function(title) {
          assert.equal(title, '2 Strike Changeup LHH', '3rd row, 1st col heatmap title');
        });

        twins.getTeamHeatMapTitle(1,3,2).then(function(title) {
          assert.equal(title, '2 Strike Changeup RHH', '3rd row, 2nd col heatmap title');
        });
      });      
    });

    test.describe('#SubSection: SprayCharts', function() {
      test.before(function() {
        twins.goToSubSection('sprayCharts');
      });

      test.it('removing a pitcher removes player to table', function() {
        var newFirstPlayer;
        
        twins.clickEditRosterBtn('sp');
        twins.removePlayerFromModal(1);
        twins.getModalTableStat(1,3).then(function(playerName) {
          newFirstPlayer = playerName;
        }); 
        twins.closeModal();
        twins.getSprayChartPlayerName(1).then(function(playerName) {
          assert.equal(playerName, newFirstPlayer, 'first hitter');
        });
      });      
    });
  });

  test.describe('#Section: PlayerPitching', function() {
    test.before(function() {
      navbar.goToPlayersPage();  
      playersPage.goToSection('pitching');
      playersPage.clickTableStat(1,3);
    });

    test.describe('#SubSection: TwoStrikeMaps', function() {
      test.before(function() {
        twins.goToSubSection('twoStrikeMaps');
      });

      test.it('heatmaps have the correct titles', function() {
        twins.getPlayerHeatMapTitle(1,1).then(function(title) {
          assert.equal(title, '2 Strike Fastball LHH', '1st row, 1st col heatmap title');
        });

        twins.getPlayerHeatMapTitle(1,2).then(function(title) {
          assert.equal(title, '2 Strike Fastball RHH', '1st row, 2nd col heatmap title');
        });

        twins.getPlayerHeatMapTitle(2,1).then(function(title) {
          assert.equal(title, '2 Strike Breaking LHH', '2nd row, 1st col heatmap title');
        });

        twins.getPlayerHeatMapTitle(2,2).then(function(title) {
          assert.equal(title, '2 Strike Breaking RHH', '2nd row, 2nd col heatmap title');
        });

        twins.getPlayerHeatMapTitle(3,1).then(function(title) {
          assert.equal(title, '2 Strike Changeup LHH', '3rd row, 1st col heatmap title');
        });

        twins.getPlayerHeatMapTitle(3,2).then(function(title) {
          assert.equal(title, '2 Strike Changeup RHH', '3rd row, 2nd col heatmap title');
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
        twins.goToSubSection('heatMaps');
      });
    
      test.it('heatmaps have the correct titles', function() {
        twins.getUmpireHeatMapTitle(1).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. All', '1st row heatmap title');
        });

        twins.getUmpireHeatMapTitle(2).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. LHB', '2nd row heatmap title');
        });

        twins.getUmpireHeatMapTitle(3).then(function(title) {
          assert.equal(title, 'Called Strike Rate vs. RHB', '3rd row heatmap title');
        });
      });      
    });
  });
});