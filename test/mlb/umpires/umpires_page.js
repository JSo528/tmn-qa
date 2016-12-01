var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');

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
        assert.equal(text, "0-2 Fastball 95 MPH");
      });          
    }); 

    test.after(function() {
      umpiresPage.closeVideoPlaylistModal();
      umpiresPage.closePlayByPlaytModal();
    });
  });



  // Sorting
  test.describe('#Sorting', function() {
    test.it('should be sorted initially by SLAA asc', function() {
      var statOne, statTwo, statTen;
      umpiresPage.getTableStat(1,slaaCol).then(function(stat) {
        statOne = stat;
      });

      umpiresPage.getTableStat(2,slaaCol).then(function(stat) {
        statTwo = stat;
      });

      umpiresPage.getTableStat(10,slaaCol).then(function(stat) {
        statTen = stat;

        assert.isAtMost(statOne, statTwo, "umpire 1's SLAA is <= umpire 2's SLAA");
        assert.isAtMost(statTwo, statTen, "umpire 2's SLAA is <= umpire 10's SLAA");
      });           
    });

    test.it('clicking on the BallFrmd column header should sort the table by BallFrmd desc', function() {
      umpiresPage.clickTableColumnHeader(ballFrmdCol);
      var statOne, statTwo, statTen;
      umpiresPage.getTableStat(1,ballFrmdCol).then(function(stat) {
        statOne = stat;
      });

      umpiresPage.getTableStat(2,ballFrmdCol).then(function(stat) {
        statTwo = stat;
      });

      umpiresPage.getTableStat(10,ballFrmdCol).then(function(stat) {
        statTen = stat;

        assert.isAtLeast(statOne, statTwo, "umpire 1's BallFrmd is >= umpire 2's BallFrmd");
        assert.isAtLeast(statTwo, statTen, "umpire 2's BallFrmd is >= umpire 10's BallFrmd");
      });           
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
      { type: 'Z-Score', topStat: 1.789 },
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
      { type: 'Pitch Type Counts', topStat: 10388, statType: "Fast#", colNum: 7 }
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