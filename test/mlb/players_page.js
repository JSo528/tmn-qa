var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var Filters = require('../../pages/mlb/filters.js');
var PlayersPage = require('../../pages/mlb/players/players_page.js');
var StatsPage = require('../../pages/mlb/players/stats_page.js');
var StreaksPage = require('../../pages/mlb/players/streaks_page.js');
var ScatterPlotPage = require('../../pages/mlb/players/scatter_plot_page.js');
var navbar, playersPage, statsPage, streaksPage, scatterPlotPage;
var battingAverageCol, ksPerCol, eraCol, ksCol, slaaCol, statCol;

test.describe('#Players Page', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
  });

  test.it('clicking the players link goes to the correct page', function() {
    navbar.goToPlayersPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Players Batting', 'Correct title');
    });
  });    

  test.describe('#Section: Batting', function() {
    test.describe('#SubSection: Stats', function() {
      test.before(function() {
        statsPage = new StatsPage(driver, 'batting');
        battingAverageCol = 8;
        ksPerCol = 13;
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2014);
      });

      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by BA descending', function() {
          var playerOneBA, playerTwoBA, playerTenBA;
          statsPage.getTableStat(1,battingAverageCol).then(function(stat) {
            playerOneBA = stat;
          });

          statsPage.getTableStat(2,battingAverageCol).then(function(stat) {
            playerTwoBA = stat;
          });

          statsPage.getTableStat(10,battingAverageCol).then(function(stat) {
            playerTenBA = stat;

            assert.isAtLeast(playerOneBA, playerTwoBA, "player 1's BA is >= player 2's BA");
            assert.isAtLeast(playerTwoBA, playerTenBA, "player 2's BA is >= player 10's BA");
          });            
        });

        test.it('clicking on the BA column header should reverse the sort', function() {
          var playerOneBA, playerTwoBA, playerTenBA;
          statsPage.clickTableColumnHeader(battingAverageCol);
          statsPage.getTableStat(1,battingAverageCol).then(function(stat) {
            playerOneBA = stat;
            console.log(playerOneBA)
          });

          statsPage.getTableStat(2,battingAverageCol).then(function(stat) {
            playerTwoBA = stat;
            console.log(playerTwoBA)
          });

          statsPage.getTableStat(10,battingAverageCol).then(function(stat) {
            playerTenBA = stat;

            assert.isAtMost(playerOneBA, playerTwoBA, "player 1's BA is <= player 2's BA");
            assert.isAtMost(playerTwoBA, playerTenBA, "player 2's BA is <= player 10's BA");
          });
        });

        test.it('clicking on the K% column header should sort the table by K% ascending', function() {
          var p1, p2, p10;
          statsPage.clickTableColumnHeader(ksPerCol);
          statsPage.getTableStat(1,ksPerCol).then(function(stat) {
            p1 = parseFloat(stat); // 11.1% becomes 0.111
          });

          statsPage.getTableStat(2,ksPerCol).then(function(stat) {
            p2 = parseFloat(stat);
          });

          statsPage.getTableStat(10,ksPerCol).then(function(stat) {
            p10 = parseFloat(stat);
            assert.isAtMost(p1, p2, "player 1's k% is <= player 2's k%");
            assert.isAtMost(p2, p10, "player 2's k% is <= player 10's k%");
          });
        });  

        test.after(function() {
          statsPage.clickTableColumnHeader(battingAverageCol);
        });    
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (extra inning game) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Extra Inning Game');

          statsPage.getTableStat(1,9).then(function(onBasePercentage) {
            assert.equal(onBasePercentage, 0.486);
          });
        });

        test.it('adding filter: (Batted ball: Fly ball) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Batted Ball:', 'Fly Ball', true);

          statsPage.getTableStat(1,17).then(function(runsPerGame) {
            assert.equal(runsPerGame, 0.250);
          });
        });
      }); 

      // Pinning
      test.describe("#pinning", function() {
        test.it('clicking the pin icon for Corey Dickerson should add him to the pinned table', function() {
          var playerName;
          statsPage.getTableStat(1,3).then(function(name) {
            playerName = name;
          });

          statsPage.clickPlayerTablePin(1);

          statsPage.getIsoTableStat(1,3).then(function(name) {
            assert.equal(name, playerName);
          });
        });
      });

      // Group By
      test.describe("#group by", function() {
        test.it('selecting "By Season" shows the correct headers', function() {
          statsPage.changeGroupBy("By Season");
          statsPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });
        });

        test.it('selecting "By Game" shows the correct headers', function() {
          statsPage.changeGroupBy("By Game");
          statsPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Opponent");
          });          
        });        

        test.it('selecting "By Team Season" shows the correct headers', function() {
          statsPage.changeGroupBy("Team Season");
          statsPage.getPlayerTableHeader(4).then(function(header) {
            assert.equal(header, "Season");
          });                    

          statsPage.getPlayerTableHeader(5).then(function(header) {
            assert.equal(header, "Level");
          });                              
        });        
        test.after(function() {
          filters.closeDropdownFilter('Batted Ball:');
          filters.closeDropdownFilter('Extra Inning Game:');
          statsPage.changeGroupBy("Total"); // change back to group by total
        });
      });

      // Stats View
      test.describe("#stats view", function() {
        test.before(function() {
          filters.toggleSidebarFilter('Zone Location:', 'Out of Strike Zone', true);
        });

        // Comparing top BA in 2015 for all the different stat views
        var topColor = "rgba(108, 223, 118, 1)";
        var statViews = [
          { type: 'Stat', topStat: 0.289 },  
          { type: 'Rank', topStat: 1, color: true },            
          { type: 'Percentile', topStat: "100.0%", color: true },
          { type: 'Z-Score', topStat: 2.425 },
          { type: 'Stat Grade', topStat: 80 },
          { type: 'Stat (Rank)', topStat: ".289 (1)", color: true },
          { type: 'Stat (Percentile)', topStat: ".289 (100%)", color: true },
          { type: 'Stat (Z-Score)', topStat: ".289 (2.43)"},
          { type: 'Stat (Stat Grade)', topStat: ".289 (80)"},
          { type: 'Pct of Team', topStat: ".289"},
        ];
        statViews.forEach(function(statView) {
          test.it("selecting '" + statView.type + "' shows the correct stat value", function() {
            statsPage.changeStatsView(statView.type);  
            statsPage.getTableStat(1,8).then(function(stat) {
              assert.equal(stat, statView.topStat);
            });
          });

          if (statView.color) {
            test.it("selecting " + statView.type + " shows the top value the right color", function() {
              statsPage.getPlayerTableBgColor(1,8).then(function(color) {
                assert.equal(color, topColor);
              });
            });
          }
        });
        test.after(function() {
          filters.toggleSidebarFilter('Zone Location:', 'Out of Strike Zone', false);
          statsPage.changeStatsView('Stat'); // Remove Stats View
        });
      });      

      // Qualify By
      test.describe("#qualify by", function() {
        test.it("selecting All shows all players", function() {
          statsPage.changeQualifyBy("All");
          statsPage.getTableStat(1,4).then(function(games) {
            assert.equal(games, 27);
          });

          statsPage.getTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 1.000);
          });          
        });

        test.it("selecting Custom shows correct subset of players", function() {
          statsPage.changeQualifyBy("Custom", "Atbats", 50);
          statsPage.clickTableColumnHeader(7); // sort AB's descending
          statsPage.clickTableColumnHeader(7); // sort AB's ascending
          statsPage.getTableStat(1,7).then(function(atBats) {
            assert.equal(atBats, 50);
          });

          statsPage.getTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 0.060);
          });          
        });        

        test.after(function() {
          statsPage.changeQualifyBy("Default");
          statsPage.clickTableColumnHeader(8); // sort BA's descending
        });
      });

      // Batting Reports
      test.describe("#batting reports", function() {
        test.before(function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Middle Third', true);
        });

        var reports = [
          { type: 'Counting', topStat: 86, statType: 'H'},  
          { type: 'Pitch Rates', topStat: '62.7%', statType: 'InZone%', colNum: 13},            
          { type: 'Pitch Count', topStat: '269', statType: 'InZone#'},            
          { type: 'Pitch Types', topStat: '60.8%', statType: 'Fast%', colNum: 7},                      
          { type: 'Pitch Type Counts', topStat: '401', statType: 'Fast#', colNum: 7},                      
          { type: 'Pitch Locations', topStat: '62.7%', statType: 'InZone%', colNum: 7},   
          { type: 'Pitch Calls', topStat: '-22.35', statType: 'SLAA', colNum: 7},   
          { type: 'Hit Types', topStat: '0.35', statType: 'GB/FB', colNum: 6},   
          { type: 'Hit Locations', topStat: '70.1%', statType: 'HPull%', colNum: 9},   
          { type: 'Home Runs', topStat: '20', statType: 'HR', colNum: 7},   
          { type: 'Exit Data', topStat: '.789', statType: 'ExSLG', colNum: 11},   
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value", function() {
            var colNum = report.colNum || 12;
            var rowNum = report.rowNum || 1;
            statsPage.changeReport(report.type);  
            statsPage.getTableStat(rowNum, colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });

        test.after(function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Middle Third', false);
        });
      });                      
    });

    test.describe('#SubSection: Occurences & Streaks', function() {
      test.before(function() {
        streaksPage = new StreaksPage(driver);
      });

      test.it('clicking the occurences & streaks link goes to the correct URL', function() {
        playersPage.goToSubSection('Occurrences & Streaks');
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2013);

        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /players\-streaks\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        streaksPage.getTableStat(1,5).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('table should have proper headers on load', function() {
        streaksPage.getTableHeader(1).then(function(header) {
          assert.equal(header, "Count");
        });

        streaksPage.getTableHeader(2).then(function(header) {
          assert.equal(header, "FullName");
        });        

        streaksPage.getTableHeader(3).then(function(header) {
          assert.equal(header, "StartTeam");
        });        

        streaksPage.getTableHeader(4).then(function(header) {
          assert.equal(header, "EndTeam");
        });        

        streaksPage.getTableHeader(5).then(function(header) {
          assert.equal(header, "StartDate");
        });        

        streaksPage.getTableHeader(6).then(function(header) {
          assert.equal(header, "EndDate");
        });        

        streaksPage.getTableHeader(7).then(function(header) {
          assert.equal(header, "H");
        });        
      });    

      test.it('changing the main constraint should update the table headers', function() {
        streaksPage.changeMainConstraint("Most Recent", "Exactly", 4, "SB (Batting)", "In a Game", "Within a Season");
        streaksPage.getTableHeader(6).then(function(header) {
          assert.equal(header, "SB");
        });   
      });

      test.it('changing the main constraint should update the table stats', function() {
        streaksPage.getTableStat(1,1).then(function(playerName) {
          assert.equal(playerName, "Billy Hamilton (CF-CIN)");
        });

        streaksPage.getTableStat(1,6).then(function(statType) {
          assert.equal(statType, "4");
        });         
      });          
    });

    test.describe('#SubSection: Scatter Plot', function() {
      test.before(function() {
        scatterPlotPage = new ScatterPlotPage(driver);
        filters.removeSelectionFromDropdownFilter("Seasons:");
        filters.addSelectionToDropdownFilter("Seasons:", 2013);
      });

      test.it('clicking the scatter_plot link goes to the correct URL', function() {
        playersPage.goToSubSection('Scatter Plot');
        driver.getCurrentUrl().then(function(url) {
          assert.match(url, /players\-scatter\-plot\-batting/);
        });
      });

      test.it('table should be populated on load', function() {
        scatterPlotPage.getTableStat(1,2).then(function(stat) {
          assert.isNotNull(stat);
        });
      });  

      test.it('changing the x-axis stat should update the table', function() {
        scatterPlotPage.changeXStat('BABIP');
        scatterPlotPage.getTableHeader(3).then(function(header) {
          assert.equal(header, 'BABIP');
        });
      });  

      test.it('changing the y-axis stat should update the table', function() {
        scatterPlotPage.changeYStat('HR%');
        scatterPlotPage.getTableHeader(4).then(function(header) {
          assert.equal(header, 'HR%');
        });      
      });        

      test.it('adding a global filter should update the table', function() {
        var originalHomeRunsPer;
        scatterPlotPage.getTableStat(1,4).then(function(homeRunsPer) {
          originalHomeRunsPer = homeRunsPer;
        });
        
        scatterPlotPage.addGlobalFilter('Day of Week: Sunday');
        scatterPlotPage.getTableStat(1,4).then(function(newHomeRunsPer) {
          assert.notEqual(newHomeRunsPer, originalHomeRunsPer);
        });            
      });        
    });
  });

  test.describe('#Section: Pitching', function() {
    test.before(function() {    
      statsPage = new StatsPage(driver, 'pitching');
      playersPage.goToSection("Pitching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2012);
      eraCol = 21;
      ksCol = 19;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by ERA ascending', function() {
          var playerOneERA, playerTwoERA, playerTenERA;

          
          statsPage.getTableStat(1,eraCol).then(function(stat) {
            playerOneERA = stat;
          });
            
          statsPage.getTableStat(2,eraCol).then(function(stat) {
            playerTwoERA = stat;
          });
            
          statsPage.getTableStat(10,eraCol).then(function(stat) {
            playerTenERA = stat;

            assert.isAtMost(playerOneERA, playerTwoERA, "player one's ERA is <= player two's ERA");
            assert.isAtMost(playerTwoERA, playerTenERA, "player two's ERA is <= player ten's ERA");
          });            
        });

        test.it('clicking on the ERA column header should reverse the sort', function() {
          var playerOneERA, playerTwoERA, playerTenERA;
          statsPage.clickTableColumnHeader(eraCol);

          statsPage.getTableStat(1,eraCol).then(function(stat) {
            playerOneERA = stat;
          });

          statsPage.getTableStat(2,eraCol).then(function(stat) {
            playerTwoERA = stat;
          });
            
          statsPage.getTableStat(10,eraCol).then(function(stat) {
            playerTenERA = stat;
            assert.isAtLeast(playerOneERA, playerTwoERA, "player one's ERA is >= player two's ERA");
            assert.isAtLeast(playerTwoERA, playerTenERA, "player two's ERA is >= player ten's ERA");
          });                      
        });

        test.it('clicking on the Ks column header should sort the table by Ks', function() {
          var playerOneKs, playerTwoKs, playerTenKs;
          statsPage.clickTableColumnHeader(ksCol);

          statsPage.getTableStat(1,ksCol).then(function(stat) {
            playerOneKs = stat;
          });

          statsPage.getTableStat(2,ksCol).then(function(stat) {
            playerTwoKs = stat;
          });

          statsPage.getTableStat(10,ksCol).then(function(stat) {
            playerTenKs = stat;
            assert.isAtLeast(playerOneKs, playerTwoKs, "player one's Ks is >= player two's Ks");
            assert.isAtLeast(playerTwoKs, playerTenKs, "player two's Ks is >= player ten's Ks");
          });            
        });        
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (Men On: On 1B) from dropdown displays correct data', function() {
          filters.addDropdownFilter('Men On: On 1B');

          statsPage.getTableStat(1, ksCol).then(function(ks) {
            assert.equal(ks, 68);
          });
        });

        test.it('adding filter: (Horizontal Location: Outer Half) from sidebar displays correct data', function() {
          filters.toggleSidebarFilter('Horizontal Location:', 'Outer Half', true);

          statsPage.getTableStat(1,ksCol).then(function(ks) {
            assert.equal(ks, 43);
          });
        });

        test.after(function() {
          filters.closeDropdownFilter('Men On');
          filters.closeDropdownFilter('Horizontal Location');
        });
      });  

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Rate', topStat: 0.206, statType: "BA", colNum: 9 },  
          { type: 'Counting', topStat: 147, statType: "H", colNum: 9 },  
          { type: 'Pitch Rates', topStat: "58.0%", statType: "InZone%", colNum: 13 },  
          { type: 'Pitch Counts', topStat: 1860, statType: "InZone#", colNum: 12 },  
          { type: 'Pitch Types', topStat: "65.2%", statType: "Fast%", colNum: 7 },  
          { type: 'Pitch Type Counts', topStat: 2123, statType: "Fast#", colNum: 7 },  
          { type: 'Pitch Locations', topStat: "58.0%", statType: "InZone%", colNum: 7 },  
          { type: 'Pitch Calls', topStat: 71.40, statType: "SLAA", colNum: 7 },  
          { type: 'Hit Types', topStat: 1.71, statType: "GB/FB", colNum: 6 },  
          { type: 'Hit Locations', topStat: "52.2%", statType: "HPull%", colNum: 10 },  
          { type: 'Home Runs', topStat: 9, statType: "HR", colNum: 7 },  
          { type: 'Movement', topStat: 91.3, statType: "Vel", colNum: 7 },  
          { type: 'Bids', topStat: 1, statType: "NH", colNum: 8 },  
          { type: 'Baserunning', topStat: "12.5%", statType: "SB%", colNum: 8 },  
          { type: 'Exit Data', topStat: 0.332, statType: "ExSLG%", colNum: 11 }
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeReport(report.type);  
            statsPage.getTableStat(1,report.colNum).then(function(stat) {
              assert(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Catching', function() {
    test.before(function() {    
      statsPage = new StatsPage(driver, 'catching');
      playersPage.goToSection("Catching");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2012);
      slaaCol = 7;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by SLAA descending', function() {
          var playerOneSLAA, playerTwoSLAA, playerTenSLAA;

          statsPage.getTableStat(1,slaaCol).then(function(stat) {
            playerOneSLAA = stat;
          });

          statsPage.getTableStat(2,slaaCol).then(function(stat) {
            playerTwoSLAA = stat;
          });
          
          statsPage.getTableStat(10,slaaCol).then(function(stat) {
            playerTenSLAA = stat;
            assert.isAtLeast(playerOneSLAA, playerTwoSLAA, "player one's SLAA is >= player two's SLAA");
            assert.isAtLeast(playerTwoSLAA, playerTenSLAA, "player two's SLAA is >= player ten's SLAA");
          });            
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Catcher Framing', topStat: 211.21, statType: "SLAA", colNum: 7 },  
          { type: 'Catcher Defense', topStat: 9.17, statType: "FldRAA", colNum: 10 },  
          { type: 'Catcher Opposing Batters', topStat: 4882, statType: "BF", colNum: 5 },  // Not sorted
          { type: 'Catcher Pitch Rates', topStat: "49.5%", statType: "InZoneMdl%", colNum: 8 },  
          { type: 'Catcher Pitch Counts', topStat: 209, statType: "StrkFrmd", colNum: 12 },
          { type: 'Pitching Counting', topStat: 19317, statType: "P", colNum: 6 },
          { type: 'Catcher Pitch Types', topStat: "47.4%", statType: "Fast%", colNum: 7 },
          { type: 'Catcher Pitch Type Rates', topStat: 6987, statType: "Fast#", colNum: 7 },
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeReport(report.type);  
            statsPage.getTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  });

  test.describe('#Section: Statcast Fielding', function() {
    test.before(function() {    
      statsPage = new StatsPage(driver, 'statcastFielding');
      playersPage.goToSection("Statcast Fielding");
      filters.removeSelectionFromDropdownFilter("Seasons:");
      filters.addSelectionToDropdownFilter("Seasons:", 2016);
      statCol = 10;
    });    

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by OFWAirOut% descending', function() {
          var playerOne, playerTwo, playerTen;
 
          statsPage.getTableStat(1,statCol).then(function(stat) {
            playerOne = stat;
          });

          statsPage.getTableStat(2,statCol).then(function(stat) {
            playerTwo = stat;
          });

          statsPage.getTableStat(10,statCol).then(function(stat) {
            playerTen = stat;
            assert.isAtLeast(playerOne, playerTwo, "player one's OFWAirOut% is >= player two's OFWAirOut%");
            assert.isAtLeast(playerTwo, playerTen, "player two's OFWAirOut% is >= player ten's OFWAirOut%");
          });            
        });
      });

      // Reports
      test.describe("#reports", function() {
        var reports = [
          { type: 'Outfielder Air Defense Positioning', topStat: '107.4%', statType: "OFWPosAirOut%", colNum: 7 },  
          { type: 'Outfielder Air Defense Skills', topStat: "71.0%", statType: "OFAirOut%", colNum: 7 },  
          { type: 'Outfield Batter Positioning', topStat: "97.2%", statType: "OFWPosAirOut%", colNum: 7 } 
        ];
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
            statsPage.changeReport(report.type);  
            statsPage.getTableStat(1,report.colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });        
      });
    });
  }); 
});