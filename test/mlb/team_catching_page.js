var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var TeamsPage = require('../../pages/mlb/teams/teams_page.js');
var StatsPage = require('../../pages/mlb/teams/stats_page.js');
var TeamPage = require('../../pages/mlb/team/team_page.js');
var OverviewPage = require('../../pages/mlb/team/overview_page.js');
var PitchLogPage = require('../../pages/mlb/team/pitch_log_page.js');

var navbar, filters, teamsPage, statsPage, teamPage, overviewPage, pitchLogPage;

test.describe('#Team Catching Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    statsPage = new StatsPage(driver);
    teamPage = new TeamPage(driver);
    overviewPage = new OverviewPage(driver);
    pitchLogPage = new PitchLogPage(driver, 'catching');

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    statsPage.clickTeamTableCell(5,3); // should click into Texas Rangers
    teamPage.goToSection("catching");
  });  

  test.it('should be on Texas Rangers 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'Texas Rangers');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.it('should initially have the correct data', function() {
        overviewPage.getTeamTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      });            

    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('selecting a heat map rectangle on the left image updates the data table', function() {
        overviewPage.drawBoxOnCatcherHeatMap('left', 130,120,120,49);  

        overviewPage.getTeamTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 27, 'StrkFrmd');
        });        
      });            

      test.it('clearing the left heat map resets the data table', function() {
        overviewPage.clearCatcherHeatMap('left');
        overviewPage.getTeamTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      });     

      test.it('selecting a heat map rectangle on the right image updates the data table', function() {
        overviewPage.drawBoxOnCatcherHeatMap('right', 130,220,120,49);  

        overviewPage.getTeamTableStat(10).then(function(strkFrmd) {
          assert.isAtMost(strkFrmd, 61, 'StrkFrmd');
        });        
      });   

      test.it('clearing the right heat maps resets the data table', function() {
        overviewPage.clearCatcherHeatMap('right');
        overviewPage.getTeamTableStat(10).then(function(strkFrmd) {
          assert.equal(strkFrmd, 169, 'StrkFrmd');
        });        
      }); 
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Pitch Types', topStat: '10.9%', statType: "Curve%" },  
        { type: 'Pitch Type Counts', topStat: 2570, statType: "Curve#" },  
        { type: 'Catcher Defense', topStat: 3, statType: "E" },  
        { type: 'Catcher Opposing Batters', topStat: 534, statType: "BB" },  
        { type: 'Catcher Pitch Rates', topStat: '46.7%', statType: "Swing%" },  
        { type: 'Catcher Pitch Counts', topStat: 2452, statType: "Miss#" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          overviewPage.getTeamTableStat(8).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.before(function() {
      teamPage.goToSubSection("roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Pitch Type: Cutter) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter('Pitch Type:', 'Cutter', true);

        teamPage.getRosterTableStat(1,1).then(function(player) {
          assert.equal(player, 'Bobby Wilson');
        });

        teamPage.getRosterTableStat(1,7).then(function(slaa) {
          assert.equal(slaa, 0.65, 'Bobby Wilson SLAA');
        });          
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Pitch Type:');
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      teamPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 4-6');
      });      

      teamPage.getGameLogTableStat(1,8).then(function(slaa) {
        assert.equal(slaa, -6.41, 'row 1 SLAA column');
      });            
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Vs Team: LA Angels) from sidebar displays correct data', function() {
        filters.addSelectionToDropdownSidebarFilter("Vs Team:", "LA Angels", true);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '9/21/2016');
        });

        teamPage.getGameLogTableStat(1,6).then(function(bf) {
          assert.equal(bf, 38, 'row 1 batters faced');
        });          

        teamPage.getGameLogTableStat(1,10).then(function(frmRaa) {
          assert.equal(frmRaa, -0.07, 'row 1 FrmRAA');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter('Vs Team:');
      });
    });
  });     

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      teamPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Exit Direction: 0-30)', function() {
      test.before(function() {
        pitchLogPage.clickByInningTab();
        filters.changeValuesForRangeSidebarFilter('Exit Direction:', 0, 30);
      });
      
      test.it('should show the correct at bat header text', function() {
        pitchLogPage.getByInningAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "LHP M. Perez Vs LHB C. Dickerson (TB), Top 3, 0 Out");
        });
      });

      test.it('should show the correct row data', function() {
        pitchLogPage.getByInningTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        pitchLogPage.getByInningTableStat(1,6).then(function(probSL) {
          assert.equal(probSL, '88.4%');
        });
      });

      test.it('when clicking flat view tab it should show the correct stats', function() {
        pitchLogPage.clickFlatViewTab();
        pitchLogPage.getFlatViewTableStat(1,2).then(function(num) {
          assert.equal(num, 5, 'row 1 Num pithes');
        });

        pitchLogPage.getFlatViewTableStat(1,3).then(function(count) {
          assert.equal(count, '0-2', 'row 1 count');
        });
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Exit Direction:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      teamPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      teamPage.changeMainConstraint("Streaks Of", "At Least", 1, "CS (Catching)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText(1).then(function(text) {
        assert.equal(text, "3 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 1);
      });
    });
  });
});