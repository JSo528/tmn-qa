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

test.describe('#Team Batting Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    teamsPage = new TeamsPage(driver);
    statsPage = new StatsPage(driver);
    teamPage = new TeamPage(driver);
    overviewPage = new OverviewPage(driver);
    rosterPage = new RosterPage(driver, 'batting');
    pitchLogPage = new PitchLogPage(driver, 'batting');

    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    statsPage.clickTeamTableCell(1,3); // should click into BOS team link
  });  

  test.it('should be on BOS 2016 team page', function() {
    teamPage.getTeamName().then(function(text) {
      assert.equal( text, 'Boston Red Sox');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    // Heat Map & Hit Charts
    test.describe("#Heat Maps & Hit Charts", function() {
      test.before(function() {
        teamPage.changeReport("Counting");
      });

      test.it('has the correct number of plot points (hits) initially', function() {
        overviewPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1651);
        });
      });

      test.it('selecting a heat map rectangle updates the hit chart', function() {
        overviewPage.drawBoxOnHeatMap(150,150,25,25);

        overviewPage.getHitChartHitCount('single').then(function(count) {
          assert.equal(count, 10, 'correct number of singles');
        });
        
        overviewPage.getHitChartHitCount('double').then(function(count) {
          assert.equal(count, 6, 'correct number of doubles');
        });        

        overviewPage.getHitChartHitCount('triple').then(function(count) {
          assert.equal(count, 2, 'correct number of triples');
        });        

        overviewPage.getHitChartHitCount('homeRun').then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });      

      test.it('selecting a heat map rectangle updates the data table', function() {
        overviewPage.getTeamTableStat(12).then(function(count) {
          assert.equal(count, 6, 'correct number of doubles');
        });        

        overviewPage.getTeamTableStat(13).then(function(count) {
          assert.equal(count, 2, 'correct number of triples');
        });        

        overviewPage.getTeamTableStat(14).then(function(count) {
          assert.equal(count, 4, 'correct number of home runs');
        });        
      });            

      test.it('clicking a hit chart hit shows pitches on the heat map', function() {
        overviewPage.clickHitChartPoint(1);
        overviewPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 4);
        });
      });

      test.it('clicking a hit chart hit shows pitches on the team grid', function() {
        overviewPage.getHeatMapPitchCount().then(function(pitches) {
          assert.equal(pitches, 4);
        });
      });  

      test.it('pitch view shows 500 pitchs', function() {
        overviewPage.clickPitchViewLink();
        overviewPage.getPitchViewPitchCount().then(function(pitches) {
          assert.equal(pitches, 500);
        });
      });    

      test.it('clearing the heat maps resets the hit chart', function() {
        overviewPage.clickHeatMapLink();
        overviewPage.clearHeatMap();
        overviewPage.getHitChartHitCount().then(function(hitCount) {
          assert.equal(hitCount, 1651);
        });
      });                 

      test.it('clearing the heat maps resets the data table', function() {
        overviewPage.getTeamTableStat(11).then(function(hitCount) {
          assert.equal(hitCount, 1598, 'correct number of hits');
        });        
      }); 
    });

    // Visual Mode Dropdown
    test.describe("#visual modes", function() {
      var visualModes = [
        { type: 'SLG', title: 'SLG' },  
        { type: 'ISO', title: 'ISO' },  
        { type: 'wOBA', title: 'wOBA' },  
        { type: 'Expected BA', title: 'ExAVG' },  
        { type: 'Expected SLG', title: 'ExSLG' },  
        { type: 'Expected ISO', title: 'ExISO' },  
        { type: 'Expected wOBA', title: 'ExWOBA' },  
        { type: 'In Play BA', title: 'BA' },  
        { type: 'In Play SLG', title: 'SLG' },  
        { type: 'In Play ISO', title: 'ISO' },  
        { type: 'Line Drive Rate', title: 'Line%' },  
        { type: 'Groundball Rate', title: 'Ground%' },  
        { type: 'Flyball Rate', title: 'Fly%' },  
        { type: 'Flyball Distance', title: 'FBDst' },  
        { type: 'Exit Velocity', title: 'ExitVel' },  
        { type: 'Forward Velocity', title: 'ForwVel' },  
        { type: 'Efficient Velocity', title: 'EffVel' },  
        // { type: 'Pitch Frequency', title: 'Pitch Frequency' }, // looks like this doesn't follow the pattern of the others
        // { type: 'Release Velocity', title: 'Release Velocity' },  // TODO - looks like its broken
        { type: 'Called Strike Rate', title: 'CallStrk%' },  
        { type: 'Strike Looking Above Average', title: 'SLAA' },  
        { type: 'Correct Call Rate', title: 'CC%' },  
        // { type: 'Strike Rate', title: 'Strike%' }, // selecting wrong option, need to change dropdown so it selects based off of text  
        // { type: 'Ball Rate', title: 'Ball%' },  
        { type: 'Swing Rate', title: 'Swing%' },  
        { type: 'Contact Rate', title: 'Contact%' },  
        { type: 'Miss Rate', title: 'Miss%' },  
        { type: 'In Play Rate', title: 'InPlay%' },  
        { type: 'Foul Rate', title: 'Foul%' }  
      ];

      visualModes.forEach(function(visualMode) {
        test.it("selecting " + visualMode.type + " shows the correct title ", function() {
          overviewPage.changeVisualMode(visualMode.type);
          overviewPage.getHeatMapImageTitle().then(function(title) {
            assert.equal(title, visualMode.title);
          });
        });
      });        
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Counting', topStat: 1598, statType: "H" },  
        { type: 'Pitch Rates', topStat: "38.7%", statType: "Foul%" },  
        { type: 'Pitch Count', topStat: 12617, statType: "InZone#" },  
        { type: 'Pitch Types', topStat: "2.9%", statType: "Sinker%" },  
        { type: 'Pitch Type Counts', topStat: 725, statType: "Sinker#" },  
        { type: 'Pitch Locations', topStat: "60.2%", statType: "LowHalf%" },  
        { type: 'Pitch Calls', topStat: 231, statType: "BallFrmd" },  
        { type: 'Hit Types', topStat: 2060, statType: "Ground#" },  
        { type: 'Hit Locations', topStat: "22.3%", statType: "HLftCtr%" },  
        { type: 'Home Runs', topStat: 153, statType: "HRPull" },  
        { type: 'Exit Data', topStat: 0.031, statType: "ExSLGDf" },  
        
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          overviewPage.getTeamTableStat(11).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });

  // Roster Section
  test.describe("#Subsection: Roster", function() {
    test.before(function() {
      teamPage.goToSubSection("Roster");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe("#filters", function() {
      test.it('adding filter: (opponent starter: Corey Kluber) from dropdown displays correct data', function() {
        filters.changeFilterGroupDropdown("Game Participation");
        filters.addSelectionToDropdownSidebarFilter('Opponent Starter:', 'Corey Kluber');

        rosterPage.getTableStat(1,1).then(function(player) {
          assert.equal(player, 'Mookie Betts');
        });

        rosterPage.getTableStat(1,8).then(function(battingAVG) {
          assert.equal(battingAVG, 0.444);
        });          
      });
    });

    test.after(function() {
      filters.closeDropdownFilter('Opponent Starter:');
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      teamPage.goToSubSection("Game Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      teamPage.getGameLogTableStat(1,3).then(function(date) {
        assert.equal(date, '10/2/2016');
      });

      teamPage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, 'L 1-2');
      });      

      teamPage.getGameLogTableStat(1,10).then(function(obp) {
        assert.equal(obp, 0.235);
      });            
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Spin Angle: 0 - 180) from dropdown displays correct data', function() {
        filters.changeFilterGroupDropdown("Pitch");
        filters.changeValuesForRangeSidebarFilter("Spin Angle:", 0, 180);

        teamPage.getGameLogTableStat(1,3).then(function(date) {
          assert.equal(date, '10/2/2016');
        });

        teamPage.getGameLogTableStat(1,6).then(function(pitches) {
          assert.equal(pitches, 29);
        });          

        teamPage.getGameLogTableStat(1,9).then(function(ba) {
          assert.equal(ba, 0.167);
        });                  
      });
    });
  });  

  // Splits Section
  test.describe("#Subsection: Splits", function() {
    test.before(function() {
      teamPage.goToSubSection("Splits");
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

      teamPage.getSplitsTableStat(1,3).then(function(wins) {
        assert.equal(wins, 93, 'row 1 should have 93 wins');
      });             

      teamPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'In Play', 'row 2 title should be labled "In Play"');
      });                   

      teamPage.getSplitsTableStat(2,7).then(function(pitches) {
        assert.equal(pitches, 4558, 'row 2 should have 4558 pitches');
      });                         

      teamPage.getSplitsTableStat(3,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 3 title should be labled "Home"');
      });                   

      teamPage.getSplitsTableStat(3,2).then(function(games) {
        assert.equal(games, 81, 'row 3 should have 81 games');
      });                               

      teamPage.getSplitsTableStat(4,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Away', 'row 4 title should be labled "Away"');
      });                   

      teamPage.getSplitsTableStat(4,11).then(function(slg) {
        assert.equal(slg, 0.430, 'row 4 should have .430 slg');
      });                                     
    });

    test.it('should show the correct data in the lhp/rhp subsection', function() {
      teamPage.getSplitsTableStat(6,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs LHP', 'row 1 title should be labled "vs LHP"');
      });             

      teamPage.getSplitsTableStat(6,8).then(function(ab) {
        assert.equal(ab, 1347, 'row 1 should have 1347 ab');
      });             

      teamPage.getSplitsTableStat(7,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'vs RHP', 'row 2 title should be labled "vs RHP"');
      });                   

      teamPage.getSplitsTableStat(7,9).then(function(ba) {
        assert.equal(ba, 0.283, 'row 2 should have 0.283 ba');
      });  
    });                          
  });      

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      teamPage.goToSubSection("Pitch Log");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Pitch Result: Strike Looking)', function() {
      test.before(function() {
        pitchLogPage.clickByInningTab();
        filters.changeFilterGroupDropdown('Pitch');
        filters.addSelectionToDropdownSidebarFilter('Pitch Result:', 'Strike Looking');
      });
      
      test.it('should show the correct at bat header text', function() {
        pitchLogPage.getByInningAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "RHB D. Pedroia Vs RHP A. Sanchez (TOR), Bot 1, 0 Out");
        });
      });

      test.it('should show the correct row data', function() {
        pitchLogPage.getByInningTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, 'Fastball');
        });
        pitchLogPage.getByInningTableStat(1,6).then(function(pitch) {
          assert.equal(pitch, 'Strike Looking');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        pitchLogPage.clickFlatViewTab();
        pitchLogPage.getFlatViewTableStat(1,2).then(function(num) {
          assert.equal(num, '1', 'row 1 Num col equals 1');
        });

        pitchLogPage.getFlatViewTableStat(1,3).then(function(count) {
          assert.equal(count, '0-0', 'row 1 count is 0-0');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('Pitch Result:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      teamPage.goToSubSection("Occurrences & Streaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      teamPage.changeMainConstraint("Occurrences Of", "At Most", 3, "K (Batting)", "In a Game", "Within a Season");
      teamPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "11 Times");
      });

      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 2);
      });
    });
  });

  // Multi-Filter
  test.describe('#SubSection: Multi-Filter', function() {
    test.before(function() {
      teamPage.goToSubSection("Multi-Filter");
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

      teamPage.getMultiFilterStat(1,8).then(function(ab) {
        assert.equal(ab, 5670, 'top AB equals 5670');
      });
    });

      // doing a notEqual because drawing the same box doesnt always lead to the exact same stats
      test.it('drawing a box on the heat map should update the stats table for both sections', function() {
      var originalAB;
      teamPage.getMultiFilterStat(1, 8).then(function(ab) {
        originalAB = ab;
      });

      teamPage.drawBoxOnHeatMap('top', 160,120,25,25);

      teamPage.getMultiFilterStat(1, 8).then(function(ab) {
        assert.notEqual(ab, originalAB, 'correct number of at bats for top row');
      });        

      teamPage.getMultiFilterStat(2, 8).then(function(ab) {
        assert.notEqual(ab, originalAB, 'correct number of at bats for bottom row');
      });        
    });

    // doing less than because of the same reason as above
    test.it('drawing a box on the heat map should update the hit chart for both sections', function() {
      teamPage.getHitChartHitCount('top').then(function(count) {
        assert.isAtMost(count, 60, 'correct number of hits for top hitChart');
      });      

      teamPage.getHitChartHitCount('bottom').then(function(count) {
        assert.isAtMost(count, 60, 'correct number of hits for bottom hitChart');
      });            
    }); 

   

    test.it('when sync is turned on, both heat maps should update ', function() {
      teamPage.changeVisualMode('top', 'ISO');

      teamPage.getHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'ISO', "top heat map has title 'ISO'");
      });

      teamPage.getHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'ISO', "bottom heat map has title 'ISO'");
      });
    });

    test.it('when sync is turned off, changing the top should not change the bottom', function() {
      teamPage.changeVisualMode('bottom', 'BA');
      teamPage.changeVisualMode('top', 'SLG');

      teamPage.getHeatMapImageTitle('top').then(function(title) {
        assert.equal(title, 'SLG', "top heat map has title 'SLG'");
      });

      teamPage.getHeatMapImageTitle('bottom').then(function(title) {
        assert.equal(title, 'BA', "bottom heat map has title 'BA'");
      });     
    });
  });

  // Comps
  test.describe('#SubSection: Comps', function() {
    test.before(function() {
      teamPage.goToSubSection("Comps");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('selecting Mookie Betts on comp 2 search should add him to table', function() {
      teamPage.selectForCompSearch(2, 'Mookie Betts');
      teamPage.getCompTableStat(1,1).then(function(playerName) {
        assert.equal(playerName, 'Mookie Betts');
      });

      teamPage.getCompTableStat(1,2).then(function(games) {
        assert.equal(games, 158);
      });
    });
  });

  // Matchups
  test.describe('#SubSection: Matchups', function() {
    test.before(function() {
      teamPage.goToSubSection("Matchups");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data in the table', function() {
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'RHB D. Pedroia Vs RHP A. Sanchez (TOR), Bot 1, 0 Out', 'header for 1st at bat');
      });
    }); 

    test.it('selecting Chris Archer on comp 2 search should update the pitch log', function() {
      teamPage.selectForCompSearch(2, 'Chris Archer');
      teamPage.getMatchupsAtBatHeaderText(1).then(function(sectionHeaderText) {
        assert.equal(sectionHeaderText, 'RHB D. Pedroia Vs RHP C. Archer (TB), Top 1, 0 Out');
      });
    });

    test.it('clicking pitch video icon selects the correct video', function() {
      teamPage.clickPitchVideoIcon(1);
      teamPage.getMatchupsCurrentVideoHeader().then(function(text) {
        assert.equal(text, '9/23/2016, 7:10 PM ET BOS 2 @ TB 1 - RHB D. Pedroia Vs RHP C. Archer (TB), Top 1, 0 out', 'video playlist header');
      });
    });  

    test.it('video playlist displays correct side information', function() {
      teamPage.getMatchupsVideoText(2,1).then(function(text) {
        assert.equal(text, 'Top 1, 0 Out', '2nd video, top line');
      });

      teamPage.getMatchupsVideoText(2,2).then(function(text) {
        assert.equal(text, 'RHB D. Pedroia Vs RHP C. Archer (TB)', '2nd video, 2nd line');
      });      
    });  
  });  

  // Vs. Teams
  test.describe("#Subsection: Vs Teams", function() {
    test.before(function() {
      teamPage.goToSubSection("Vs Teams");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(1,5).then(function(winPer) {
        assert.equal(winPer, 0.833, 'win% against Oak should be .833');
      });                                   
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Date Range: 2016 First Half) displays correct data', function() {
        filters.changeDropdownForDateSidebarFilter("Date Range:", "2016 First Half");

        teamPage.getVsTableStat(2,9).then(function(winPer) {
          assert.equal(winPer, 0.367, 'BA against LAA should be .367');
        });                                   
      });

      test.after(function() {
        filters.closeDropdownFilter("Date Range:");
      });
    });                 
  });   

  // Vs. Pitchers
  test.describe("#Subsection: Vs Pitchers", function() {
    test.before(function() {
      teamPage.goToSubSection("Vs Pitchers");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct data', function() {
      teamPage.getVsTableStat(2,2).then(function(pitcher) {
        assert.equal(pitcher, 'Wade Miley', '2nd row pitcher should be Wade Miley');
      });         

      teamPage.getVsTableStat(2,13).then(function(ops) {
        assert.equal(ops, 1.650, '2nd row ops should be 1.650');
      });                                           
    });

    test.describe("#filters", function() {
      test.it('adding filter: (Contact: Hard) displays correct data', function() {
        filters.changeFilterGroupDropdown("PA");
        filters.addSelectionToDropdownSidebarFilter("Contact:", "Hard");

        teamPage.getVsTableStat(5,2).then(function(pitcher) {
          assert.equal(pitcher, 'Collin McHugh', '5th row pitcher should be Collin McHugh');
        });                                   

        teamPage.getVsTableStat(5,12).then(function(slg) {
          assert.equal(slg, 1.714, '5th row slg should be 1.714');
        });                                           
      });
    });                 
  });     
});