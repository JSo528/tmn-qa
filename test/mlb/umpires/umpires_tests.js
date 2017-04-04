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

var umpiresPage, filters, navbar;
var slaaCol, ballFrmdCol;

test.describe('#Umpires Page', function() {
  test.before(function() {
    umpiresPage = new UmpiresPage(driver);
    filters  = new Filters(driver);
    navbar  = new Navbar(driver);
    
    slaaCol = 9;
    ballFrmdCol = 16;

    navbar.goToUmpiresPage();
    filters.removeSelectionFromDropdownFilter("Seasons:");
    filters.addSelectionToDropdownFilter("Seasons:", 2016);
  });

  // Main
  test.describe('#Main', function() {
    test.it("should have the correct title", function() {
      umpiresPage.getPageTitle().then(function(title) {
        assert.equal(title, 'Umpires', 'page title');
      });
    });
  });

  // Video Playlist
  test.describe('#VideoPlaylist', function() {    
    test.it('clicking on a team stat opens the play by play modal', function() {
      umpiresPage.clickTableStat(1,5);
      umpiresPage.getMatchupsAtBatHeaderText(1).then(function(text) {
        assert.equal(text, 'RHP R. Gsellman (NYM) Vs LHB C. Hernandez (PHI), Top 1, 0 Out', '1st Video - at bat header text');
      });
    });

    test.it('clicking into video opens correct video', function() {
      umpiresPage.clickPitchVideoIcon(2);
      umpiresPage.getVideoPlaylistText(1,1).then(function(text) {
        assert.equal(text, "Top 1, 0 out");
      });

      umpiresPage.getVideoPlaylistText(1,3).then(function(text) {
        assert.equal(text, "0-2 Fastball 94.7 MPH ,8.0% ProbSL");
      });          
    }); 

    test.after(function() {
      umpiresPage.closeVideoPlaylistModal();
    });
  });

  // Video Library
  test.describe('#VideoLibrary - add video to new playlist from flat view', function() {     
    test.it('should create new playlist', function() {
      umpiresPage.clickFlatViewTab();
      umpiresPage.addVideoToNewList(1, 'Umpires Tests');
      umpiresPage.closePlayByPlayModal();
      umpiresPage.openVideoLibrary();
      umpiresPage.listExistsInVideoLibrary('Umpires Tests').then(function(exists) {
        assert.equal(exists, true, 'Teams Tests playlist exists in library');
      });
    });

    test.it('should have correct # of videos', function() {
      umpiresPage.openVideoList('Umpires Tests');
      umpiresPage.getVideoCountFromList().then(function(count) {
        assert.equal(count, 1);
      });
    });

    test.it('should be able to play video', function() {
      umpiresPage.playVideoFromList(1);
      umpiresPage.isVideoModalDisplayed().then(function(displayed){
        assert.equal(displayed, true);
      });        
    });

    test.it('closing video modal', function() {
      umpiresPage.closeVideoPlaylistModal();
    });
  });

  test.describe('#VideoLibrary - deleting playlist', function() {
    test.it('should remove playlist', function() {
      umpiresPage.openVideoLibrary();
      umpiresPage.navigateBackToListIndex();
      umpiresPage.deleteListFromLibrary('Umpires Tests');
      
      umpiresPage.listExistsInVideoLibrary('Umpires Tests').then(function(exists) {
        assert.equal(exists, false);
      })
    });

    test.it('close video library', function() {
      umpiresPage.closeVideoLibrary();
    });
  });      

  // Sorting
  test.describe("#sorting", function() {
    var columns = [
      { colNum: 9, colName: 'SLAA', sortType: 'number', defaultSort: 'asc', initialCol: true },
      { colNum: 4, colName: 'G', sortType: 'string', defaultSort: 'desc' },
      { colNum: 7, colName: 'CC%', sortType: 'number', defaultSort: 'desc' },
      { colNum: 14, colName: 'MC#', sortType: 'number', defaultSort: 'asc' },
      { colNum: 15, colName: 'StrkFrmd', sortType: 'number', defaultSort: 'asc' },
    ]

    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        if (!column.initialCol) umpiresPage.clickTableColumnHeader(column.colNum);
        umpiresPage.waitForTableToLoad();
        umpiresPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
          assert.deepEqual(stats, sortedArray);
        })
      });

      test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
        umpiresPage.clickTableColumnHeader(column.colNum);
        umpiresPage.waitForTableToLoad();
        umpiresPage.getTableStatsForCol(column.colNum).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
          var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
          assert.deepEqual(stats, sortedArray);
        })
      });
    });

    test.after(function() {
      umpiresPage.clickTableColumnHeader(16);
    });        
  });  

  // Filters
  test.describe('#Filters', function() {
    test.before(function() {
      filters.changeFilterGroupDropdown("Pitch");
    });

    test.it('filtering by (count: All) should show the correct value for BallFrmd leader', function() {
      filters.selectAllForDropdownSidebarFilter("count:", true);

      umpiresPage.getTableStat(1,ballFrmdCol).then(function(stat) {
        assert.equal(stat, 124);
      });
    });    

    test.it('filtering by (PFX X (in): 3-15) should give the correct value for BallFrmd leader', function() {
      filters.changeValuesForRangeSidebarFilter("PFX X (in):", 3, 15);

      umpiresPage.getTableStat(1,ballFrmdCol).then(function(stat) {
        assert.equal(stat, 45);
      });      
    });      

    test.it('filtering by (PFX Z (in): 6-12) should give the correct value for BallFrmd leader', function() {
      filters.changeValuesForRangeSidebarFilter("PFX Z (in):", 3, 15);

      umpiresPage.getTableStat(1,ballFrmdCol).then(function(stat) {
        assert.equal(stat, 32);
      }); 
    });

    test.after(function() {
      filters.closeDropdownFilter("count:");
      filters.closeDropdownFilter("PFX X (in):");
      filters.closeDropdownFilter("PFX Z (in):");
    });
  });

  // Isolation Mode
  test.describe("#isolation mode", function() {
    test.it('selecting Ryan Blakney from search should add umpire to table', function() {
      // umpiresPage.clickIsoBtn("on");
      // umpiresPage.addToIsoTable('Larry Vanover', 5)
      umpiresPage.clickTablePin(5, 3);

      umpiresPage.getIsoTableStat(1,3).then(function(stat) {
        assert.equal(stat, 'Ryan Blakney', '1st row umpire name');
      })
    });      


    test.it('selecting Greg Gibson from search should add umpire to table', function() {
      // umpiresPage.addToIsoTable('Jerry Meals', 1)
      umpiresPage.clickTablePin(10, 3);
      umpiresPage.getIsoTableStat(1,3).then(function(stat) {
        assert.equal(stat, 'Ryan Blakney', '1st row umpire name');
      });

      umpiresPage.getIsoTableStat(2,3).then(function(stat) {
        assert.equal(stat, 'Greg Gibson', '2nd row umpire name');
      });
    });         

    test.it('pinned total should show the correct sum', function() {
      umpiresPage.clickIsoBtn("on");
      umpiresPage.getPinnedTotalTableStat(4).then(function(wins) {
        assert.equal(wins, 65, 'pinned total - games');
      });
    });                                       

    test.it('turning off isolation mode should show players in iso table', function() {
      umpiresPage.clickIsoBtn("off");
      umpiresPage.getIsoTableStat(1,3).then(function(stat) {
        assert.equal(stat, 'Ryan Blakney', '1st row umpire name');
      });

    });                                               
  });

  // Chart/Edit Columns
  test.describe("#chart/edit columns", function() {
    // histograms
    test.it('clicking show histogram link should open histogram modal', function() {
      umpiresPage.clickChartColumnsBtn()
      
      umpiresPage.openHistogram(12);  
      umpiresPage.isModalDisplayed().then(function(isDisplayed) {
        assert.equal(isDisplayed, true);
      });
    });  

    test.it('hovering over bar should show stats for players', function() {
      umpiresPage.hoverOverHistogramStack(1)
      umpiresPage.getTooltipText().then(function(text) {
        // TODO - set this once this is fixed on production
        assert.equal(text, 'J. Chamberlain: 22 (NYY-P)\nH. Ambriz: 22 (HOU-P)\nE. Ramirez: 22 (NYM-P)\nN. Adcock: 22 (KC-P)\nE. Escalona: 21 (COL-P)\nA. Varvaro: 21 (ATL-P)\nK. McPherson: 21 (PIT-P)\nC. Rusin: 21 (CHC-P)\nT. Skaggs: 21 (ARI-P)\nR. Hill: 21 (BOS-P)\n+ 192 more', 'tooltip for 1st bar');
      });
    });

    test.it('pinned players should be represented by circles', function() {
      umpiresPage.getHistogramCircleCount().then(function(count) {
        assert.equal(count, 2, '# of circles on histogram')
      })
    })

    test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
      umpiresPage.toggleHistogramDisplayPinsAsBars();
      umpiresPage.getHistogramBarCount().then(function(count) {
        // 1 original bar and 4 new bars will have height=0 and will appear invisible
        assert.equal(count, 16, '# of bars on histogram');
      });
    });

    test.it("changing Bin Count should update the histogram", function() {
      umpiresPage.changeHistogramBinCount(3);
      umpiresPage.getHistogramBarCount().then(function(count) {
        // 1 original bar and 4 new bars will have height=0 and will appear invisible
        assert.equal(count, 6, '# of bars on histogram');
      });
    });

    test.it('setting title should show the title on the modal', function() {
      umpiresPage.setTitleForHistogram('Test');
      umpiresPage.getTitleForHistogram().then(function(title) {
        assert.equal(title, 'Test', 'title of modal');
      });
    });           

    test.it('clicking close histogram button should close histogram modal', function() {
      umpiresPage.closeModal();
      umpiresPage.isModalDisplayed().then(function(isDisplayed) {
        assert.equal(isDisplayed, false);
      }); 
    })     
  });

  // Group By
  test.describe('#Group By', function() {
    test.before(function() {
      filters.addSelectionToDropdownFilter('Seasons:', 2015);
    });

    test.it('grouping by: season should show the seasons columns', function() {
      umpiresPage.changeGroupBy("By Season");
      umpiresPage.getTableHeader(4).then(function(header) {
        assert.equal(header, 'Season');
      });
    });

    test.it('grouping by: season should show the correct results', function() {
      umpiresPage.getTableStat(8, 4).then(function(stat) {
        assert.equal(stat, 2015);
      });

      umpiresPage.getTableStat(8, 3).then(function(stat) {
        assert.equal(stat, "Andy Fletcher");
      });      

      umpiresPage.getTableStat(8, 17).then(function(stat) {
        assert.equal(stat, 103);
      });            
    });    


    test.it('grouping by: game should show the correct headers', function() {
      umpiresPage.changeGroupBy("By Game");
      umpiresPage.getTableHeader(4).then(function(header) {
        assert.equal(header, 'Date');
      });

      umpiresPage.getTableHeader(5).then(function(header) {
        assert.equal(header, 'HomeT');
      });

      umpiresPage.getTableHeader(6).then(function(header) {
        assert.equal(header, 'Score');
      });
    });

    test.it('grouping by: game should give the correct value for BallFrmd leader', function() {
      umpiresPage.getTableStat(1, 20).then(function(stat) {
        assert.equal(stat, 20);
      });            
    }); 

    test.after(function() {
      umpiresPage.changeGroupBy("Total");
    });
  });  

  // Qualify By
  test.describe('#Qualify By', function() {
    test.it('qualify by (pitches: >18000) should give the correct value for BallFrmd leader', function() {
      umpiresPage.changeQualifyBy("Custom", "Pitches", 18000);

      umpiresPage.getTableStat(1, 3).then(function(stat) {
        assert.equal(stat, 'Larry Vanover');
      }); 

      umpiresPage.getTableStat(1, ballFrmdCol).then(function(stat) {
        assert.equal(stat, 218);
      }); 
    });
  });  

  // Stats View
  test.describe("#stats view", function() {
    var topColor = "rgba(108, 223, 118, 1)";
    var statViews = [
      { type: 'Rank', topStat: 1, color: true },            
      { type: 'Percentile', topStat: "100.0%", color: true },
      { type: 'Z-Score', topStat: 1.79 },
      { type: 'Stat Grade', topStat: 80 },
      { type: 'Stat (Rank)', topStat: "218 (1)", color: true },
      { type: 'Stat (Percentile)', topStat: "218 (100%)", color: true },
      { type: 'Stat (Z-Score)', topStat: "218 (1.79)"},
      { type: 'Stat (Stat Grade)', topStat: "218 (80)"}
    ];
    statViews.forEach(function(statView) {
      test.it("selecting (stats view: " + statView.type + ") shows the correct value for the BallFrmd leader", function() {
        umpiresPage.changeStatsView(statView.type);  
        umpiresPage.getTableStat(1,ballFrmdCol).then(function(stat) {
          assert.equal(stat, statView.topStat);
        });
      });

      if (statView.color) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct color for the BallFrmd leader", function() {
          umpiresPage.getTableBgColor(1,ballFrmdCol).then(function(color) {
            assert.equal(color, topColor);
          });
        });
      }
    });

    test.after(function() {
      umpiresPage.changeStatsView('Stats');
    });
  });  

  // Umpires Reports
  test.describe("#reports", function() {
    var reports = [
      { type: 'Batters', topStat: 0.783, statType: "OPS", colNum: 14 },  
      { type: 'Pitch Rates', topStat: "46.3%", statType: "InZoneMdl%", colNum: 8 },  
      { type: 'Pitch Counts', topStat: 132, statType: "StrkFrmd", colNum: 12 },  
      { type: 'Pitch Types', topStat: "54.6%", statType: "Fast%", colNum: 7 },  
      { type: 'Pitch Type Counts', topStat: 10424, statType: "Fast#", colNum: 7 }
    ];

    reports.forEach(function(report) {
      test.it("selecting (report: " + report.type + ") shows the correct value for the " + report.statType + " leader", function() {
        umpiresPage.changeReport(report.type);  
        umpiresPage.getTableStat(1,report.colNum).then(function(stat) {
          assert.equal(stat, report.topStat);
        });
      });
    });   

    test.after(function() {
      umpiresPage.changeReport('Pitch Calls');
    });
  });
});