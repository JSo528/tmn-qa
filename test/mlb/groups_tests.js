var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
var extensions = require('../../lib/extensions.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var GroupsPage = require('../../pages/mlb/groups_page.js');

var groupsPage, filters, navbar;
var battingAvgCol, outRateCol, eraCol, slaaCol;

test.describe('#Groups Page', function() {
  test.it('test setup', function() {
    groupsPage = new GroupsPage(driver);
    filters  = new Filters(driver);
    navbar  = new Navbar(driver);
    navbar.goToGroupsPage();
  });

  test.describe('#Section: Batting', function() {
    test.it('test setup', function() {
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2009);
      filters.removeSelectionFromDropdownFilter("Game Type:");
      filters.addSelectionToDropdownFilter("Type:", "Playoff");

      battingAvgCol = 6;
      outRateCol = 18;
    })

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colNum: 6, colName: 'BA', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colNum: 5, colName: 'AB', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colNum: 11, colName: 'K%', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 18, colName: 'OutRate', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colNum: 21, colName: 'SHAV', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) groupsPage.clickTableColumnHeader(column.colNum);
          groupsPage.waitForTableToLoad();
          groupsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          groupsPage.clickTableColumnHeader(column.colNum);
          groupsPage.waitForTableToLoad();
          groupsPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });

      test.after(function() {
        groupsPage.clickTableColumnHeader(18);
      });        
    });

    // Filters
    test.describe('#Filters', function() {
      test.it('test setup', function() {
        filters.changeFilterGroupDropdown("Situation");
      });

      test.it('filtering by (After Pitch Run Diff: -1 to 1) should show the correct value for OutRate leader', function() {
        filters.changeValuesForRangeSidebarFilter("After Pitch Run Diff:", -1, 1);

        groupsPage.getTableStat(1,outRateCol).then(function(stat) {
          assert.equal(stat, '64.1%');
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'AL Central');
        });
      });    

      test.it('filtering by (Batter Position: LF, CF, RF) should give the correct value for OutRate leader', function() {
        filters.addSelectionToDropdownSidebarFilter('Batter Position:', 'LF');
        filters.addSelectionToDropdownSidebarFilter('Batter Position:', 'CF');
        filters.addSelectionToDropdownSidebarFilter('Batter Position:', 'RF');

        groupsPage.getTableStat(1,outRateCol).then(function(stat) {
          assert.equal(stat, '61.1%');
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'NL Central');
        });    
      });      
    });

    // Group By
    test.describe('#Group By', function() {
      test.it('grouping by: league should show the league name column', function() {
        groupsPage.changeGroupBy("By League");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'League');
        });
      });

      test.it('grouping by: league should show the correct results', function() {
        groupsPage.getTableStat(1, 18).then(function(stat) {
          assert.equal(stat, '67.1%'); // OutRate
        });

        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "AL");
        });      
      }); 

      test.it('grouping by: month should show the month name column', function() {
        groupsPage.changeGroupBy("By Month");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'Month');
        });
      });

      test.it('grouping by: month should show the correct results', function() {
        groupsPage.getTableStat(1, 18).then(function(stat) {
          assert.equal(stat, '58.3%'); // OutRate
        });

        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "November");
        });      
      }); 

      test.it('grouping by: org should show the org name column', function() {
        groupsPage.changeGroupBy("By Org");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'Org');
        });
      });

      test.it('grouping by: org should show the correct results', function() {
        groupsPage.getTableStat(1, 18).then(function(stat) {
          assert.equal(stat, '53.6%'); // OutRate
        });

        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "COL");
        });      
      }); 

      // Seasons
      test.it('grouping by: season should show the years column', function() {
        filters.addSelectionToDropdownFilter('Seasons:', 2010);
        groupsPage.changeGroupBy("By Season");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'Year');
        });
      });

      test.it('grouping by: season should show the correct results', function() {
        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, 2009);
        });     

        groupsPage.getTableStat(1, 18).then(function(stat) {
          assert.equal(stat, '68.0%');
        });            
      });    

      test.it('grouping by: league season should show the league and year columns', function() {
        groupsPage.changeGroupBy("By League Season");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'League');
        });

        groupsPage.getTableHeader(2).then(function(header) {
          assert.equal(header, 'Year');
        });      
      });

      test.it('grouping by: league season should show the correct results', function() {
        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "AL");
        });     

        groupsPage.getTableStat(1, 2).then(function(stat) {
          assert.equal(stat, 2009);
        });           

        groupsPage.getTableStat(1, 19).then(function(stat) {
          assert.equal(stat, '67.1%');
        });            
      });    

      test.it('grouping by: division season should show the division and year columns', function() {
        groupsPage.changeGroupBy("By Division Season");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'Division');
        });

        groupsPage.getTableHeader(2).then(function(header) {
          assert.equal(header, 'Year');
        });      
      });

      test.it('grouping by: division season should show the correct results', function() {
        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "NL West");
        });     

        groupsPage.getTableStat(1, 2).then(function(stat) {
          assert.equal(stat, 2010);
        });           

        groupsPage.getTableStat(1, 19).then(function(stat) {
          assert.equal(stat, '59.4%');
        });            
      });    

      test.it('grouping by: org season should show the org and year columns', function() {
        groupsPage.changeGroupBy("By Org Season");
        groupsPage.getTableHeader(1).then(function(header) {
          assert.equal(header, 'Org');
        });

        groupsPage.getTableHeader(2).then(function(header) {
          assert.equal(header, 'Year');
        });      
      });

      test.it('grouping by: org season should show the correct results', function() {
        groupsPage.getTableStat(1, 1).then(function(stat) {
          assert.equal(stat, "COL");
        });     

        groupsPage.getTableStat(1, 2).then(function(stat) {
          assert.equal(stat, 2009);
        });           

        groupsPage.getTableStat(1, 19).then(function(stat) {
          assert.equal(stat, '53.6%');
        });            
      });        


      test.after(function() {
        groupsPage.changeGroupBy("By Division");
        filters.removeSelectionFromDropdownFilter("Seasons:", 2009, true);
      });
    });  

    // Stats View
    test.describe("#stats view", function() {
      var statViews = [
        { type: 'Rank', topStat: 1},            
        { type: 'Percentile', topStat: "100.0%"},
        { type: 'Z-Score', topStat: 1.025 },
        { type: 'Stat Grade', topStat: 80 },
        { type: 'Stat (Rank)', topStat: "59.4% (1)"},
        { type: 'Stat (Percentile)', topStat: "59.4% (100%)"},
        { type: 'Stat (Z-Score)', topStat: "59.4% (1.02)"},
        { type: 'Stat (Stat Grade)', topStat: "59.4% (80)"},
        { type: 'Pct of Team', topStat: "59.4%"},
      ];
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct value for the OutRate leader", function() {
          groupsPage.changeStatsView(statView.type);  
          groupsPage.getTableStat(1,outRateCol).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });
      });

      test.after(function() {
        groupsPage.changeStatsView('Stats');
      });
    });  

    // Groups Batting Reports
    test.describe("#reports", function() {
      var reports = [
          { type: 'Counting', topStat: 25, statType: "H", colNum: 10 },  
          { type: 'Pitch Rates', topStat: "42.2%", statType: "InZone%", colNum: 11 },  
          { type: 'Pitch Counts', topStat: 23, statType: "InZone#", colNum: 10 },  
          { type: 'Pitch Types', topStat: "49.2%", statType: "Fast%", colNum: 5 },  
          { type: 'Pitch Type Counts', topStat: 166, statType: "Fast#", colNum: 5 },  
          { type: 'Pitch Locations', topStat: "42.2%", statType: "InZone%", colNum: 5 },  
          { type: 'Pitch Calls', topStat: -3.57, statType: "SLAA", colNum: 5 },  
          { type: 'Hit Types', topStat: 0.57, statType: "GB/FB", colNum: 4 },  
          { type: 'Hit Locations', topStat: "87.5%", statType: "HPull%", colNum: 7 },  
          { type: 'Home Runs', topStat: 4, statType: "HR", colNum: 5 }
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct value for the " + report.statType + " leader", function() {
          groupsPage.changeBattingReport(report.type);  
          
          groupsPage.getTableHeader(report.colNum).then(function(stat) {
            assert.equal(stat, report.statType);
          });

          groupsPage.getTableStat(1,report.colNum).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });

  test.describe('#Section: Pitching', function() {
    test.it('test setup', function() {
      groupsPage.goToSection("Pitching");
      
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2011);
      filters.removeSelectionFromDropdownFilter("Game Type:");
      filters.addSelectionToDropdownFilter("Type:", "Division Series");

      eraCol = 19;
    });

    test.describe('#Sorting', function() {
      test.it('should be sorted initially by ERA asc', function() {
        var statOne, statTwo, statSix;
        groupsPage.getTableStat(1,eraCol).then(function(stat) {
          statOne = stat;
        });

        groupsPage.getTableStat(2,eraCol).then(function(stat) {
          statTwo = stat;
        });

        groupsPage.getTableStat(6,eraCol).then(function(stat) {
          statSix = stat;

          assert.isAtMost(statOne, statTwo, "group 1's ERA is <= group 2's ERA");
          assert.isAtMost(statTwo, statSix, "group 2's ERA is <= group 6's ERA");
        });           
      });
    });

    // Filters
    test.describe('#Filters', function() {
      test.it('test setup', function() {
        filters.changeFilterGroupDropdown("Game");
      });

      test.it('filtering by (Day of Week: Sunday) should show the correct value for ERA leader', function() {
        filters.addSelectionToDropdownSidebarFilter("Day of Week:", "Sunday");

        groupsPage.getTableStat(1,eraCol).then(function(stat) {
          assert.equal(stat, 3.00);
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'AL Central');
        });
      });    

      test.it('filtering by (Venue: Away) should give the correct value for ERA leader', function() {
        filters.selectForBooleanDropdownSidebarFilter('Venue:', 'Away');
        

        groupsPage.getTableStat(1,eraCol).then(function(stat) {
          assert.equal(stat, 3.00);
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'AL Central');
        });    
      });

      test.after(function() {
        filters.closeDropdownFilter("Day of Week");
        filters.closeDropdownFilter("Venue");
      });      
    });    

    // Groups Pitching Reports
    test.describe("#reports", function() {
      var reports = [
          { type: 'Rate', topStat: 0.220, statType: "BA", colNum: 7 },  
          { type: 'Counting', topStat: 33, statType: "H", colNum: 7 },  
          { type: 'Pitch Rates', topStat: "53.7%", statType: "InZone%", colNum: 11 },  
          { type: 'Pitch Counts', topStat: 644, statType: "InZone#", colNum: 10 },  
          { type: 'Pitch Types', topStat: "41.2%", statType: "Fast%", colNum: 5 },  
          { type: 'Pitch Type Counts', topStat: 491, statType: "Fast#", colNum: 5 },  
          { type: 'Pitch Locations', topStat: "53.7%", statType: "InZone%", colNum: 5 },  
          { type: 'Pitch Calls', topStat: 34.74, statType: "SLAA", colNum: 6 },  
          { type: 'Hit Types', topStat: 1.14, statType: "GB/FB", colNum: 4 },  
          { type: 'Hit Locations', topStat: "47.6%", statType: "HPull%", colNum: 7 },  
          { type: 'Home Runs', topStat: 2, statType: "HR", colNum: 4 },
          { type: 'Movement', topStat: 90.4, statType: "Vel", colNum: 4 },
          { type: 'Bids', topStat: 0, statType: "NH", colNum: 5 },
          { type: 'Baserunning', topStat: "33.3%", statType: "SB%", colNum: 6 },
          { type: 'Exit Data', topStat: 0.352, statType: "ExSLG", colNum: 9 }
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct value for the " + report.statType + " leader", function() {
          groupsPage.changePitchingReport(report.type);  
          
          groupsPage.getTableHeader(report.colNum).then(function(stat) {
            assert.equal(stat, report.statType);
          });

          groupsPage.getTableStat(1,report.colNum).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });

  test.describe('#Section: Catching', function() {
    test.it('test setup', function() {
      groupsPage.goToSection("Catching");
      
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2010);
      filters.removeSelectionFromDropdownFilter("Game Type:");
      filters.addSelectionToDropdownFilter("Type:", "League Championship");

      slaaCol = 5;
    });

    // Filters
    test.describe('#Filters', function() {
      test.it('test setup', function() {
        filters.changeFilterGroupDropdown("Pitch");
      });

      test.it('filtering by (After Count: 0-2) should show the correct value for SLAA leader', function() {
        filters.addSelectionToDropdownSidebarFilter("After Count:", "0-2");

        groupsPage.getTableStat(1,slaaCol).then(function(stat) {
          assert.equal(stat, 0.96);
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'NL East');
        });
      });    

      test.it('filtering by (Last Pitch Type: Curveball) should give the correct value for SLAA leader', function() {
        filters.addSelectionToDropdownSidebarFilter('Last Pitch Type:', 'Curveball');
        

        groupsPage.getTableStat(1,slaaCol).then(function(stat) {
          assert.equal(stat, 0.40);
        });

        groupsPage.getTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'AL West');
        });    
      });

      test.after(function() {
        filters.closeDropdownFilter("After Count");
        filters.closeDropdownFilter("Last Pitch Type");
      });      
    });    

    // Groups Pitching Reports
    test.describe("#reports", function() {
      var reports = [
          { type: 'Pitch Types', topStat: "39.3%", statType: "Fast%", colNum: 5 },  
          { type: 'Pitch Type Counts', topStat: 361, statType: "Fast#", colNum: 5 },  
          { type: 'Catcher Defense', topStat: 0.44, statType: "FldRAA", colNum: 8 },  
          { type: 'Catcher Pitch Rates', topStat: "47.3%", statType: "InZoneMdl%", colNum: 6 },  
          { type: 'Catcher Pitch Counts', topStat: 15, statType: "StrkFrmd", colNum: 10 }
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct value for the " + report.statType + " leader", function() {
          groupsPage.changeCatchingReport(report.type);  
          
          groupsPage.getTableHeader(report.colNum).then(function(stat) {
            assert.equal(stat, report.statType);
          });

          groupsPage.getTableStat(1,report.colNum).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });        
    });
  });
});