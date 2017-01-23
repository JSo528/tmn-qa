var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var PlayersPage = require('../../../pages/nfl/players/players_page.js');
var navbar, filters, playersPage;

test.describe('#Page: Players', function() {
  test.it('navigating to players page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playersPage = new PlayersPage(driver);
    navbar.goToPlayersPage();
  });

  test.describe('#Section: Stats', function() {
    test.describe("#table", function() {
      test.it('should initially be sorted by PsRt desc', function() {
        playersPage.getStatsTableStats(17).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by PsYds desc should display players in correct order', function() {
        playersPage.clickStatsTableHeader(12);
        playersPage.getStatsTableStats(12).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by PsYds asc should display players in correct order', function() {
        playersPage.clickStatsTableHeader(12);
        playersPage.getStatsTableStats(12).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('sorting by PsRt desc should display players in correct order', function() {
        playersPage.clickStatsTableHeader(17);
        playersPage.getStatsTableStats(17).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });
    });

    test.describe("#filters", function() {
      test.it('changing filter - (Season/Week: 2015 W1 to 2015 W17), shows correct stats', function() {
        filters.changeValuesForSeasonWeekDropdownFilter(2015, 'W1', 2015, 'W17', true);

        playersPage.getStatsTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Russell Wilson (QB-SEA)', '1st row - Player');
        });

        playersPage.getStatsTableStat(1,9).then(function(stat) {
          assert.equal(stat, 329, '1st row - Cmp');
        });
      });

      test.it('adding filter - (Distance To Goal: 0 to 20), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Distance To Goal:', 0, 20);

        playersPage.getStatsTableStat(1,12).then(function(stat) {
          assert.equal(stat, 169, '1st row - PsYds');
        });

        playersPage.getStatsTableStat(1,14).then(function(stat) {
          assert.equal(stat, 8, '1st row - PsTD');
        });
      });

      test.it('adding filter - (Score Diff: -7 to 7), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Score Diff:', -7, 7);

        playersPage.getStatsTableStat(1,10).then(function(stat) {
          assert.equal(stat, 18, '1st row - Att');
        });
      });

      test.it('adding filter - (Play Goal To Go: Yes), shows correct stats ', function() {
        filters.toggleSidebarFilter('Play Goal to Go:', 'Yes', true);
        playersPage.getStatsTableStat(1,13).then(function(stat) {
          assert.equal(stat, 6.00, '1st row - Yd/Att');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        playersPage.clickStatsTableStat(1,9);
        playersPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Colts Ball Starting At 3:21 At The IND 20');
        });
      });

      test.it('1st play in Play by Play modal should have the ball position info', function() {
        playersPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'NE 12');
        });
      });

      test.it('Flat View tab should be visible', function() {
        playersPage.isFlatViewTabVisible().then(function(visible) {
          assert.equal(visible, true);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        playersPage.clickByPossessionPlayVideoIcon(2);
        playersPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 3 NE 3");
        });
      });

      test.it('closing modals', function() {
        playersPage.closeVideoPlaylistModal();
        playersPage.closePlayByPlayModal();
      });
    });
  
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Andrew Luck should add him to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Andrew Luck (QB-IND)');
        });
      });

      test.it('selecting Aaron Rodgers from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        playersPage.addToIsoTable('Aaron Rodgers', 1)

        playersPage.getStatsTableStat(2,3).then(function(stat) {
          assert.equal(stat, ' Aaron Rodgers (QB-GB)', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 16, 'pinned total - Cmp');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, ' Andrew Luck (QB-IND)', '1st row player name');
        });
        playersPage.getIsoTableStat(2,3).then(function(stat) {
          assert.equal(stat, ' Aaron Rodgers (QB-GB)', '2nd row player name');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(17); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for players', function() {
        playersPage.hoverOverHistogramStack(1)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Sam Bradford: 51.6 (Eagles-QB)\nTeddy Bridgewater: 47.9 (Vikings-QB)\nAndy Dalton: 47.0 (Bengals-QB)\nNick Foles: 39.6 (Rams-QB)', 'tooltip for 1st bar');
        });
      });

      test.it('pinned players should be represented by circles', function() {
        playersPage.getHistogramCircleCount().then(function(count) {
          assert.equal(count, 2, '# of circles on histogram')
        })
      })

      test.it("selecting 'Display pins as bars' should add players to the histogram", function() {
        playersPage.toggleHistogramDisplayPinsAsBars();
        playersPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 14, '# of bars on histogram');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        playersPage.changeHistogramBinCount(3);
        playersPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,17);

        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        playersPage.clearTablePins();
      });   
    });

    test.describe("#groupBy", function() {
      test.it('remove filters', function() {
        filters.closeDropdownFilter('Distance To Goal');
        filters.closeDropdownFilter('Score Diff');
        filters.closeDropdownFilter('Play Goal to Go');
      });

      test.it('selecting "By Season" shows the correct headers', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Season");
        });

        playersPage.getStatsTableStat(1,18).then(function(stat) {
          assert.equal(stat, 110.1, 'Player 1 - PsrRt');
        });
      });

      test.it('selecting "By Game" shows the correct headers', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Opponent");
        });          

        playersPage.getStatsTableStat(1,12).then(function(stat) {
          assert.equal(stat, 18, 'Game 1 - Cmp');
        });
      });        

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      });      
    });

    test.describe("#statsView", function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Rank', topStat: 1, color: true, col: 16 },            
        { type: 'Percentile', topStat: "100.0%", color: true, col: 16 },
        { type: 'Z-Score', topStat: 1.933, col: 16 },
        { type: 'Stat Grade', topStat: 80, col: 16 },
        { type: 'Stat (Rank)', topStat: "110.1 (1)", color: true, col: 16 },
        { type: 'Stat (Percentile)', topStat: "110.1 (100%)", color: true, col: 16 },
        { type: 'Stat (Z-Score)', topStat: "110.1 (1.93)", col: 16 },
        { type: 'Stat (Stat Grade)', topStat: "110.1 (80)", col: 16 },
        { type: 'Per Game', topStat: 110.1, col: 17 },
        { type: 'Per Team Game', topStat: 110.1, col: 17 },
        { type: 'Pct of Team', topStat: 110.1, col: 17 },
        { type: 'Pct of Team on Field', topStat: 110.1, col: 17 },
        { type: 'Team Stats', topStat: 110.1, col: 17 },
        { type: 'Team Stats on Field', topStat: 110.1, col: 17 },
        { type: 'Stats', topStat: 110.1, col: 17 }
      ];
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value for PsrRt", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getStatsTableStat(1,statView.col).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getStatsTableBgColor(1,statView.col).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Offensive Plays', topStat: 45, statType: "OffTD", colNum: 5 },  
        { type: 'QB Stats (Adv)', topStat: 110.1, statType: "PsrRt", colNum: 18 },  
        { type: 'Passing Rates', topStat: 110.1, statType: "PsrRt", colNum: 6 },  
        { type: 'Passing Rates (Adv)', topStat: 8.70, statType: "Yd/Att", colNum: 6 },  
        { type: 'Rushing', topStat: 1485, statType: "RnYds", colNum: 5 },  
        { type: 'Receptions', topStat: 1871, statType: "RecYds", colNum: 6 },  
        { type: 'From Scrimmage', topStat: 1871, statType: "ScrYds", colNum: 7 },  
        { type: 'Rushing Receiving', topStat: 1871, statType: "ScrYds", colNum: 7 },  
        { type: 'Touchdowns', topStat: 45, statType: "TD", colNum: 5 },  
        { type: 'Defensive Stats', topStat: 154, statType: "DfTkl", colNum: 5 },  
        { type: 'FG / XP / 2Pt', topStat: 34, statType: "FG", colNum: 5 },  
        { type: 'Kickoffs', topStat: 89.0, statType: "OpKRSP", colNum: 8 }, 
        { type: 'Punts', topStat: 96, statType: "P", colNum: 5 }, 
        { type: 'Returns', topStat: 1077, statType: "K-Ryd", colNum: 6 }, 
            { type: 'QB Stats', topStat: 110.1, statType: "PsrRt", colNum: 17 },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          playersPage.changeReport(report.type);  
          playersPage.getStatsTableStat(1,report.colNum).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });

    test.describe("#exports", function() {
      test.it('clicking export button', function() {
        playersPage.clickStatsExportLink();
      });

      test.it('csv file should have the correct data', function() {
        var exportFileContents = 'Rank,dateOfBirth,pos,player,teamAbbrev,G,QBWin,QBLoss,QBTie,QBWin%,Cmp,Att,Comp%,PsYds,Yd/Att,PsTD,Int,TD/Int,PsrRt,Sack,PsLg,Ps1st/n1,1988-11-29,QB,Russell Wilson,SEA,16,10,6,0,.625,329,483,68.1%,4024,8.33,34,8,4.25,110.1,45,80,187/n2,1987-10-29,QB,Andy Dalton,CIN,13,10,3,0,.769,255,386,66.1%,3250,8.42,25,7,3.57,106.3,20,80,147/n3,1979-12-27,QB,Carson Palmer,ARI,16,13,3,0,.813,342,537,63.7%,4671,8.70,35,11,3.18,104.6,25,68,231/n4,1977-08-03,QB,Tom Brady,NE,16,12,4,0,.750,402,624,64.4%,4770,7.64,36,7,5.14,102.2,38,76,228/n5,1988-08-19,QB,Kirk Cousins,WAS,16,9,7,0,.563,379,543,69.8%,4166,7.67,29,11,2.64,101.6,26,78,204/n6,1979-01-15,QB,Drew Brees,NO,15,7,8,0,.467,428,627,68.3%,4870,7.77,32,11,2.91,101.0,31,80,228/n7,1989-08-03,QB,Tyrod Taylor,BUF,14,7,6,0,.538,242,380,63.7%,3035,7.99,20,6,3.33,99.4,36,63,129/n8,1989-05-11,QB,Cam Newton,CAR,16,15,1,0,.938,296,495,59.8%,3837,7.75,35,10,3.50,99.4,33,74,195/n9,1988-02-07,QB,Matthew Stafford,DET,16,7,9,0,.438,398,592,67.2%,4262,7.20,32,13,2.46,97.0,44,57,223/n10,1984-05-07,QB,Alex Smith,KC,16,11,5,0,.688,307,470,65.3%,3486,7.42,20,7,2.86,95.4,45,80,154/n11,1982-03-02,QB,Ben Roethlisberger,PIT,12,7,4,0,.636,319,469,68.0%,3938,8.40,21,16,1.31,94.5,20,69,174/n12,1981-12-08,QB,Philip Rivers,SD,16,4,12,0,.250,437,661,66.1%,4792,7.25,29,13,2.23,93.8,40,80,226/n13,1981-01-03,QB,Eli Manning,NYG,16,6,10,0,.375,387,618,62.6%,4432,7.17,35,14,2.50,93.6,27,87,204/n14,1979-07-04,QB,Josh McCown,CLE,8,1,7,0,.125,186,292,63.7%,2109,7.22,12,4,3.00,93.3,23,56,96/n15,1983-12-02,QB,Aaron Rodgers,GB,16,10,6,0,.625,347,572,60.7%,3821,6.68,31,8,3.88,92.7,46,65,173/n16,1983-04-29,QB,Jay Cutler,CHI,15,6,9,0,.400,311,483,64.4%,3659,7.58,21,11,1.91,92.3,29,87,171/n17,1993-10-30,QB,Marcus Mariota,TEN,12,3,9,0,.250,230,370,62.2%,2818,7.62,19,10,1.90,91.5,38,61,142/n18,1985-10-13,QB,Brian Hoyer,HOU,11,5,4,0,.556,224,369,60.7%,2606,7.06,19,7,2.71,91.4,25,49,130/n19,1991-03-28,QB,Derek Carr,OAK,16,7,9,0,.438,350,573,61.1%,3987,6.96,32,13,2.46,91.1,31,68,183/n20,1985-05-17,QB,Matt Ryan,ATL,16,8,8,0,.500,407,614,66.3%,4591,7.48,21,16,1.31,89.0,30,70,229/n21,1988-07-27,QB,Ryan Tannehill,MIA,16,6,10,0,.375,363,586,61.9%,4208,7.18,24,12,2.00,88.7,45,54,193/n22,1992-11-10,QB,Teddy Bridgewater,MIN,16,11,5,0,.688,292,447,65.3%,3231,7.23,14,9,1.56,88.7,44,52,153/n23,1992-04-28,QB,Blake Bortles,JAC,16,5,11,0,.313,355,606,58.6%,4428,7.31,35,18,1.94,88.2,51,90,215/n24,1982-11-24,QB,Ryan Fitzpatrick,NYJ,16,10,6,0,.625,335,562,59.6%,3905,6.95,31,15,2.07,88.0,19,69,196/n25,1990-11-22,QB,Brock Osweiler,DEN,8,5,2,0,.714,170,275,61.8%,1967,7.15,10,6,1.67,86.4,23,72,91/n26,1987-11-08,QB,Sam Bradford,PHI,14,7,7,0,.500,346,532,65.0%,3725,7.00,19,14,1.36,86.4,28,78,164/n27,1989-10-15,QB,Blaine Gabbert,SF,8,3,5,0,.375,178,282,63.1%,2031,7.20,10,7,1.43,86.2,25,71,83/n28,1994-01-06,QB,Jameis Winston,TB,16,6,10,0,.375,312,535,58.3%,4042,7.56,22,15,1.47,84.2,27,68,201/n29,1975-09-25,QB,Matt Hasselbeck,IND,8,5,3,0,.625,156,256,60.9%,1690,6.60,9,5,1.80,84.0,16,57,85/n30,1985-01-16,QB,Joe Flacco,BAL,10,3,7,0,.300,266,413,64.4%,2791,6.76,14,12,1.17,83.1,16,50,123/n31,1987-11-03,QB,Colin Kaepernick,SF,9,2,6,0,.250,144,244,59.0%,1615,6.62,6,5,1.20,78.5,28,76,71/n32,1989-09-12,QB,Andrew Luck,IND,7,2,5,0,.286,162,293,55.3%,1881,6.42,15,12,1.25,74.9,15,87,90/n33,1989-01-20,QB,Nick Foles,STL,11,4,7,0,.364,190,337,56.4%,2052,6.09,7,10,0.70,69.0,14,68,82/n34,1988-06-05,QB,Ryan Mallett,BAL,8,2,4,0,.333,136,244,55.7%,1336,5.48,5,6,0.83,67.9,6,48,76/n35,1976-03-24,QB,Peyton Manning,DEN,10,7,2,0,.778,198,331,59.8%,2249,6.79,9,17,0.53,67.9,16,75,110/n';
        return playersPage.readAndDeleteExportCSV().then(function(data) {
          assert.equal(data, exportFileContents);
        });
      });
    });
  });  
});