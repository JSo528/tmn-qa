var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var StatsPage = require('../../pages/mlb/players/stats_page.js');
var PlayerPage = require('../../pages/mlb/player/player_page.js');

var navbar, filters, statsPage, playerPage;

test.describe('#Player StatcastFielding Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver);
    statsPage = new StatsPage(driver, 'batting');

    navbar.goToPlayersPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    statsPage.clickTableStat(7,3); // should click into Mookie Betts
  });  

  test.it('should be on Mookie Betts 2016 player page', function() {
    playerPage.goToSection('statcastFielding');
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Mookie Betts');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.before(function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('clicking into OF Area w/ Filter (men on: loaded)', function() {
      test.before(function() {
        filters.toggleSidebarFilter('Men On:', 'Loaded', true);
      });

      // can't consistently click on the same fielding event, so just check if modal exists with data in it
      test.it('clicking a statcast fielding event should show data in modal', function() {
        playerPage.clickStatcastFieldingChartEvent(1);
        playerPage.getStatcastFieldingModalTitle().then(function(title) {
          assert.equal(title, 'Pop up Play by Play', 'modal title');
        });

        playerPage.getStatcastFieldingModalTableHeader(1).then(function(header) {
          assert.equal(header, 'Inn', '1st col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(3).then(function(header) {
          assert.equal(header, 'Opp', '3rd col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(8).then(function(header) {
          assert.equal(header, 'OutProb', '8th col header');
        });

        playerPage.getStatcastFieldingModalTableHeader(9).then(function(header) {
          assert.equal(header, 'PosIndOutProb', '9th col header');
        });
      });
      test.after(function() {
        playerPage.closeStatcastFieldingModal();
      });
    });

    test.describe('changing ballpark', function() {
      test.before(function() {
        filters.toggleSidebarFilter('Men On:', 'Loaded', false);
      });

      test.it('should change background image for fielding widget', function() {
        playerPage.changeBallparkDropdown('Fenway Park');
        playerPage.getCurrentBallparkImageID().then(function(id) {
          assert.equal(id, 'BOS_3', 'image id');
        });
      });   
    });

    // eBIS Modal
    test.describe("#eBIS Modal", function() {
      test.it('modal shows the correct data', function() {
        playerPage.clickEbisModalBtn();
        playerPage.getEbisModalText(1, 3).then(function(data) {
          assert.equal(data, 'Draft: 2011 Round 5, Pick 172, BOS', 'Mookie Betts draft information');
        });
      });

      test.after(function() {
        playerPage.clickCloseEbisModalBtn();
      })
    })    

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Outfielder Air Defense Range', topStat: "113.2%", statType: "ExRange%" },  
        { type: 'Outfielder Air Defense Positioning', topStat: "103.1%", statType: "OFWPosAirWOut%" },
        { type: 'Outfielder Air Defense Skills', topStat: "65.3%", statType: "OFAirOut%" },  
        { type: 'Outfield Batter Positioning', topStat: "104.4%", statType: "OFWPosAirWOut%" },    
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          // 2016 Season, 12th Col
          playerPage.getOverviewTableStat(2,7).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season: ' + report.statType);
          });
        });
      });        
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      playerPage.goToSubSection("Game Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      playerPage.getGameLogTableStat(1,4).then(function(date) {
        assert.equal(date, '10/2/2016', '1st row game date');
      });

      playerPage.getGameLogTableStat(1,5).then(function(score) {
        assert.equal(score, 'L 1-2', 'Score of game');
      });      

      playerPage.getGameLogTableStat(1,6).then(function(ball) {
        assert.equal(ball, 1, '# of OFAirBall');
      });            
      
      playerPage.getGameLogTableStat(1,13).then(function(outs) {
        assert.equal(outs, 0.01, '# of OFOutsPM');
      });                  
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Exit Velocity: 90-120) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Exit Velocity:", 90, 120);

        playerPage.getGameLogTableStat(3,4).then(function(date) {
          assert.equal(date, '9/30/2016', '3rd row game date');
        });

        playerPage.getGameLogTableStat(3,7).then(function(outs) {
          assert.equal(outs, 1, '# of OFAirOut');
        });          

        playerPage.getGameLogTableStat(3,12).then(function(outPer) {
          assert.equal(outPer, '105.4%', 'OFWAirOut%');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter("Exit Velocity:");
      });
    });
  });  

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      playerPage.goToSubSection("Pitch Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Launch Angle: 0 - 30)', function() {
      test.before(function() {
        filters.changeValuesForRangeSidebarFilter('Launch Angle:', 0, 30);
      });
      
      test.it('should show the correct at bat footer text', function() {
        playerPage.getByInningAtBatFooterText(1).then(function(text) {
          assert.equal(text, "Devon Travis Flies Out To Right Fielder Mookie Betts.");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getByInningTableStat(1,2).then(function(hang) {
          assert.equal(hang, '3.67s', 'row 1 hang');
        });
        playerPage.getByInningTableStat(1,3).then(function(distance) {
          assert.equal(distance, '42.8ft', 'row 1 dist');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewTableStat(1,4).then(function(react) {
          assert.equal(react, '0.8s', 'row 1 react');
        });

        playerPage.getFlatViewTableStat(1,6).then(function(pathEff) {
          assert.equal(pathEff, '88.6%', 'row 1 pathEff');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('Launch Angle:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      playerPage.goToSubSection("Occurrences & Streaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      playerPage.changeMainConstraint("Occurrences Of", "At Least", 2, "OFNROut (Statcast)", "In a Game", "Within a Season");
      playerPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "9 Times", '# of occurences');
      });

      playerPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 2, 'OFRNOut on 9/27/2016');
      });
    });
  });
});