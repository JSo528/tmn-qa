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
var RosterPage = require('../../pages/mlb/team/roster_page.js');
var PitchLogPage = require('../../pages/mlb/team/pitch_log_page.js');

var navbar, filters, teamsPage, statsPage, teamPage, overviewPage, rosterPage, pitchLogPage;

test.describe('#Team Pitching Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    statsPage = new StatsPage(driver);
    teamPage = new TeamPage(driver);
    overviewPage = new OverviewPage(driver);
    rosterPage = new RosterPage(driver, 'pitching');
    pitchLogPage = new PitchLogPage(driver, 'pitching');

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    filters.removeSelectionFromDropdownFilter("Season Level:");
    filters.addSelectionToDropdownFilter("Season Level:", 'AAA');
    statsPage.clickTeamTableCell(1,3); // should click into AAA - El Paso Chihuahua's team link
    teamPage.goToSection("pitching");
  });  

  test.it('should be on AAA - El Paso Chihuahuas 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'El Paso Chihuahuas (SD)');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.it('has the correct number of plot points (hits) initially', function() {
        overviewPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1515);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        overviewPage.drawBoxOnHeatMap(150,150,25,25);

        overviewPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 16, 'correct number of singles');
        });
        
        overviewPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 4, 'correct number of doubles');
        });        

        overviewPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 0, 'correct number of triples');
        });        

        overviewPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        overviewPage.getTeamTableStat(12).then(function(count) {
          assert.equal(count, 24, 'correct number of hits');
        });        
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        overviewPage.clickHitChartPoint(1);
        overviewPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 1);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        overviewPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 1);
        });
      });     

      test.it('clearing the heat maps resets the hit chart', function() {
        overviewPage.clearHeatMap();
        overviewPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1515);
        });
      });                 

      test.it('clearing the heat maps resets the data table', function() {
        overviewPage.getTeamTableStat(12).then(function(hitCount) {
          assert.equal(hitCount, 1450, 'correct number of hits');
        });        
      }); 
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Rate', topStat: 0.293, statType: "BA" },  
        { type: 'Counting', topStat: 1450, statType: "H" },  
        { type: 'Pitch Rates', topStat: "78.0%", statType: "Contact%" },  
        { type: 'Pitch Count', topStat: 13145, statType: "Strike#" },  
        { type: 'Pitch Types', topStat: '5.7%', statType: "Curve%" },  
        { type: 'Pitch Type Counts', topStat: 1011, statType: "Curve#" },  
        { type: 'Pitch Locations', topStat: "31.5%", statType: "VMid%" },  
        { type: 'Pitch Calls', topStat: "103.8%", statType: "SL+" },  
        { type: 'Hit Types', topStat: "20.2%", statType: "Line%" },  
        { type: 'Hit Locations', topStat: "38.3%", statType: "HPull%" },  
        { type: 'Home Runs', topStat: 394.2, statType: "HRDst" },  
        { type: 'Movement', topStat: 100.0, statType: "MxVel" },  
        { type: 'Bids', topStat: 0, statType: "NH7+" },  
        { type: 'Baserunning', topStat: 94, statType: "SB", colNum: 5 },  
        { type: 'Exit Data', topStat: 0.446, statType: "SLG" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          var col = report.colNum || 8;
          overviewPage.getTeamTableStat(col).then(function(stat) {
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
      test.it('adding filter: (Batter Hand: Lefty) from dropdown displays correct data', function() {
        filters.toggleSidebarFilter('Batter Hand:', 'Lefty', true);

        rosterPage.getTableStat(1,1).then(function(player) {
          assert.equal(player, 'Jeremy Guthrie');
        });

        rosterPage.getTableStat(1,13).then(function(hits) {
          assert.equal(hits, 34, 'Jeremey Guthrie alowed 34 hits');
        });          
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Batter Hand:');
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      teamPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 9/5/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '9/5/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 2-4');
      });      

      teamPage.getGameLogTableStat(1,19).then(function(bb) {
        assert.equal(bb, 1, 'row 1 bb column');
      });            
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Batted Ball: Ground Ball) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Batted Ball:", "Ground Ball", true);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '9/5/2016');
        });

        teamPage.getGameLogTableStat(1,5).then(function(pitches) {
          assert.equal(pitches, 9);
        });          

        teamPage.getGameLogTableStat(1,14).then(function(hits) {
          assert.equal(hits, 1, 'row 1 hits column');
        });                  
      });

      test.after(function() {
        filters.closeDropdownFilter('Batted Ball:');
      });
    });
  });  

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.before(function() {
      teamPage.goToSubSection("splits");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct section titles', function() {
      teamPage.getSplitsTableHeaderText(1).then(function(title) {
        assert.equal(title, 'Totals');
      });

      teamPage.getSplitsTableHeaderText(2).then(function(title) {
        assert.equal(title, 'LHP/RHP');
      });

      teamPage.getSplitsTableHeaderText(3).then(function(title) {
        assert.equal(title, 'Seasons');
      });

      teamPage.getSplitsTableHeaderText(4).then(function(title) {
        assert.equal(title, 'Months');
      });
      
      teamPage.getSplitsTableHeaderText(5).then(function(title) {
        assert.equal(title, 'Pitch Type');
      });

      teamPage.getSplitsTableHeaderText(6).then(function(title) {
        assert.equal(title, 'Batted Ball Types');
      });             
    });

    test.it('should show the correct data in the totals subsection', function() {
      teamPage.getSplitsTableStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Totals', 'row 1 title should be labled "Totals"');
      });             

      teamPage.getSplitsTableStat(1,2).then(function(pitches) {
        assert.equal(pitches, 20866, 'row 1 should have 20866 pitches');
      });             

      teamPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'In Play', 'row 2 title should be labled "In Play"');
      });                   

      teamPage.getSplitsTableStat(2,11).then(function(hits) {
        assert.equal(hits, 1450, 'row 2 should have 1450 hits');
      });                         

      teamPage.getSplitsTableStat(3,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 3 title should be labled "Home"');
      });                   

      teamPage.getSplitsTableStat(3,10).then(function(ip) {
        assert.equal(ip, 660.0, 'row 3 should have 660.0 ip');
      });                               

      teamPage.getSplitsTableStat(4,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Away', 'row 4 title should be labled "Away"');
      });                   

      teamPage.getSplitsTableStat(4,12).then(function(er) {
        assert.equal(er, 316, 'row 4 should have 316 er');
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

    test.describe('when selecting filter (Pitch Result: In Play)', function() {
      test.before(function() {
        pitchLogPage.clickByInningTab();
        filters.changeFilterGroupDropdown('Pitch');
        filters.addSelectionToDropdownSidebarFilter('Pitch Result:', 'In Play');
      });
      
      test.it('should show the correct at bat header text', function() {
        pitchLogPage.getByInningAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "RHP C. Pimentel Vs RHB C. Nelson (ALB), Top 1, 1 Out");
        });
      });

      test.it('should show the correct row data', function() {
        pitchLogPage.getByInningTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        pitchLogPage.getByInningTableStat(1,6).then(function(pitch) {
          assert.equal(pitch, 'Fly Out');
        });
      });

      test.it('when clicking flat view tab it should show the correct stats', function() {
        pitchLogPage.clickFlatViewTab();
        pitchLogPage.getFlatViewTableStat(1,2).then(function(num) {
          assert.equal(num, '3', 'row 1 Num col equals 3');
        });

        pitchLogPage.getFlatViewTableStat(1,3).then(function(count) {
          assert.equal(count, '1-1', 'row 1 count is 1-1');
        });
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Pitch Result:');
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
      teamPage.changeMainConstraint("Occurrences Of", "At Least", 10, "K (Pitching)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "29 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 10);
      });
    });
  });

  // Multi-Filter
  test.describe('#SubSection: Multi-Filter', function() {
    test.before(function() {
      teamPage.goToSubSection("multiFilter");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data initially', function() {
      teamPage.getMultiFilterStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'top');
      });

      teamPage.getMultiFilterStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'bottom');
      });      

      teamPage.getMultiFilterStat(1,2).then(function(pitches) {
        assert.equal(pitches, 20866, 'top pitches equals 20866');
      });
    });

    



    // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
    test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalHits;
      teamPage.getMultiFilterStat(1, 11).then(function(hits) {
        originalHits = hits;
      });

      teamPage.drawBoxOnHeatMap('top', 160,120,25,25);

      teamPage.getMultiFilterStat(1, 11).then(function(hits) {
        assert.notEqual(hits, originalHits, 'correct number of hits for top row');
      });        

      teamPage.getMultiFilterStat(2,1).then(function(hits) {
        assert.notEqual(hits, originalHits, 'correct number of hits for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      teamPage.getHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 72, 'correct number of hits for top hitChart');
      });      

      teamPage.getHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 72, 'correct number of hits for bottom hitChart');
      });            
    }); 
  });

  // Comps
  test.describe('#SubSection: Comps', function() {
    test.before(function() {
      teamPage.goToSubSection("comps");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('selecting Matt Strahm on comp 2 search should add him to table', function() {
      teamPage.selectForCompSearch(2, 'Matt Strahm');
      teamPage.getCompTableStat(1,1).then(function(playerName) {
        assert.equal(playerName, 'Matt Strahm');
      });

      teamPage.getCompTableStat(1,2).then(function(games) {
        assert.equal(games, 2066);
      });
    });
  });

  // Matchups
  test.describe('#SubSection: Matchups', function() {
    test.before(function() {
      teamPage.goToSubSection("matchups");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data in the table', function() {
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'RHP C. Pimentel Vs LHB M. Tauchman (ALB), Top 1, 0 Out', 'header for 1st at bat');
      });
    }); 

    test.it('selecting Yasiel Puig on comp 2 search should update the pitch log', function() {
      teamPage.selectForCompSearch(2, 'Yasiel Puig');
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'LHP F. Garces Vs RHB Y. Puig (OKC), Bot 1, 1 Out', '1st pitch log');
      });
    });   
  });  

  // Vs. Teams
  test.describe("#Subsection: Vs Teams", function() {
    test.before(function() {
      teamPage.goToSubSection("vsTeams");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(1,2).then(function(pitches) {
        assert.equal(pitches, 512, 'pitches against Omaha');
      });                                   
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Date Range: 2016 Second Half) displays correct data', function() {
        filters.changeDropdownForDateSidebarFilter("Date Range:", "2016 Second Half");

        teamPage.getVsTableStat(2,12).then(function(er) {
          assert.equal(er, 13, 'ER against Fresno');
        });                                   
      });

      test.after(function() {
        filters.closeDropdownFilter("Date Range:");
      });
    });                 
  });   

  // Vs. Hitters
  test.describe("#Subsection: Vs Hitters", function() {
    test.before(function() {
      teamPage.goToSubSection("vsHitters");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(1,2).then(function(pitcher) {
        assert.equal(pitcher, 'Evan Marzilli', 'hitter on 1st row');
      });         

      teamPage.getVsTableStat(1,12).then(function(hits) {
        assert.equal(hits, 7, 'hits against Evan Marzilli');
      });                                           
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Men On: RISP) displays correct data', function() {
        filters.toggleSidebarFilter("Men On:", "RISP", true);

        teamPage.getVsTableStat(4,2).then(function(pitcher) {
          assert.equal(pitcher, 'Evan Marzilli', 'hitter on 4th row');
        });                                   

        teamPage.getVsTableStat(4,18).then(function(strikeouts) {
          assert.equal(strikeouts, 1, 'strikeouts against Evan Marzilli');
        });                                           
      });
    });                 
  });     
});