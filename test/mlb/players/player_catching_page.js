var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var PlayerPage = require('../../../pages/mlb/players/player_page.js');

var navbar, filters, statsPage, playerPage;

test.describe('#Player Catching Section', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters  = new Filters(driver);  
    playerPage = new PlayerPage(driver);

    navbar.search('Yadier Molina', 1);
  });  

  test.it('should be on Yadier Molina 2016 player page', function() {
    playerPage.goToSection('catching');
    playerPage.getPlayerName().then(function(text) {
      assert.equal( text, 'Yadier Molina');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.before(function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should have the correct data in the main table', function() {
      playerPage.getOverviewTableStat(1,7).then(function(slaa) {
        assert.equal(slaa, 231.42, '2008 season SLAA');
      });        
    });

    test.describe('#heatMap', function() {
      test.it('drawing box on left heatmap should update the table', function() {
        playerPage.drawBoxOnCatcherHeatMap('lefty', 150,200,75,40);  
        playerPage.getOverviewTableStat(1,7).then(function(slaa) {
          assert.equal(slaa, 53.75, '2008 season SLAA');
        });        
      });
      
      test.after(function() {
        playerPage.clearCatcherHeatMap('lefty');
      });
    });

    test.describe('#pitchView', function() {
      test.it('clicking pitch view link should show the pitch view image', function() {
        playerPage.clickCatcherPitchViewLink('righty');
        
        playerPage.getCatcherPitchViewPitchCount('righty').then(function(pitchCount) {
          assert.equal(pitchCount, 500, 'righty pitch view pitch count');
        });        
      });
      
      test.after(function() {
        playerPage.clickCatcherHeatMapLink('righty');
      });
    });

    test.describe('#visual mode', function() {
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
          { type: 'Strike Rate', title: 'Strike%' }, // selecting wrong option, need to change dropdown so it selects based off of text  
          { type: 'Ball Rate', title: 'Ball%' },  
          { type: 'Swing Rate', title: 'Swing%' },  
          { type: 'Contact Rate', title: 'Contact%' },  
          { type: 'Miss Rate', title: 'Miss%' },  
          { type: 'In Play Rate', title: 'InPlay%' },  
          { type: 'Foul Rate', title: 'Foul%' }  
        ];

        visualModes.forEach(function(visualMode) {
          test.it("selecting " + visualMode.type + " shows the correct title ", function() {
            playerPage.changeVisualMode(visualMode.type);
            playerPage.getCatcherHeatMapImageTitle('lefty').then(function(title) {
              assert.equal(title, visualMode.title, 'lefty visual title');
            });
            playerPage.getCatcherHeatMapImageTitle('righty').then(function(title) {
              assert.equal(title, visualMode.title, 'righty visual title');
            });            
          });
        });        
      });      
    });     

    // eBIS Modal
    test.describe("#eBIS Modal", function() {
      test.it('modal shows the correct data', function() {
        playerPage.clickEbisModalBtn();
        playerPage.getEbisModalText(1, 3).then(function(data) {
          assert.equal(data, 'Draft: 2000 Round 4, Pick 113, STL', 'Yadier Molina draft information');
        });
      });

      test.after(function() {
        playerPage.clickCloseEbisModalBtn();
      })
    })

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickOverviewTableStat(5,12);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs RHB R. Zimmerman (WSH), Top 1, 1 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(1);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 1 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Two Seamer 92.1 MPH ,98.1% ProbSL - Ball");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });    

    test.describe('#filters', function() {
      test.it('adding filter: (Pitch Type: Breaking Ball (curve/slider)) from sidebar displays correct data', function() {
        filters.toggleSidebarFilter("Pitch Type:", 'Breaking Ball (curve/slider)', true);

        playerPage.getOverviewTableStat(1,7).then(function(slaa) {
          assert.equal(slaa, '43.09', '2008 Season SLAA');
        });

        playerPage.getOverviewTableStat(1,8).then(function(slPlus) {
          assert.equal(slPlus, 106.4, '2008 season SL+');
        });                            
      });

      test.after(function() {
        filters.toggleSidebarFilter("Pitch Type:", 'Breaking Ball (curve/slider)', false);
      });     
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Catcher Defense', topStat: 0.42, statType: "FldRAA" },  
        { type: 'Catcher Opposing Batters', topStat: 37, statType: "HBP" },  
        { type: 'Catcher Pitch Rates', topStat: '18.5%', statType: "Miss%" },  
        { type: 'Catcher Pitch Counts', topStat: 2339, statType: "Chase#" },  
        { type: 'Pitching Counting', topStat: 113, statType: "HR" },  
        { type: 'Catcher Pitch Types', topStat: '18.7%', statType: "Slider%" },  
        { type: 'Catcher Pitch Type Rates', topStat: 2961, statType: "Slider#" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          playerPage.changeReport(report.type);  
          playerPage.getOverviewTableStat(1, 10).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });     

      test.after(function() {
        playerPage.changeReport('Catcher Framing');
      });
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      playerPage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      playerPage.getGameLogTableStat(1,4).then(function(date) {
        assert.equal(date, '10/2/2016', '1st row game date');
      });

      playerPage.getGameLogTableStat(1,5).then(function(score) {
        assert.equal(score, 'W 10-4', '10/2/2016 - Score of game');
      });      

      playerPage.getGameLogTableStat(1,11).then(function(frmRaa) {
        assert.equal(frmRaa, -0.10, '10/2/2016 - FrmRAA');
      });            
      
      playerPage.getGameLogTableStat(1,12).then(function(frmCntRaa) {
        assert.equal(frmCntRaa, 0.19, '10/2/2016 - FrmCntRAA');
      });                  
    });

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        playerPage.clickGameLogTableStat(1,7);
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'Vs LHB J. Jaso (PIT), Top 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        playerPage.clickPitchVideoIcon(2);
        playerPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });

        playerPage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Fastball 92.1997 MPH ,88.7% ProbSL - Ground Out");
        });          
      }); 

      test.after(function() {
        playerPage.closeVideoPlaylistModal();
        playerPage.closePlayByPlaytModal();
      });
    });    

    test.describe("#filters", function() {
      test.it('adding filter: (Pitcher Pitch #: 60-150) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Situation')
        filters.changeValuesForRangeSidebarFilter("Pitcher Pitch #:", 60, 150);

        playerPage.getGameLogTableStat(1,8).then(function(pitches) {
          assert.equal(pitches, 41, '10/2/2016 pitches');
        });

        playerPage.getGameLogTableStat(1,9).then(function(slaa) {
          assert.equal(slaa, -1.50, '10/2/2016 slaa');
        });
      });

      test.after(function() {
        filters.closeDropdownFilter("Pitcher Pitch #:");
      });
    });
  });  

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      playerPage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (PX: 2 - 3)', function() {
      test.before(function() {
        filters.changeFilterGroupDropdown('Pitch')
        filters.changeValuesForRangeSidebarFilter('PX:', 2, 3);
      });
      
      test.it('should show the correct at bat header text', function() {
        playerPage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "Vs LHB J. Bell (PIT), Top 5, 2 Out");
        });
      });

      test.it('should show the correct row data', function() {
        playerPage.getMatchupsPitchText(1,6).then(function(probSl) {
          assert.equal(probSl, '0.0%', 'row 1 ProbSL');
        });
        playerPage.getMatchupsPitchText(1,7).then(function(result) {
          assert.equal(result, 'Ball', 'row 1 Result');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        playerPage.clickFlatViewTab();
        playerPage.getFlatViewPitchText(1,5).then(function(vel) {
          assert.equal(vel, 76, 'row 1 velocity');
        });

        playerPage.getFlatViewPitchText(1,7).then(function(result) {
          assert.equal(result, 'Ball in the Dirt', 'row 1 result');
        });
      });
    })

    test.after(function() {
      filters.closeDropdownFilter('PX:');
    });
  });

  // Occurences & Streaks
  test.describe('#SubSection: Occurrences & Streaks', function() {
    test.before(function() {
      playerPage.goToSubSection("occurrencesAndStreaks");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('changing the main constraint should show the correct section header', function() {
      playerPage.changeMainConstraint("Occurrences Of", "At Least", 2, "CS (Catching)", "In a Game", "Within a Season");
      playerPage.getStreaksSectionHeaderText().then(function(text) {
        assert.equal(text, "1 Times", '# of occurences');
      });

      playerPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.equal(stat, 2, 'CS on 4/3/2016');
      });
    });
  });
});