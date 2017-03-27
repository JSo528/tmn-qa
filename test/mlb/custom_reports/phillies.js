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
var PlayerPage = require('../../../pages/mlb/players/player_page.js');
var Phillies = require('../../../pages/mlb/custom_reports/phillies.js');
var navbar, filters, loginPage, playersPage, playerPage, teamsPage, teamPage, phillies;

test.describe('#CustomReports: Phillies', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    loginPage = new LoginPage(driver);
    phillies = new Phillies(driver);
    playersPage = new PlayersPage(driver);
    playerPage = new PlayerPage(driver, 'batting');
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    var newURL = url.replace(/\/\b\w+\b/, 'phillies');
    loginPage.visit(newURL);
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
  });

  test.it('should be on the Phillies page', function() {
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /phillies/, 'Correct URL');
    });
  });

  test.describe('#Section: TeamBatting', function() {
    test.before(function() {
      navbar.goToTeamsPage();
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      teamsPage.clickTeamTableCell(25,3);
    });

    test.describe('#SubSection: HittingMatchups', function() {
      test.before(function() {
        phillies.goToSubSection('hittingMatchups');
      });

      test.it('starters table has the correct title', function() {
        phillies.getTableTitle(1).then(function(title) {
          assert.equal(title, 'Phillies Starters vs NY Mets Hitters');
        });
      });

      test.it('relievers table has the correct title', function() {
        phillies.getTableTitle(2).then(function(title) {
          assert.equal(title, 'Phillies Relievers vs NY Mets Hitters');
        });
      });

      test.it('removing player from batters modal updates the table', function() {
        var newTopPlayer;

        phillies.clickEditRosterBtn('batters');
        phillies.removePlayerFromModal(1);
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        phillies.closeModal();

        phillies.getStartersTableStat(1,1).then(function(playerName) {
          // using include because the main table includes the player's batting hand
          assert.include(playerName, newTopPlayer, 'top row player');
        });
      });

      test.it('removing player from SP modal updates the table', function() {
        var newFirstPitcher;
        
        phillies.clickEditRosterBtn('sp');
        phillies.removePlayerFromModal(1);
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        phillies.closeModal();
        phillies.getStartersTableHeader(4).then(function(playerName) {
          assert.equal(playerName, newFirstPitcher, 'first pitcher');
        });
      });

      test.it('adding player from RP modal updates the table', function() {
        var newPitcher = 'Mark Melancon';
        phillies.clickEditRosterBtn('rp');
        phillies.selectForAddPlayerSearch(newPitcher);
        phillies.closeModal();

        phillies.getRelieversTableHeader('last()').then(function(lastPitcher) {
          assert.include(lastPitcher, newPitcher);
        });
      });

      test.it('selecting default roster from Batters modal updates the table', function() {
        var newTopPlayer;
        phillies.clickEditRosterBtn('batters');
        phillies.selectDefaultRoster();
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        phillies.closeModal();

        phillies.getStartersTableStat(1,1).then(function(playerName) {
          // using include because the main table includes the player's batting hand
          assert.include(playerName, newTopPlayer, 'top row player');
        });
      });
    });

    // TODO - Need to figure out a good way to test these pages since it uses dynamic data
    test.describe('#SubSection: DugoutCard', function() {
      test.before(function() {
        phillies.goToSubSection('dugoutCard');
      });

      test.it('tables have the correct title', function() {
        phillies.getDugoutCardTableTitle(1).then(function(title) {
          assert.equal(title, 'Batters', '1st Table');
        });

        phillies.getDugoutCardTableTitle(2).then(function(title) {
          assert.equal(title, 'Pitchers', '2nd Table');
        });

        phillies.getDugoutCardTableTitle(3).then(function(title) {
          assert.equal(title, 'Extra Base Hits', '3rd Table');
        });
      });
    });

    test.describe('#SubSection: LikelyOutcomes', function() {
      test.before(function() {
        phillies.goToSubSection('likelyOutcomes');
      });

      test.it('inputs have initial values', function() {
        phillies.getLikelyOutcomeInputValue(2,1).then(function(value) {
          assert.match(value, /\d{1,3}\%/, 'Ground Ball rate for 1st batter vs 1st pitcher');
        });
      });
    });    
  });

  test.describe('#Section: TeamPitching', function() {
    test.before(function() {
      teamPage.goToSection('pitching');
    });

    test.describe('#SubSection: PitchingMatchups', function() {
      test.before(function() {
        phillies.goToSubSection('pitchingMatchups');
      });

      test.it('starters table has the correct title', function() {
        phillies.getTableTitle(1).then(function(title) {
          assert.equal(title, 'NYM Starting Pitchers vs. Phillies Hitters');
        });
      });

      test.it('relievers table has the correct title', function() {
        phillies.getTableTitle(2).then(function(title) {
          assert.equal(title, 'NYM Relievers vs. Phillies Hitters');
        });
      });

      test.it('removing player from batters modal updates the table', function() {
        var newTopPlayer;

        phillies.clickEditRosterBtn('batters');
        phillies.removePlayerFromModal(1);
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        phillies.closeModal();

        phillies.getStartersTableStat(1,1).then(function(playerName) {
          // using include because the main table includes the player's batting hand
          assert.include(playerName, newTopPlayer, 'top row player');
        });
      });

      test.it('removing player from SP modal updates the table', function() {
        var newFirstPitcher;
        
        phillies.clickEditRosterBtn('sp');
        phillies.removePlayerFromModal(1);
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newFirstPitcher = playerName;
        }); 
        phillies.closeModal();
        phillies.getStartersTableHeader(3).then(function(playerName) {
          assert.equal(playerName, newFirstPitcher, 'first pitcher');
        });
      });

      test.it('adding player from RP modal updates the table', function() {
        var newPitcher = 'Mark Melancon';
        phillies.clickEditRosterBtn('rp');
        phillies.selectForAddPlayerSearch(newPitcher);
        phillies.closeModal();

        phillies.getRelieversTableHeader('last()').then(function(lastPitcher) {
          assert.include(lastPitcher, newPitcher);
        });
      });

      test.it('selecting default roster from Batters modal updates the table', function() {
        var newTopPlayer;
        phillies.clickEditRosterBtn('batters');
        phillies.selectDefaultRoster();
        phillies.getModalTableStat(1,3).then(function(playerName) {
          newTopPlayer = playerName;
        }); 
        phillies.closeModal();

        phillies.getStartersTableStat(1,1).then(function(playerName) {
          // using include because the main table includes the player's batting hand
          assert.include(playerName, newTopPlayer, 'top row player');
        });
      });      
    });

    test.describe('#SubSection: PitcherTendencies', function() {
      test.before(function() {
        phillies.goToSubSection('pitcherTendencies');
      });

      test.it('data is intiially loaded', function() {
        phillies.getPitcherTendenciesInputValue(1,1).then(function(data) {
          assert.match(data, /.*\(AVG\: .*/, 'format on 1st pitchers FB value')
        })
      });
    });    

    test.describe('#SubSection: DugoutCard', function() {
      test.before(function() {
        phillies.goToSubSection('dugoutCard');
      });

      test.it('tables have the correct title', function() {
        phillies.getDugoutCardTableTitle(1).then(function(title) {
          assert.equal(title, 'Batters', '1st Table');
        });

        phillies.getDugoutCardTableTitle(2).then(function(title) {
          assert.equal(title, 'Pitchers', '2nd Table');
        });

        phillies.getDugoutCardTableTitle(3).then(function(title) {
          assert.equal(title, 'Extra Base Hits', '3rd Table');
        });
      });
    });

    test.describe('#SubSection: LikelyOutcomes', function() {
      test.before(function() {
        phillies.goToSubSection('likelyOutcomes');
      });

      test.it('inputs have initial values', function() {
        phillies.getLikelyOutcomeInputValue(2,1).then(function(value) {
          assert.match(value, /\d{1,3}\%/, 'Ground Ball rate for 1st batter vs 1st pitcher');
        });
      });
    });   
  });

  test.describe('#Section: PlayerBatting', function() {
    test.describe('#SubSection: HitterTendencies', function() {
      test.before(function() {
        navbar.search('DJ LeMahieu', 1);
        phillies.goToSubSection('hitterTendencies');
      });

      test.describe('eBis modal', function() {
        test.it('shows correct data', function() {
          playerPage.clickEbisModalBtn();
          playerPage.getEbisModalText(1, 3).then(function(data) {
            assert.equal(data, 'Draft: 2009 Round 2, Pick 79, CHC', 'DJ LeMahieu draft information');
          });
        });

        test.after(function() {
          playerPage.clickCloseEbisModalBtn();
        });
      });

      test.describe('page data', function() {
        test.it('heat maps show', function() {
          phillies.getHeatMapImageCount().then(function(count) {
            assert.equal(count, 16, '# of heatmaps');
          })
        });

        test.it('tables are populated', function() {
          phillies.getHitterTendanciesTableHeader(2,1).then(function(header) {
            assert.equal(header, 'Fastballs');
          });
        });
      });
    });
  });

  test.describe('#Section: PlayerPitching', function() {
    test.describe('#SubSection: PitcherPercentages', function() {
      test.before(function() {
        navbar.search("Kyle Hendricks", 1);
        phillies.goToSubSection('pitcherPercentages');
      });

      test.it('velocity data shows', function() {
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2016);
        phillies.getPitcherPercentagesPitchVelocity(1).then(function(data) {
          assert.equal(data, 'Fastball : 87.7', 'Data for Fastball row');
        });
      });
    });
  });  
});