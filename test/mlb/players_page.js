var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/mlb/navbar.js');
var PlayersPage = require('../../pages/mlb/players_page.js');
var StatsPage = require('../../pages/mlb/players/stats_page.js');
var StreaksPage = require('../../pages/mlb/players/streaks_page.js');
var ScatterPlotPage = require('../../pages/mlb/players/scatter_plot_page.js');
var navbar, playersPage, statsPage, streaksPage, scatterPlotPage;

test.describe('#Players Page', function() {
  test.before(function() {  
    navbar  = new Navbar(driver);  
    playersPage = new PlayersPage(driver);
    statsPage = new StatsPage(driver);
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
        battingAverageCol = 8;
        kPerCol = 13;
        statsPage.closeDropdownFilter(3); // close year filter
        statsPage.toggleSidebarFilter('Seasons', 7) // 2014
      });

      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by BA descending', function() {
          var playerOneBA, playerTwoBA, playerTenBA;
          statsPage.getPlayerTableStat(1,battingAverageCol).then(function(stat) {
            playerOneBA = stat;
          });

          statsPage.getPlayerTableStat(2,battingAverageCol).then(function(stat) {
            playerTwoBA = stat;
          });

          statsPage.getPlayerTableStat(10,battingAverageCol).then(function(stat) {
            playerTenBA = stat;

            assert.isAtLeast(playerOneBA, playerTwoBA, "player 1's BA is >= player 2's BA");
            assert.isAtLeast(playerTwoBA, playerTenBA, "player 2's BA is >= player 10's BA");
          });            
        });

        test.it('clicking on the BA column header should reverse the sort', function() {
          var playerOneBA, teamTwoBA, teamTenBA;
          statsPage.clickPlayerTableColumnHeader(battingAverageCol);
          statsPage.getPlayerTableStat(1,battingAverageCol).then(function(stat) {
            playerOneBA = stat;
          });

          statsPage.getPlayerTableStat(2,battingAverageCol).then(function(stat) {
            playerTwoBA = stat;
          });

          statsPage.getPlayerTableStat(10,battingAverageCol).then(function(stat) {
            playerTenBA = stat;

            assert.isAtMost(playerOneBA, playerTwoBA, "player 1's BA is <= player 2's BA");
            assert.isAtMost(playerTwoBA, playerTenBA, "player 2's BA is <= player 10's BA");
          });
        });

        test.it('clicking on the K% column header should sort the table by K% ascending', function() {
          var p1, p2, p10;
          statsPage.clickPlayerTableColumnHeader(kPerCol);
          statsPage.getPlayerTableStat(1,kPerCol).then(function(stat) {
            p1 = parseFloat(stat); // 11.1% becomes 0.111
          });

          statsPage.getPlayerTableStat(2,kPerCol).then(function(stat) {
            p2 = parseFloat(stat);
          });

          statsPage.getPlayerTableStat(10,kPerCol).then(function(stat) {
            p10 = parseFloat(stat);
            assert.isAtMost(p1, p2, "player 1's k% is <= player 2's k%");
            assert.isAtMost(p2, p10, "player 2's k% is <= player 10's k%");
          });
        });  

        test.after(function() {
          statsPage.clickPlayerTableColumnHeader(battingAverageCol);
        });    
      });

      // Filters
      test.describe("#filters", function() {
        test.it('adding filter: (extra inning game) from dropdown displays correct data', function() {
          statsPage.addDropdownFilter('Extra Inning Game');


          statsPage.getPlayerTableStat(1,9).then(function(onBasePercentage) {
            assert.equal(onBasePercentage, 0.486);
          });
        });

        test.it('adding filter: (Batted ball: Fly ball) from sidebar displays correct data', function() {
          statsPage.toggleSidebarFilter('Batted Ball:', 3); // fly ball

          statsPage.getPlayerTableStat(1,17).then(function(runsPerGame) {
            assert.equal(runsPerGame, 0.250);
          });
        });
      }); 

      // Pinning
      test.describe("#pinning", function() {
        test.it('clicking the pin icon for Corey Dickerson should add him to the pinned table', function() {
          var playerName;
          statsPage.getPlayerTableStat(1,3).then(function(name) {
            playerName = name;
          });

          statsPage.clickPlayerTablePin(1);

          statsPage.getIsoTableStat(1,3).then(function(name) {
            assert.equal(name, playerName);
          })
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
          statsPage.closeDropdownFilter(5); // close flyball filter
          statsPage.closeDropdownFilter(4); // close extra innings filter
          statsPage.changeGroupBy("Total"); // change back to group by total
        })
      });

      // Stats View
      test.describe("#stats view", function() {
        test.before(function() {
          statsPage.toggleSidebarFilter('Zone Location', 2) // Out of Strike Zone
        });

        // Comparing top BA in 2015 for all the different stat views
        var topColor = "rgba(108, 223, 118, 1)"
        var statViews = [
          { type: 'Stat', topStat: .289 },  
          { type: 'Rank', topStat: 1, color: true },            
          { type: 'Percentile', topStat: "100.0%", color: true },
          { type: 'Z-Score', topStat: 2.425 },
          { type: 'Stat Grade', topStat: 80 },
          { type: 'Stat (Rank)', topStat: ".289 (1)", color: true },
          { type: 'Stat (Percentile)', topStat: ".289 (100%)", color: true },
          { type: 'Stat (Z-Score)', topStat: ".289 (2.43)"},
          { type: 'Stat (Stat Grade)', topStat: ".289 (80)"},
          { type: 'Pct of Team', topStat: ".289"},
        ]
        statViews.forEach(function(statView) {
          test.it("selecting " + statView.type + " shows the correct stat value", function() {
            statsPage.changeStatsView(statView.type);  
            statsPage.getPlayerTableStat(1,8).then(function(stat) {
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
          statsPage.toggleSidebarFilter('Zone Location', 2) // Remove filter
          statsPage.changeStatsView('Stat') // Remove Stats View
        })
      });      

      // Qualify By
      test.describe("#qualify by", function() {
        test.it("selecting All shows all players", function() {
          statsPage.changeQualifyBy("All");
          statsPage.getPlayerTableStat(1,4).then(function(games) {
            assert.equal(games, 27);
          });

          statsPage.getPlayerTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 1.000);
          });          
        })

        test.it("selecting Custom shows correct subset of players", function() {
          statsPage.changeQualifyBy("Custom", "Atbats", 50);
          statsPage.clickPlayerTableColumnHeader(7); // sort AB's descending
          statsPage.clickPlayerTableColumnHeader(7); // sort AB's ascending
          statsPage.getPlayerTableStat(1,7).then(function(atBats) {
            assert.equal(atBats, 50);
          });

          statsPage.getPlayerTableStat(1,8).then(function(battingAverage) {
            assert.equal(battingAverage, 0.060);
          });          
        })        

        test.after(function() {
          statsPage.changeQualifyBy("Default");
          statsPage.clickPlayerTableColumnHeader(8); // sort BA's descending
        })
      })

      // Batting Reports
      test.describe("#batting reports", function() {
        test.before(function() {
          statsPage.toggleSidebarFilter('Horizontal Location', 2) // Middle Third
        })

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
        ]
        reports.forEach(function(report) {
          test.it("selecting " + report.type + " shows the correct stat value", function() {
            var colNum = report.colNum || 12
            var rowNum = report.rowNum || 1
            statsPage.changeBattingReport(report.type);  
            statsPage.getPlayerTableStat(rowNum, colNum).then(function(stat) {
              assert.equal(stat, report.topStat);
            });
          });
        });
      });                      
    })

    test.describe('#SubSection: Occurences & Streaks', function() {
      test.before(function() {
        streaksPage = new StreaksPage(driver);
        statsPage.closeDropdownFilter(3); // close year filter
        statsPage.toggleSidebarFilter('Seasons', 6) // 2013
      });

      test.it('clicking the occurences & streaks link goes to the correct URL', function() {
        playersPage.goToSubSection('Occurences & Streaks');
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
        statsPage.closeDropdownFilter(3); // close year filter
        statsPage.toggleSidebarFilter('Seasons', 6) // 2013
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

      test.it('adding a x-axis filter should update the table', function() {
        scatterPlotPage.openXAxisFilterContainer();
        var originalBABIP;
        scatterPlotPage.getTableStat(1,3).then(function(babip) {
          originalBABIP = babip;
        });
        
        scatterPlotPage.addXFilter('Batting Order: 1');
        scatterPlotPage.getTableStat(1,3).then(function(newBABIP) {
          assert.notEqual(newBABIP, originalBABIP);
        });           
      });              

      test.it('adding a y-axis filter should update the table', function() {
        scatterPlotPage.openYAxisFilterContainer();
        var originalHomeRunsPer;
        scatterPlotPage.getTableStat(1,4).then(function(homeRunsPer) {
          originalHomeRunsPer = homeRunsPer;
        });
        
        scatterPlotPage.addYFilter('Batted Ball Location: Left');
        scatterPlotPage.getTableStat(1,4).then(function(newHomeRunsPer) {
          assert.notEqual(newHomeRunsPer, originalHomeRunsPer);
        });       
      }); 
    });
  })

 test.describe('#Section: Pitching', function() {
    test.before(function() {    
      teamsPage.goToSection("Pitching");
      statsPage.closeDropdownFilter(3); // close year filter
      statsPage.toggleSidebarFilter('Seasons', 5) // 2012

      eraCol = 21;
      whipCol = 22;
    });

    test.describe('#SubSection: Stats', function() {
      // Sorting
      test.describe("#sorting", function() {
        test.it('should be sorted initially by ERA descending', function() {
          var teamOneERA, teamTwoERA, teamTenERA;

          
          statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
            teamOneERA = stat;
          });
            
          statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
            teamTwoERA = stat;
          });
            
          statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
            teamTenERA = stat;

            assert.isAtLeast(teamOneERA, teamTwoERA, "team one's ERA is <= team two's ERA");
            assert.isAtLeast(teamTwoERA, teamTenERA, "team two's ERA is <= team ten's ERA");
          })            
        });

        test.it('clicking on the ERA column header should reverse the sort', function() {
          var teamOneERA, teamTwoERA, teamTenERA;
          statsPage.clickTeamTableColumnHeader(eraCol);

          Promise.all([
            statsPage.getTeamTableStat(1,eraCol).then(function(stat) {
              teamOneERA = stat;
            }),
            statsPage.getTeamTableStat(2,eraCol).then(function(stat) {
              teamTwoERA = stat;
            }),
            statsPage.getTeamTableStat(10,eraCol).then(function(stat) {
              teamTenERA = stat;
            })            
          ]).then(function() {
            assert.isAtMost(teamOneERA, teamTwoERA, "team one's ERA is >= team two's ERA");
            assert.isAtMost(teamTwoERA, teamTenERA, "team two's ERA is >= team ten's ERA");
          });          
        });

        test.it('clicking on the W column header should sort the table by Wins', function() {
          var teamOneKs, teamTwoKs, teamTenKs;
          statsPage.clickTeamTableColumnHeader(ksCol);

          Promise.all([
            statsPage.getTeamTableStat(1,ksCol).then(function(stat) {
              teamOneKs = stat;
            }),
            statsPage.getTeamTableStat(2,ksCol).then(function(stat) {
              teamTwoKs = stat;
            }),
            statsPage.getTeamTableStat(10,ksCol).then(function(stat) {
              teamTenKs = stat;
            })            
          ]).then(function() {
            assert.isAtMost(teamOneKs, teamTwoKs, "team one's Ks is >= team two's Ks");
            assert.isAtMost(teamTwoKs, teamTenKs, "team two's Ks is >= team ten's Ks");
          });          
        });  

        test.after(function() {
          statsPage.clickTeamTableColumnHeader(eraCol);
        });        
      });

//       // Filters
//       test.describe("#filters", function() {
//         test.before(function() {
//           statsPage.clickTeamTableColumnHeader(ksCol);
//         });

//         // TODO - make sure to use a previous year
//         test.it('adding filter: (venue - home) from dropdown displays correct data', function() {
//           statsPage.addDropdownFilter('Venue: Home');

//           statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
//             assert.equal(ks, 786);
//           });
//         });

//         test.it('adding filter: (Pitch Type: Changeup) from sidebar displays correct data', function() {
//           statsPage.toggleSidebarFilter('Pitch Type:', 3);

//           statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
//             assert.equal(ks, 118);
//           });
//         });

//         test.it('removing filter: (Pitch Type: Changeup) from top section displays correct data', function() {
//           statsPage.closeDropdownFilter(5);
//           statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
//             assert.equal(ks, 786);
//           });
//         }); 

//         test.it('removing filter: (venue - home) from sidebar displays correct data', function() {
//           statsPage.toggleSidebarFilter("Venue:", 1);
//           statsPage.getTeamTableStat(1,ksCol).then(function(ks) {
//             assert.equal(ks, 1510);
//           });
//         });         
//       });  

//       // Reports
//       test.describe("#reports", function() {
//         test.before(function() {
//           // Changes the season to 2015
//           // TODO - more robust solution since thise will break in future years
//           statsPage.toggleSidebarFilter("Seasons:", 7);
//           statsPage.toggleSidebarFilter("Seasons:", 8);
//         })

//         var reports = [
//           { type: 'Rate', topStat: .233, statType: "BA", colNum: 9 },  
//           { type: 'Counting', topStat: 1274, statType: "H", colNum: 9 },  
//           { type: 'Pitch Rates', topStat: "52.5%", statType: "InZone%", colNum: 13 },  
//           { type: 'Pitch Counts', topStat: 12393, statType: "InZone#", colNum: 12 },  
//           { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
//           { type: 'Pitch Type Counts', topStat: 13657, statType: "Fast#", colNum: 7 },  
//           { type: 'Pitch Locations', topStat: "52.5%", statType: "InZone%", colNum: 7 },  
//           { type: 'Pitch Calls', topStat: 336.90, statType: "SLAA", colNum: 7 },  
//           { type: 'Hit Types', topStat: 1.10, statType: "GB/FB", colNum: 6 },  
//           { type: 'Hit Locations', topStat: "43.4%", statType: "HPull%", colNum: 10 },  
//           { type: 'Home Runs', topStat: 110, statType: "HR", colNum: 7 },  
//           { type: 'Movement', topStat: 90.3, statType: "Vel", colNum: 7 },  
//           { type: 'Bids', topStat: 2, statType: "NH", colNum: 8 },  
//           { type: 'Baserunning', topStat: "60.4%", statType: "SB%", colNum: 8 },  
//           { type: 'Exit Data', topStat: .367, statType: "ExSLG%", colNum: 11 }
//         ]
//         reports.forEach(function(report) {
//           test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
//             statsPage.changePitchingReport(report.type);  
//             statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
//               assert(stat, report.topStat);
//             });
//           });
//         });        
//       });
    });
  });



})


//  


//   test.describe('#Section: Catching', function() {
//     test.before(function() {    
//       teamsPage.goToSection("Catching");
//       slaaCol = 7;
//     });

//     test.describe('#SubSection: Stats', function() {
//       // Sorting
//       test.describe("#sorting", function() {
//         test.it('should be sorted initially by SLAA descending', function() {
//           var teamOneSLAA, teamTwoSLAA, teamTenSLAA;

//           Promise.all([
//             statsPage.getTeamTableStat(1,slaaCol).then(function(stat) {
//               teamOneSLAA = stat;
//             }),
//             statsPage.getTeamTableStat(2,slaaCol).then(function(stat) {
//               teamTwoSLAA = stat;
//             }),
//             statsPage.getTeamTableStat(10,slaaCol).then(function(stat) {
//               teamTenSLAA = stat;
//             })            
//           ]).then(function() {
//             assert.isAtLeast(teamOneSLAA, teamTwoSLAA, "team one's SLAA is >= team two's SLAA");
//             assert.isAtLeast(teamTwoSLAA, teamTenSLAA, "team two's SLAA is >= team ten's SLAA");
//           });
//         });
//       });

//       // Reports
//       test.describe("#reports", function() {
//         test.before(function() {
//           // Changes the season to 2015
//           // TODO - more robust solution since thise will break in future years
//           statsPage.toggleSidebarFilter("Seasons:", 7);
//           statsPage.toggleSidebarFilter("Seasons:", 8);
//         })

//         var reports = [
//           { type: 'Pitch Types', topStat: "60.0%", statType: "Fast%", colNum: 7 },  
//           { type: 'Pitch Type Counts', topStat: 13657, statType: "Fast#", colNum: 7 },  
//           { type: 'Catcher Defense', topStat: 10.27, statType: "FldRAA", colNum: 10 },  
//           // { type: 'Catcher Opposing Batters', topStat: 1274, statType: "H", colNum: 9 },  // No Data
//           { type: 'Catcher Pitch Rates', topStat: "49.2%", statType: "InZoneMdl%", colNum: 8 },  
//           { type: 'Catcher Pitch Counts', topStat: 351, statType: "StrkFrmd", colNum: 12 }
//         ]
//         reports.forEach(function(report) {
//           test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
//             statsPage.changeCatchingReport(report.type);  
//             statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
//               assert(stat, report.topStat);
//             });
//           });
//         });        
//       });
//     });
//   });

//   test.describe('#Section: Statcast Fielding', function() {
//     test.before(function() {    
//       teamsPage.goToSection("Statcast Fielding");
//       statCol = 10;
//     });    

//     test.describe('#SubSection: Stats', function() {
//       // Sorting
//       test.describe("#sorting", function() {
//         test.it('should be sorted initially by OFWAirOut% descending', function() {
//           var teamOne, teamTwo, teamTen;

//           Promise.all([
//             statsPage.getTeamTableStat(1,statCol).then(function(stat) {
//               teamOne = stat;
//             }),
//             statsPage.getTeamTableStat(2,statCol).then(function(stat) {
//               teamTwo = stat;
//             }),
//             statsPage.getTeamTableStat(10,statCol).then(function(stat) {
//               teamTen = stat;
//             })            
//           ]).then(function() {
//             assert.isAtLeast(teamOne, teamTwo, "team one's OFWAirOut% is >= team two's OFWAirOut%");
//             assert.isAtLeast(teamTwo, teamTen, "team two's OFWAirOut% is >= team ten's OFWAirOut%");
//           });
//         });
//       });

//       // Reports
//       test.describe("#reports", function() {
//         test.before(function() {
//           // Changes the season to 2015
//           // TODO - more robust solution since thise will break in future years
//           statsPage.toggleSidebarFilter("Seasons:", 7);
//           statsPage.toggleSidebarFilter("Seasons:", 8);
//         })

//         var reports = [
//           { type: 'Outfielder Air Defense Positioning', topStat: 104.2, statType: "OFWPosAirOut%", colNum: 7 },  
//           { type: 'Outfielder Air Defense Skills', topStat: "65.1%", statType: "OFAirOut%", colNum: 7 },  
//           { type: 'Outfield Batter Positioning', topStat: ">99.9%", statType: "OFWPosAirOut%", colNum: 7 } 
//         ]
//         reports.forEach(function(report) {
//           test.it("selecting " + report.type + " shows the correct stat value for " + report.statType, function() {
//             statsPage.changeStatcastFieldingReport(report.type);  
//             statsPage.getTeamTableStat(1,report.colNum).then(function(stat) {
//               assert(stat, report.topStat);
//             });
//           });
//         });        
//       });
//     });
//   });
// });