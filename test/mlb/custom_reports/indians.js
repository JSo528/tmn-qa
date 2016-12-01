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
var PlayersPage = require('../../../pages/mlb/players/players_page.js');
var Indians = require('../../../pages/mlb/custom_reports/indians.js');
var navbar, loginPage, playersPage, teamsPage, teamPage, indians;

test.describe('#CustomReports: Indians', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    loginPage = new LoginPage(driver);
    indians = new Indians(driver);
    playersPage = new PlayersPage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'indians');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Indians page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /indians/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      teamsPage.clickTeamTableCell(8,3);
    });

    test.describe('#SubSection: Printable Report', function() {
      test.before(function() {
        indians.goToSubSection('printableReport');
      });

      test.it('heatmaps have the correct titles', function() {
        indians.getHeatmapTitle(1,1).then(function(title) {
          assert.equal(title, 'Even/Hitter Adv: Strikes Taken', '1st player, 1st col heatmap title');
        });

        indians.getHeatmapTitle(1,2).then(function(title) {
          assert.equal(title, 'Pitcher Ahead: Strikes Swinging', '1st player, 2nd col heatmap title');
        });

        indians.getHeatmapTitle(1,3).then(function(title) {
          assert.equal(title, 'SLG: All Counts', '1st player, 3rd col heatmap title');
        });
      });

      test.it('removing a Batter removes player to table', function() {
        var newFirstPlayer;
        
        indians.clickEditRosterBtn('batters');
        indians.removePlayerFromModal(1);
        indians.getModalTableStat(1,3).then(function(playerName) {
          newFirstPlayer = playerName;
        }); 
        indians.closeModal();
        indians.getSectionTitle(1).then(function(playerName) {
          assert.include(playerName, newFirstPlayer, 'first batter name');
        });
      });  
    });
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: Printable Report', function() {
      test.before(function() {
        indians.goToSubSection('printableReport');
      });

      test.it('heatmaps have the correct titles', function() {
        indians.getHeatmapTitle(1,1).then(function(title) {
          assert.equal(title, 'All Counts', '1st player, 1st col heatmap title');
        });

        indians.getHeatmapTitle(1,2).then(function(title) {
          assert.equal(title, 'First Pitch', '1st player, 2nd col heatmap title');
        });

        indians.getHeatmapTitle(1,3).then(function(title) {
          assert.equal(title, 'Even/Hitter Advantage', '1st player, 3rd col heatmap title');
        });

        indians.getHeatmapTitle(1,4).then(function(title) {
          assert.equal(title, 'Pitcher Advantage', '1st player, 4th col heatmap title');
        });
      });

      test.it('removing a SP removes player to table', function() {
        var newFirstPlayer;
        
        indians.clickEditRosterBtn('sp');
        indians.removePlayerFromModal(1);
        indians.getModalTableStat(1,3).then(function(playerName) {
          newFirstPlayer = playerName;
        }); 
        indians.closeModal();
        indians.getSectionTitle(1).then(function(playerName) {
          assert.include(playerName, newFirstPlayer, 'first sp name');
        });
      }); 

      test.it('adding a RP adds player to table', function() {
        var newPlayer = 'Kenley Jansen';
        indians.clickEditRosterBtn('rp');
        indians.selectForAddPlayerSearch(newPlayer);
        indians.closeModal();

        indians.getSectionTitle('last()').then(function(lastPlayer) {
          assert.include(lastPlayer, newPlayer, 'last RP');
        });
      });
    });
  });

  test.describe('#Section: PlayerBatting', function() {    
    test.before(function() {
      navbar.goToPlayersPage();  
      playersPage.goToSection('batting');
      playersPage.clickTableStat(1,3);
    });

    test.describe('#SubSection: Printable Report', function() {
      test.before(function() {
        indians.goToSubSection('printableReport');
      });

      test.it('heatmaps have the correct titles', function() {
        indians.getHeatmapTitle(1,1).then(function(title) {
          assert.equal(title, 'Even/Hitter Adv: Strikes Taken', '1st row, 1st col heatmap title');
        });

        indians.getHeatmapTitle(1,2).then(function(title) {
          assert.equal(title, 'Pitcher Ahead: Strikes Swinging', '1st row, 2nd col heatmap title');
        });

        indians.getHeatmapTitle(1,3).then(function(title) {
          assert.equal(title, 'SLG: All Counts', '1st row, 3rd col heatmap title');
        });
      });      
    });

    test.describe('#SubSection: Vs Counts', function() {
      test.before(function() {
        indians.goToSubSection('vsCounts');
      });

      test.it('section titles are correct', function() {
        indians.getVsCountSectionTitle(1).then(function(title) {
          assert.equal(title, 'All Pitches', '1st Section Title')
        });

        indians.getVsCountSectionTitle(2).then(function(title) {
          assert.equal(title, 'First Pitch (0-0)', '2nd Section Title')
        });

        indians.getVsCountSectionTitle(3).then(function(title) {
          assert.equal(title, 'Even (0-0,1-1,2-1)', '3rd Section Title')
        });

        indians.getVsCountSectionTitle(4).then(function(title) {
          assert.equal(title, "Hitter's Counts (1-0, 2-0, 3-0, 3-1)", '4th Section Title')
        });

        indians.getVsCountSectionTitle(5).then(function(title) {
          assert.equal(title, "Pitcher's Counts (0-1, 0-2, 1-2, 2-2)", '5th Section Title')
        });

        indians.getVsCountSectionTitle(6).then(function(title) {
          assert.equal(title, "Full Count", '6th Section Title')
        });
      });
    });
  });

  test.describe('#Section: PlayerPitching', function() {
    test.describe('#SubSection: PitcherPercentages', function() {
      test.before(function() {
        navbar.goToPlayersPage();  
        playersPage.goToSection('pitching');
        playersPage.clickTableStat(1,3);
      });

      test.describe('#SubSection: Printable Report', function() {
        test.before(function() {
          indians.goToSubSection('printableReport');
        });

        test.it('heatmaps have the correct titles', function() {
          indians.getHeatmapTitle(1,1).then(function(title) {
            assert.equal(title, 'All Counts', '1st row, 1st col heatmap title');
          });

          indians.getHeatmapTitle(1,2).then(function(title) {
            assert.equal(title, 'First Pitch', '1st row, 2nd col heatmap title');
          });

          indians.getHeatmapTitle(1,3).then(function(title) {
            assert.equal(title, 'Even/Hitter Advantage', '1st row, 3rd col heatmap title');
          });

          indians.getHeatmapTitle(1,4).then(function(title) {
            assert.equal(title, 'Pitcher Advantage', '1st row, 4th col heatmap title');
          });
        });
      });

      test.describe('#SubSection: Vs Counts', function() {
        test.before(function() {
          indians.goToSubSection('vsCounts');
        });

        test.it('section titles are correct', function() {
          indians.getVsCountSectionTitle(1).then(function(title) {
            assert.equal(title, 'All Pitches', '1st Section Title')
          });

          indians.getVsCountSectionTitle(2).then(function(title) {
            assert.equal(title, 'First Pitch (0-0)', '2nd Section Title')
          });

          indians.getVsCountSectionTitle(3).then(function(title) {
            assert.equal(title, 'Even (0-0,1-1,2-1)', '3rd Section Title')
          });

          indians.getVsCountSectionTitle(4).then(function(title) {
            assert.equal(title, "Hitter's Counts (1-0, 2-0, 3-0, 3-1)", '4th Section Title')
          });

          indians.getVsCountSectionTitle(5).then(function(title) {
            assert.equal(title, "Pitcher's Counts (0-1, 0-2, 1-2, 2-2)", '5th Section Title')
          });

          indians.getVsCountSectionTitle(6).then(function(title) {
            assert.equal(title, "Full Count", '6th Section Title')
          });
        });
      });
    });
  });  
});