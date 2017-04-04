var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/mlb/navbar.js');
var Filters = require('../../../pages/mlb/filters.js');
var UmpiresPage = require('../../../pages/mlb/umpires/umpires_page.js');
var UmpirePage = require('../../../pages/mlb/umpires/umpire_page.js');

var umpiresPage, umpirePage, filters, navbar;

test.describe('#Umpire Page', function() {
  test.before(function() {
    umpiresPage = new UmpiresPage(driver);
    umpirePage = new UmpirePage(driver);
    filters  = new Filters(driver);
    navbar  = new Navbar(driver);

    navbar.goToUmpiresPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
    umpiresPage.goToUmpirePage(1); // should click into Joe West link
  });

  test.it('should be on Joe West 2016 team page', function() {
    umpirePage.getUmpireName().then(function(text) {
      assert.equal( text, 'Joe West');
    });
  });

  // Overview Section
  test.describe("#Subsection: Overview", function() {
    test.before(function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should have the correct data in the main table', function() {
      umpirePage.getOverviewTableStat(1,7).then(function(ccPer) {
        assert.equal(ccPer, '87.9%', '2016  Season CC%');
      });        
    });

    test.describe('#heatMap', function() {
      test.it('drawing box on left heatmap should update the table', function() {
        umpirePage.drawBoxOnOverviewHeatMap('lefty', 150,200,75,40);  
        umpirePage.getOverviewTableStat(1,7).then(function(ccPer) {
          assert.equal(ccPer, '93.7%', '2016 season CC%');
        });        
      });
      
      test.after(function() {
        umpirePage.clearOverviewHeatMap('lefty');
      });
    });

    test.describe('#pitchView', function() {
      test.it('clicking pitch view link should show the pitch view image', function() {
        umpirePage.clickOverviewPitchViewLink('righty');
        
        umpirePage.getOverviewPitchViewPitchCount('righty').then(function(pitchCount) {
          assert.equal(pitchCount, 500, 'righty pitch view pitch count');
        });        
      });
      
      test.after(function() {
        umpirePage.clickOverviewHeatMapLink('righty');
      });
    });

    // TODO - these tests work, but they're all broken on the site
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
          { type: 'Strike Rate', title: 'Strike%' },
          { type: 'Ball Rate', title: 'Ball%' },  
          { type: 'Swing Rate', title: 'Swing%' },  
          { type: 'Contact Rate', title: 'Contact%' },  
          { type: 'Miss Rate', title: 'Miss%' },  
          { type: 'In Play Rate', title: 'InPlay%' },  
          { type: 'Foul Rate', title: 'Foul%' }  
        ];

        visualModes.forEach(function(visualMode) {
          test.it("selecting " + visualMode.type + " shows the correct title ", function() {
            umpirePage.changeVisualMode(visualMode.type);
            umpirePage.getOverviewHeatMapImageTitle('lefty').then(function(title) {
              assert.equal(title, visualMode.title, 'lefty visual title');
            });
            umpirePage.getOverviewHeatMapImageTitle('righty').then(function(title) {
              assert.equal(title, visualMode.title, 'righty visual title');
            });            
          });
        });        
      });      
    });       

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        umpirePage.clickOverviewTableStat(1,14);
        umpirePage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'RHP R. Gsellman (NYM) Vs RHB M. Franco (PHI), Top 1, 2 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        umpirePage.clickPitchVideoIcon(1);
        umpirePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 2 out");
        });

        umpirePage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-0 Slider 88.7 MPH ,52.8% ProbSL");
        });          
      }); 

      test.it('clicking into pitch visuals opens modal', function() {
        umpirePage.closeVideoPlaylistModal();
        umpirePage.clickPitchVisualsIcon(1);
        umpirePage.getPitchVisualsPitchCount().then(function(count) {
          assert.equal(count, 5, '# of pitches for pitch visual');
        });
      }); 

      // TODO - this feature is broken on the site
      // test.it('clicking hitChart play opens tooltip', function() {
      //   umpirePage.clickPitchVisualsHitChartPlotPoint();
        // umpirePage.clickHitChartTooltipPitchVideoIcon()
        // umpirePage.getHitChartTooltipPitchVideoHeader().then(function(text) {
            // assert.equal(text, '')
        // })
        
      // });       

      test.after(function() {
        // umpiresPage.closeHitChartTooltipPitchVideoModal();
        umpirePage.closePitchVisualsModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to new playlist', function() {     
      test.it('should create new playlist', function() {
        umpirePage.addVideoToNewList(1, 'Umpire Tests');
        umpirePage.closePlayByPlayModal();
        umpirePage.openVideoLibrary();
        umpirePage.listExistsInVideoLibrary('Umpire Tests').then(function(exists) {
          assert.equal(exists, true, 'Umpire Tests playlist exists in library');
        });
      });

      test.it('should have correct # of videos', function() {
        umpirePage.openVideoList('Umpire Tests');
        umpirePage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 1);
        });
      });

      test.it('should be able to play video', function() {
        umpirePage.playVideoFromList(1);
        umpirePage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        umpirePage.closeVideoPlaylistModal();
      });
    }); 

    test.describe('#filters', function() {
      test.it('adding filter: (Break Length (in): 6-9) from sidebar displays correct data', function() {
        filters.changeFilterGroupDropdown('Pitch')
        filters.changeValuesForRangeSidebarFilter("Break Length (in):", 6, 9);

        umpirePage.getOverviewTableStat(1,7).then(function(ccPer) {
          assert.equal(ccPer, '88.5%', '2016 Season CC%');
        });

        umpirePage.getOverviewTableStat(1,5).then(function(pa) {
          assert.equal(pa, 912, '2016 season PA');
        });                            
      });

      test.after(function() {
        filters.changeValuesForRangeSidebarFilter("Break Length (in):", '', '');
      });     
    });

    test.describe("#Reports", function() {
      var reports = [
        { type: 'Batters', topStat: 75, statType: "HR" },  
        { type: 'Pitch Rates', topStat: '50.5%', statType: "InZone%" },  
        { type: 'Pitch Counts', topStat: 4948, statType: "InZone#" },  
        { type: 'Pitch Types', topStat: '50.8%', statType: "Fast%" },  
        { type: 'Pitch Type Counts', topStat: 4965, statType: "Fast#" },  
      ];
      reports.forEach(function(report) {
        test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
          umpirePage.changeReport(report.type);  
          umpirePage.getOverviewTableStat(1, 7).then(function(stat) {
            assert.equal(stat, report.topStat, '2016 Season ' + report.statType);
          });
        });
      });  

      test.after(function() {
        umpirePage.changeReport('Pitch Call');
      });   
    });
  });

  // Game Logs Section
  test.describe("#Subsection: Game Log", function() {
    test.before(function() {
      umpirePage.goToSubSection("gameLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.it('should show the correct game data for 10/2/2016', function() {
      umpirePage.getGameLogTableStat(1,2).then(function(date) {
        assert.equal(date, '9/25/2016', '1st row game date');
      });

      umpirePage.getGameLogTableStat(1,4).then(function(score) {
        assert.equal(score, '17-0', '9/25/2016 - Score of game');
      });      

      umpirePage.getGameLogTableStat(1,9).then(function(ccPer) {
        assert.equal(ccPer, '82.5%', '9/25/2016 - CC%');
      });            
      
      umpirePage.getGameLogTableStat(1,11).then(function(slaa) {
        assert.equal(slaa, 6.08, '9/25/2016 - SLAA');
      });                  
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 2, colName: 'Date', sortType: 'dates', defaultSort: 'desc', initialCol: true },
        { colNum: 3, colName: 'HomeT', sortType: 'string', defaultSort: 'asc' },
        { colNum: 7, colName: 'PA', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 9, colName: 'CC%', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 16, colName: 'MC#', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) umpirePage.clickGameLogTableColumnHeader(column.colNum);
          umpirePage.waitForTableToLoad();
          umpirePage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          umpirePage.clickGameLogTableColumnHeader(column.colNum);
          umpirePage.waitForTableToLoad();
          umpirePage.getGameLogTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        umpirePage.clickGameLogTableColumnHeader(2);
        umpirePage.clickGameLogTableColumnHeader(2);
      });        
    });    

    // Video Playlist
    test.describe('#VideoPlaylist', function() {    
      test.it('clicking on a stat opens the play by play modal', function() {
        umpirePage.clickGameLogTableStat(1,7);
        umpirePage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, 'RHP R. Gsellman (NYM) Vs LHB C. Hernandez (PHI), Top 1, 0 Out');
        });
      });

      test.it('clicking into video opens correct video', function() {
        umpirePage.clickPitchVideoIcon(1);
        umpirePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "Top 1, 0 out");
        });

        umpirePage.getVideoPlaylistText(1,3).then(function(text) {
          assert.equal(text, "0-2 Fastball 94.7 MPH ,8.0% ProbSL");
        });          
      }); 

      test.after(function() {
        umpirePage.closeVideoPlaylistModal();
      });
    });

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        umpirePage.addVideoToList(1, 'Umpire Tests');
        umpirePage.closePlayByPlayModal();
        umpirePage.openVideoLibrary();
        umpirePage.openVideoList('Umpire Tests');
        umpirePage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });

      test.it('should be able to play video', function() {
        umpirePage.playVideoFromList(2);
        umpirePage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        umpirePage.closeVideoPlaylistModal();
      });
    });      


    test.describe("#filters", function() {
      test.it('adding filter: (Forward Velocity: 60-80) from sidebar displays correct data', function() {
        filters.changeValuesForRangeSidebarFilter("Forward Velocity:", 60, 80);

        umpirePage.getGameLogTableStat(1,8).then(function(pitches) {
          assert.equal(pitches, 16, '9/25/2016 pitches');
        });
      });

      test.after(function() {
        filters.closeDropdownFilter("Forward Velocity:");
      });
    });
  });  

  // Pitch Logs
  test.describe("#Subsection: Pitch Log", function() {
    test.before(function() {
      umpirePage.goToSubSection("pitchLog");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
    });

    test.describe('when selecting filter (Pitch Type: Changeup)', function() {
      test.before(function() {
        filters.toggleSidebarFilter('Pitch Type:', 'Changeup', true);
      });
      
      test.it('should show the correct at bat header text', function() {
        umpirePage.getMatchupsAtBatHeaderText(1).then(function(text) {
          assert.equal(text, "RHP R. Gsellman (NYM) Vs LHB R. Howard (PHI), Top 1, 2 Out");
        });
      });

      test.it('should show the correct row data', function() {
        umpirePage.getMatchupsPitchText(1,5).then(function(vel) {
          assert.equal(vel, 87, 'row 1 vel');
        });
        umpirePage.getMatchupsPitchText(1,7).then(function(result) {
          assert.equal(result, 'Strike Looking', 'row 1 Result');
        });
      });
    });

    test.describe('when clicking flat view tab', function() {
      test.it('should show the correct stats', function() {
        umpirePage.clickFlatViewTab();
        umpirePage.getFlatViewPitchText(1,5).then(function(vel) {
          assert.equal(vel, 84, 'row 1 velocity');
        });

        umpirePage.getFlatViewPitchText(4,7).then(function(result) {
          assert.equal(result, 'Line Out', 'row 4 result');
        });
      });
    })

    // Video Library
    test.describe('#VideoLibrary - add video to existing playlist', function() {     
      test.it('should have correct # of videos', function() {
        umpirePage.addVideoToList(1, 'Umpire Tests');
        umpirePage.openVideoLibrary();
        umpirePage.openVideoList('Umpire Tests');
        umpirePage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 3);
        });
      });

      test.it('should be able to play video', function() {
        umpirePage.playVideoFromList(1);
        umpirePage.isVideoModalDisplayed().then(function(displayed){
          assert.equal(displayed, true);
        });        
      });

      test.it('closing video modal', function() {
        umpirePage.closeVideoPlaylistModal();
      });
    });    

    test.describe('#VideoLibrary - removing video thru pbp', function() {     
      test.it('should have correct # of videos', function() {
        umpirePage.pbpRemoveVideoFromList(1, 'Umpire Tests');
        umpirePage.openVideoLibrary();
        umpirePage.getVideoCountFromList().then(function(count) {
          assert.equal(count, 2);
        });
      });
    }); 

    test.describe('#VideoLibrary - deleting playlist', function() {
      test.it('should remove playlist', function() {
        umpirePage.navigateBackToListIndex();
        umpirePage.deleteListFromLibrary('Umpire Tests');
        
        umpirePage.listExistsInVideoLibrary('Umpire Tests').then(function(exists) {
          assert.equal(exists, false);
        })
      });

      test.it('close video library', function() {
        umpirePage.closeVideoLibrary();
      }); 
    });   

    test.after(function() {
      filters.closeDropdownFilter('Pitch Type:');
    });
  });
});