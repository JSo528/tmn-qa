var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/soccer/navbar.js');
var Filters = require('../../../pages/soccer/filters.js');
var playersPage = require('../../../pages/soccer/players/players_page.js');
var navbar, filters, playersPage;

test.describe('#Section: Players', function() {
  test.it('navigating to players page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playersPage = new playersPage(driver);
    
    navbar.goToPlayersPage();
    filters.removeSelectionFromDropdownFilter('Season:');
    filters.addSelectionToDropdownFilter('Season:', 'Premier League 2015/2016 (England)');
  });

  test.describe("#Page: Summary", function() {  
    test.describe('#reports', function() {
      test.describe('#createReport', function() {
        test.it('clicking create report btn opens custom report modal', function() {
          playersPage.clickCreateReportBtn();
          playersPage.changeReportName('Players Test');
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('adding stat adds column to preview table', function() {
          playersPage.addStatToCustomReport('[CrossCmp]', '');
          playersPage.isCustomReportColumnDisplayed('CrossCmp').then(function(displayed) {
            assert.equal(displayed, true, 'CrossCmp column should exist');
          });
        });

        test.it('removing stat removes column from preview table', function() {
          playersPage.removeStatFromCustomReport('[OnTarget%]');
          playersPage.isCustomReportColumnDisplayed('OnTarget%').then(function(displayed) {
            assert.equal(displayed, false, 'OnTarget% column should exist');
          });
        });

        test.it('changing stat alias changes column in preview table', function() {
          playersPage.changeStatInCustomReport('[PsAtt]', null, 'PAtt');
          playersPage.isCustomReportColumnDisplayed('PsAtt').then(function(displayed) {
            assert.equal(displayed, false, 'PsAtt column should not exist');
          });
          playersPage.isCustomReportColumnDisplayed('PAtt').then(function(displayed) {
            assert.equal(displayed, true, 'PAtt column should exist');
          });          
        });

        test.it('changing stat manually changes column in preview table', function() {
          playersPage.changeStatInCustomReport('[Ast]', '[Goal]', '');
          playersPage.isCustomReportColumnDisplayed('Ast').then(function(displayed) {
            assert.equal(displayed, false, 'Ast column should not exist');
          });
          playersPage.isCustomReportColumnDisplayed('Goal').then(function(displayed) {
            assert.equal(displayed, true, 'Goal column should exist');
          });
        });

        test.it('changing sort column column updates preview table', function() {
          playersPage.changeSortColumnInCustomReport('[Recovery]');
          playersPage.getCustomReportPreviewTableStatsFor('Recovery').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'desc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('changing sort order column updates preview table', function() {
          playersPage.changeSortOrderInCustomReport('OPPOSITE');
          playersPage.getCustomReportPreviewTableStatsFor('Recovery').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'asc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('adding filter updates preview table', function() {
          playersPage.addFilterToCustomReport('Starter: Starter');
          playersPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 20, 'player 1 shots');
          });
        });

        test.it('removing filter updates preview table', function() {
          playersPage.removeFilterFromCustomReport('Starter');
          playersPage.getCustomReportPreviewTableStatFor(1, 'Touches').then(function(stat) {
            assert.equal(stat, 2580, 'player 1 touches (I Gueye)');
          });
        });

        test.it('pressing save button closes modal', function() {
          playersPage.clickSaveCustomReportButton();
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('closing modal if necessary', function() {
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) playersPage.clickCloseCustomReportButton();
          });
        });

        test.it('saving report sets it to current report', function() {
          playersPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Players Test');
          });
        });

        test.it('table stats show correct data for Goal', function() {
          playersPage.getTableStatsFor('Goal').then(function(stats) {
            assert.deepEqual(stats, ['0','2','1','1','0','1','1','5','1','5','0','0','0','7','0','0','11','2','5','1','4','3','4','17','2','5','0','2','1','2','2','1','3','0','4','0','1','2','2','5','0','6','0','1','1','2','0','3','0','8','6','11','3','11','1','0','2','5','10','1','1','2','4','2','1','2','0','0','1','5','2','2','5','3','2','4','1','6','4','1','1','1','0','6','1','2','1','0','3','3','7','4','2','0','0','3','2','0','4','9','3','6','1','4','13','0','0','12','0','5','0','10','1','0','0','2','0','1','1','2','2','0','1','1','11','7','0','0','13','8','8','0','0','2','0','2','1','3','8','2','2','4','0','0','7','1','0','15','3','3','1','0','0','0','6','7','0','0','0','6','2','2','2','25','3','2','1','1','0','1','3','1','0','0','1','11','0','2','3','0','6','2','7','0','24','0','0','1','1','4','5','1','24','6','1','2','2','0','9','1']);
          });
        });
      });

      test.describe('#editReport', function() {
        test.it('clicking edit report btn opens custom report modal', function() {
          playersPage.clickEditReportBtn();
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('changing report name', function() {
          playersPage.changeReportName('Players Test2');
        });

        test.it('pressing save button closes modal', function() {
          playersPage.clickSaveCustomReportButton();
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('close modal if neccessary', function() {
          playersPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) playersPage.clickCloseCustomReportButton();
          });
        });


        test.it('saving report sets it to current report', function() {
          playersPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Players Test2');
          });
        });    
      });

      test.describe('#deleteReport', function() {
        test.it('clicking delete report removes report & sets default as the current report', function() {
          playersPage.getCurrentReport().then(function(reportName) {
            if (reportName == 'Players Test2') {
              playersPage.clickDeleteReportBtn();
              playersPage.getCurrentReport().then(function(stat) {
                assert.equal(stat, 'default');
              });
            };
          });
        });
      });
    });    

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'PsAtt', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Recovery', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Duel%', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });

    test.describe("#filters", function() {
      test.it('sorting by touches & filtering to 2015/2016 season', function() {
        playersPage.clickTableHeaderFor('Touches');
        filters.removeSelectionFromDropdownFilter('Season:');
        filters.addSelectionToDropdownFilter('Season:', 'Premier League 2015/2016 (England)');
      });

      test.it('adding filter - (Pass Result: big chance created), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Pass Result:', 'big chance created');

        playersPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 26, '1st row - Touches');
        });

        playersPage.getTableStatFor(1,'PsAtt').then(function(stat) {
          assert.equal(stat, 16, '1st row - PsAtt');
        });
      });

      test.it('adding filter - (Pass Style: cross), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Pass Style:', 'cross');

        playersPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 10, '1st row - Touches');
        });

        playersPage.getTableStatFor(1, 'Chance').then(function(stat) {
          assert.equal(stat, 10, '1st row - Chance');
        });
      });
    });
  
    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'Touches');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-10-24', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
          assert.equal(stat, 'P1-35:34', 'row 1 period clock')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
          assert.equal(stat, 'Francis Coquelin', '1st row player');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '35:29', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 13);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 13);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Clearance by Phil Jagielka');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Ars', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 0', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '26:36 - 26:52 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();
        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for M. Özil should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'M. Özil');
        });
      });

      test.it('selecting Wayne Rooney from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Wayne Rooney', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'W. Rooney', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 10, 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'M. Özil', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(5); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(1)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'C. Borthwick-Jackson: 20 (MUN-N/A)\nK. Iheanacho: 20 (MCI-N/A)\nD. Gray: 20 (LEI-N/A)\nB. Celina: 20 (MCI-N/A)\nS. Ojo: 19 (LIV-N/A)\nM. Rashford: 19 (MUN-N/A)\nJ. Leko: 18 (WBA-N/A)', 'tooltip for 1st bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(11,12);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'Chance').then(function(stat) {
          assert.equal(stat, 8);
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "ARS vs TOT");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2016-05-01', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "TOT");
        });          

        playersPage.getTableStatFor(2,'Shot').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - shots');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'Ast').then(function(stat) {
          assert.equal(stat, 5, 'League 2 - Ast');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      });     
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 5.06, colName: 'Touches' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Touches' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'Touches' },
        { type: 'Per Game', topStat: 1, colName: 'Touches' },
        { type: 'Team Stats', topStat: 29, colName: 'Touches' },
        { type: 'Opponent Stats', topStat: 22, colName: 'Touches' },
        { type: 'Opponent Per Game', topStat: 3, colName: 'Touches' },
        { type: 'Opponent Per 90', topStat: 6.22, colName: 'Touches' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Touches' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Touches' },
        { type: 'Z-Score', topStat: 7.94, colName: 'Touches' },
        { type: 'Stat (Rank)', topStat: "10 (1)", color: true, colName: 'Touches' },
        { type: 'Stat (Percentile)', topStat: "10 (100%)", color: true, colName: 'Touches' },
        { type: 'Stat (Z-Score)', topStat: "10 (7.94)", colName: 'Touches' },
        { type: 'Totals', topStat: 10, colName: 'Touches' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });    
  });

  test.describe("#Page: Possessions", function() {
    test.it('clicking Possessions link goes to correct page', function() {
      playersPage.goToSection('possessions');
      filters.closeDropdownFilter('Pass Result');
      filters.closeDropdownFilter('Pass Style');
      filters.removeSelectionFromDropdownFilter('Season:');
      filters.addSelectionToDropdownFilter('Season:', 'Premier League 2015/2016 (England)');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/possessions/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'PossLost', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colName: 'PsRec', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'PosWonD3rd', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sorting by PsRec', function() {
        playersPage.clickTableHeaderFor('PsRec');
      });

      test.it('adding filter - (Pass To Field Location: Attacking Half), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Pass To Field Location:', 'Attacking Half');

        playersPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 2094, '1st row - Touches');
        });

        playersPage.getTableStatFor(1,'PsRec').then(function(stat) {
          assert.equal(stat, 1714, '1st row - PsRec');
        });
      });

      test.it('adding filter - (Players Up/Down: 1 to 2), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Players Up/Down:', 1, 2);

        playersPage.getTableStatFor(1,'player').then(function(stat) {
          assert.equal(stat, 'D. Payet', '1st row - Player');
        });

        playersPage.getTableStatFor(1, 'Touches').then(function(stat) {
          assert.equal(stat, 295, '1st row - Touches');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'TouchOpBox');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-10-17', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'players').then(function(stat) {
          assert.equal(stat, 'receiver : C. Kouyaté , toucher : D. Payet', 'row 1 players')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Save', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '56:38', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 23);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 23);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Miss by Jason Puncheon');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 23);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 23);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'CryP', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '1 - 3', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '56:28 - 56:44 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();
        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for D. Payet should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'D. Payet');
        });
      });

      test.it('selecting Wayne Rooney from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Wayne Rooney', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'W. Rooney', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 300, 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'D. Payet', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(1)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Lucas Leiva: 33 (LIV-N/A)\nD. Gosling: 33 (BOR-N/A)\nCédric Soares: 33 (SOT-N/A)\nC. Brunt: 32 (WBA-N/A)\nC. McManaman: 32 (WBA-N/A)\nA. Ayew: 32 (SWA-N/A)\nE. Adebayor: 32 (CRY-N/A)\nJ. Ward: 31 (CRY-N/A)\nJ. Chester: 31 (WBA-N/A)\nOriol Romeu: 31 (SOT-N/A)\n+ 115 more', 'tooltip for 1st bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(5,9);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'PossLost').then(function(stat) {
          assert.equal(stat, 20, 'row 2 PossLost');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "NEW vs ARS");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2016-02-02', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "NEW");
        });          

        playersPage.getTableStatFor(2,'PossLost').then(function(stat) {
          assert.equal(stat, 6, 'Opponent 2 - PossLost');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'Touches').then(function(stat) {
          assert.equal(stat, 205, 'League 2 - touches');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 19.12, colName: 'PossLost' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'PossLost' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'PossLost' },
        { type: 'Per Game', topStat: 10, colName: 'PossLost' },
        { type: 'Team Stats', topStat: 224, colName: 'PossLost' },
        { type: 'Opponent Stats', topStat: 264, colName: 'PossLost' },
        { type: 'Opponent Per Game', topStat: 68, colName: 'PossLost' },
        { type: 'Opponent Per 90', topStat: 183.77, colName: 'PossLost' },
        { type: 'RANK', topStat: 387, color: true, colName: 'PossLost' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'PossLost' },
        { type: 'Z-Score', topStat: -7.734, colName: 'PossLost' },
        { type: 'Stat (Rank)', topStat: "35 (387)", color: true, colName: 'PossLost' },
        { type: 'Stat (Percentile)', topStat: "35 (0%)", color: true, colName: 'PossLost' },
        { type: 'Stat (Z-Score)', topStat: "35 (-7.73)", colName: 'PossLost' },
        { type: 'Totals', topStat: 35, colName: 'PossLost' }
      ];

      test.it('sorting by PossLost', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.clickTableHeaderFor('PossLost');
        playersPage.clickTableHeaderFor('PossLost');
        playersPage.waitForTableToLoad();
      });    

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Passes", function() {
    test.it('clicking Passes link goes to correct page', function() {
      playersPage.goToSection('passes');
      filters.closeDropdownFilter('Pass To Field Location');
      filters.closeDropdownFilter('Players Up/Down');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/passes/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'Pass%Long', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'PsIntoA3rd', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'PsOwnHalf', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by PsAtt', function() {
        playersPage.clickTableHeaderFor('PsAtt');
      });

      test.it('adding filter - (Set Kicks: Goal Kicks), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Set Kicks:', 'Goal Kicks');

        playersPage.getTableStatFor(1,'PsAtt').then(function(stat) {
          assert.equal(stat, 377, '1st row - PsAtt');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'WAT', '1st row - Team');
        });
      });

      test.it('adding filter - (Touch Outcome: Success), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Touch Outcome:', 'Success');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'MUN', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'PsOwnHalf').then(function(stat) {
          assert.equal(stat, 96, '1st row - PsOwnHalf');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'PsCmp');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-09-12', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'play').then(function(stat) {
          assert.equal(stat, 'Pass')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '37:46', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by James Milner');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 13);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 13);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Liv', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '00:39 - 00:55 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for David de Gea should add them to the pinned table', function() {
        browser.scrollToTop();
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'David de Gea');
        });
      });

      test.it('selecting L. Fabianski from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Fabianski', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'L. Fabianski', '1st row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 325, 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'David de Gea', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'A. McCarthy: 32 (CRY-N/A)\nJ. Haugaard: 22 (STO-N/A)\nA. Federici: 20 (BOR-N/A)', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(5,9);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'PsAtt').then(function(stat) {
          assert.equal(stat, 169, 'row 2 PsAtt');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "LIV vs MUN");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-12-13', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "LIV");
        });          

        playersPage.getTableStatFor(2,'PsOppHalf').then(function(stat) {
          assert.equal(stat, 8, 'Opponent 2 - PsOppHalf');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(1,'PsIntoA3rd').then(function(stat) {
          assert.equal(stat, 8, 'League 2 - PsIntoA3rd');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 7.61, colName: 'PsAtt' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'PsAtt' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'PsAtt' },
        { type: 'Per Game', topStat: 8, colName: 'PsAtt' },
        { type: 'Team Stats', topStat: 188, colName: 'PsAtt' },
        { type: 'Opponent Stats', topStat: 204, colName: 'PsAtt' },
        { type: 'Opponent Per Game', topStat: 7, colName: 'PsAtt' },
        { type: 'Opponent Per 90', topStat: 14.29, colName: 'PsAtt' },
        { type: 'RANK', topStat: 1, color: true, colName: 'PsAtt' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'PsAtt' },
        { type: 'Z-Score', topStat: 6.583, colName: 'PsAtt' },
        { type: 'Stat (Rank)', topStat: "169 (1)", color: true, colName: 'PsAtt' },
        { type: 'Stat (Percentile)', topStat: "169 (100%)", color: true, colName: 'PsAtt' },
        { type: 'Stat (Z-Score)', topStat: "169 (6.58)", colName: 'PsAtt' },
        { type: 'Totals', topStat: 169, colName: 'PsAtt' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Creativity", function() {
    test.it('clicking Creativity link goes to correct page', function() {
      playersPage.goToSection('creativity');
      filters.closeDropdownFilter('Set Kicks');
      filters.closeDropdownFilter('Touch Outcome');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/creativity/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'TakeOn%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Ps%Att3rd', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ExpA', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by PsAtt', function() {
        playersPage.clickTableHeaderFor('PsInA3rd');
      });

      test.it('adding filter - (Touches Play Style: Regular (Open) Play), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Touches Play Style:', 'Regular (Open) Play');

        playersPage.getTableStatFor(1,'CrossOpen').then(function(stat) {
          assert.equal(stat, 65, '1st row - CrossOpen');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'ARS', '1st row - Team');
        });
      });

      test.it('adding filter - (Team Draw Probability: 25 to 50), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Team Draw Probability:', 25, 50);

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'ARS', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'KeyPass').then(function(stat) {
          assert.equal(stat, 31, '1st row - KeyPass');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'Chance');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-09', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'L 0-2')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Dispossessed', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '54:17', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 6);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 6);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Tackle by Mark Noble');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 10);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 10);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'CryP', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '1 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '4:48 - 5:04 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for M. Özil should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'M. Özil');
        });
      });

      test.it('selecting Wayne Rooney from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Wayne Rooney', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'W. Rooney', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 655, 'pinned total - PsInA3rd');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'M. Özil', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'A. Koné: 142 (EVE-N/A)\nCarles Gil: 141 (AST-N/A)\nK. Walker: 139 (TOT-N/A)\nM. Albrighton: 138 (LEI-N/A)\nY. Bolasie: 138 (CRY-N/A)\nA. Ayew: 137 (SWA-N/A)\nHeung-Min Son: 136 (TOT-N/A)\nJ. Stanislas: 135 (BOR-N/A)\nOscar: 135 (CHE-N/A)\nS. Sessègnon: 133 (WBA-N/A)\n+ 42 more', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,11);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'ExpA').then(function(stat) {
          assert.equal(stat, 2.62, 'row 2 ExpA');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "MCI vs WHU");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-11-21', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "NOR");
        });          

        playersPage.getTableStatFor(2,'IntentAst').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - IntentAst');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'BgChncCrtd').then(function(stat) {
          assert.equal(stat, 2, 'League 2 - BgChncCrtd');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 18.97, colName: 'PsInA3rd' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'PsInA3rd' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'PsInA3rd' },
        { type: 'Per Game', topStat: 13.2, colName: 'PsInA3rd' },
        { type: 'Team Stats', topStat: 2379, colName: 'PsInA3rd' },
        { type: 'Opponent Stats', topStat: 2319, colName: 'PsInA3rd' },
        { type: 'Opponent Per Game', topStat: 86.5, colName: 'PsInA3rd' },
        { type: 'Opponent Per 90', topStat: 93.1, colName: 'PsInA3rd' },
        { type: 'RANK', topStat: 1, color: true, colName: 'PsInA3rd' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'PsInA3rd' },
        { type: 'Z-Score', topStat: 5.329, colName: 'PsInA3rd' },
        { type: 'Stat (Rank)', topStat: "462 (1)", color: true, colName: 'PsInA3rd' },
        { type: 'Stat (Percentile)', topStat: "462 (100%)", color: true, colName: 'PsInA3rd' },
        { type: 'Stat (Z-Score)', topStat: "462 (5.33)", colName: 'PsInA3rd' },
        { type: 'Totals', topStat: 462, colName: 'PsInA3rd' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Shots", function() {
    test.it('clicking Shots link goes to correct page', function() {
      playersPage.goToSection('shots');
      filters.closeDropdownFilter('Touches Play Style');
      filters.closeDropdownFilter('Team Draw Probability');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/shots/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: '%ShtRFoot', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Off', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ShotConv', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by Shot', function() {
        playersPage.clickTableHeaderFor('Shot');
      });

      test.it('adding filter - (Shot Location: Outside Penalty Area), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Shot Location:', 'Outside Penalty Area');

        playersPage.getTableStatFor(1,'Off').then(function(stat) {
          assert.equal(stat, 24, '1st row - Off');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'TOT', '1st row - Team');
        });
      });

      test.it('adding filter - (Shot Play Style: Regular (Open) Play), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Shot Play Style:', 'Regular (Open) Play');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'LIV', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'MinPerGoal').then(function(stat) {
          assert.equal(stat, 527.4, '1st row - MinPerGoal');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'Blkd');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-09', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'W 1-0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '20:41', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by Jordan Henderson');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Stok', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '20:46 - 21:02 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
  test.describe("#pinning/isoMode", function() {
    test.it('clicking the pin icon for Philippe Coutinho should add them to the pinned table', function() {
      playersPage.clickTablePin(1);

      playersPage.getIsoTableStat(1,7).then(function(stat) {
        assert.equal(stat, 'Philippe Coutinho');
      });
    });

    test.it('selecting Paul Pogba from search should add team to table', function() {
      playersPage.clickIsoBtn("on");
      driver.sleep(3000);
      playersPage.addToIsoTable('Wayne Rooney', 1)

      playersPage.getIsoTableStat(2,7).then(function(stat) {
        assert.equal(stat, 'W. Rooney', '2nd row player name');
      })
    });

    test.it('pinned total should show the correct sum', function() {
      playersPage.getPinnedTotalTableStat(9).then(function(stat) {
        assert.equal(stat, 5, 'pinned total - Touches');
      });
    });

    test.it('turning off isolation mode should show players in iso table', function() {
      playersPage.clickIsoBtn("off");
      playersPage.getIsoTableStat(1,7).then(function(stat) {
        assert.equal(stat, 'Philippe Coutinho', '1st row player name');
      });
    });
  });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Willian: 1 (CHE-N/A)\nC. Eriksen: 1 (TOT-N/A)\nG. Sigurðsson: 1 (SWA-N/A)\nH. Arter: 1 (BOR-N/A)\nR. Brady: 1 (NOR-N/A)\nM. Lanzini: 1 (WHU-N/A)\nY. Bolasie: 1 (CRY-N/A)\nC. Gardner: 1 (WBA-N/A)\nD. Payet: 1 (WHU-N/A)\nI. Afellay: 1 (STO-N/A)\n+ 48 more', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,11);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'%ShotInBox').then(function(stat) {
          assert.equal(stat, '0.0%', 'row 2 %ShotInBox');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "WBA vs AST");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2016-01-18', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "SWA");
        });          

        playersPage.getTableStatFor(2,'%ShtOutBox').then(function(stat) {
          assert.equal(stat, "100.0%", 'Opponent 2 - %ShtOutBox');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'%ShtRFoot').then(function(stat) {
          assert.equal(stat, '86.0%', 'League 2 - %ShtRFoot');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 5.1, colName: 'Shot' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Shot' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'Shot' },
        { type: 'Per Game', topStat: 1.54, colName: 'Shot' },
        { type: 'Team Stats', topStat: 158, colName: 'Shot' },
        { type: 'Opponent Stats', topStat: 122, colName: 'Shot' },
        { type: 'Opponent Per Game', topStat: 6.5, colName: 'Shot' },
        { type: 'Opponent Per 90', topStat: 19.3, colName: 'Shot' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Shot' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Shot' },
        { type: 'Z-Score', topStat: 5.989, colName: 'Shot' },
        { type: 'Stat (Rank)', topStat: "40 (1)", color: true, colName: 'Shot' },
        { type: 'Stat (Percentile)', topStat: "40 (100%)", color: true, colName: 'Shot' },
        { type: 'Stat (Z-Score)', topStat: "40 (5.99)", colName: 'Shot' },
        { type: 'Totals', topStat: 40, colName: 'Shot' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Defence", function() {
    test.it('clicking Defence link goes to correct page', function() {
      playersPage.goToSection('defence');
      filters.closeDropdownFilter('Shot Location');
      filters.closeDropdownFilter('Shot Play Style');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/defense/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'Duels', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Aerials', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ShotsAg', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by Int', function() {
        playersPage.clickTableHeaderFor('Int');
      });

      test.it('adding filter - (Final Score Difference: 2 to 5), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Final Score Difference:', 2, 5);

        playersPage.getTableStatFor(1,'Clrnce').then(function(stat) {
          assert.equal(stat, 70, '1st row - Clrnce');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'ARS', '1st row - Team');
        });
      });

      test.it('adding filter - (Game Start Formation: 4-4-2), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Game Start Formation:', '4-4-2');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'LEI', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'Int').then(function(stat) {
          assert.equal(stat, 45, '1st row - Int');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'ShtBlk');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-11-21', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'team-opponent-score').then(function(stat) {
          assert.equal(stat, '0 - 0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '8:23', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 7);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 7);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(7);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, "Save by N'Golo Kante");
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(7).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 16);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 16);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Newcastle', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 3', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '9:25 - 9:41 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for N. Kanté should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'N. Kanté');
        });
      });

      test.it('selecting Christian Fuchs from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Fuchs', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'C. Fuchs', '1st row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 74, 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'N. Kanté', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'M. Albrighton: 9 (LEI-N/A)\nE. Capoue: 9 (WAT-N/A)\nN. Aké: 9 (WAT-N/A)\nW. Morgan: 8 (LEI-N/A)\nM. Noble: 8 (WHU-N/A)\nL. Ulloa: 8 (LEI-N/A)\nS. Okazaki: 8 (LEI-N/A)\nA. Nyom: 7 (WAT-N/A)\nC. Kouyaté: 7 (WHU-N/A)\nJ. Schlupp: 7 (LEI-N/A)\n+ 4 more', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,11);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'Duel%').then(function(stat) {
          assert.equal(stat, '55.3%', 'row 2 Duel%');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "MCI vs AST");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2016-04-24', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "SWA");
        });          

        playersPage.getTableStatFor(2,'Tackl').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - Tackl');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'CrossBlkd').then(function(stat) {
          assert.equal(stat, 8, 'League 2 - CrossBlkd');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 14.32, colName: 'Int' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Int' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'Int' },
        { type: 'Per Game', topStat: 7, colName: 'Int' },
        { type: 'Team Stats', topStat: 197, colName: 'Int' },
        { type: 'Opponent Stats', topStat: 154, colName: 'Int' },
        { type: 'Opponent Per Game', topStat: 21, colName: 'Int' },
        { type: 'Opponent Per 90', topStat: 28.65, colName: 'Int' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Int' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Int' },
        { type: 'Z-Score', topStat: 5.412, colName: 'Int' },
        { type: 'Stat (Rank)', topStat: "45 (1)", color: true, colName: 'Int' },
        { type: 'Stat (Percentile)', topStat: "45 (100%)", color: true, colName: 'Int' },
        { type: 'Stat (Z-Score)', topStat: "45 (5.41)", colName: 'Int' },
        { type: 'Totals', topStat: 45, colName: 'Int' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Set Pieces", function() {
    test.it('clicking Set Pieces link goes to correct page', function() {
      playersPage.goToSection('setPieces');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForRangeSidebarFilter('Final Score Difference:', '', '');
      filters.closeDropdownFilter('Game Start Formation');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/set\-pieces/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'LftCrnrSc%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ChncSetPl', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'CrnrOffTgt', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by Corners', function() {
        playersPage.clickTableHeaderFor('Corners');
      });

      test.it('adding filter - (Match Age: 28-40), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.changeValuesForRangeSidebarFilter('Match Age:', 28, 40);

        playersPage.getTableStatFor(1,'Corners').then(function(stat) {
          assert.equal(stat, 159, '1st row - Corners');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'WHU', '1st row - Team');
        });
      });

      test.it('adding filter - (Starter: Sub), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Starter:', 'Sub');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'WBA', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'ShotDirFK').then(function(stat) {
          assert.equal(stat, 3, '1st row - ShotDirFK');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'Corners');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-09-19', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'W 1-0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Interception', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '73:12', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Clearance by Ashley Westwood');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 7);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 7);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'ManC', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '41:16 - 41:32 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for C. Gardner should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'C. Gardner');
        });
      });

      test.it('selecting Marc Pugh from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Pugh', 4);

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'M. Pugh', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, '33.3%', 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'C. Gardner', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'C. Gardner: 8.3%,8.333333333333332 (WBA-N/A)\nK. Mirallas: 75.0%,75 (EVE-N/A)\nM. Pugh: 66.7%,66.66666666666666 (BOR-N/A)\nPedro: 50.0%,50 (CHE-N/A)\nS. Larsson: 50.0%,50 (SUN-N/A)\nA. Guédioura: 50.0%,50 (WAT-N/A)\nA. Young: 50.0%,50 (MUN-N/A)\nM. Zárate: 50.0%,50 (WHU-N/A)\nC. Adam: 50.0%,50 (STO-N/A)\nM. Jarvis: 50.0%,50 (NOR-N/A)\n+ 39 more', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,11);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'FKOnTgt').then(function(stat) {
          assert.equal(stat, 0, 'row 2 FKOnTgt');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "MCI vs WBA");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-11-08', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "MCI");
        });          

        playersPage.getTableStatFor(2,'ShotDirFK').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - ShotDirFK');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'ChncSetPl').then(function(stat) {
          assert.equal(stat, 1, 'League 2 - ChncSetPl');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 4.71, colName: 'Corners' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Corners' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'Corners' },
        { type: 'Per Game', topStat: 2, colName: 'Corners' },
        { type: 'Team Stats', topStat: 44, colName: 'Corners' },
        { type: 'Opponent Stats', topStat: 34, colName: 'Corners' },
        { type: 'Opponent Per Game', topStat: 7, colName: 'Corners' },
        { type: 'Opponent Per 90', topStat: 18.6, colName: 'Corners' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Corners' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Corners' },
        { type: 'Z-Score', topStat: 3.921, colName: 'Corners' },
        { type: 'Stat (Rank)', topStat: "13 (1)", color: true, colName: 'Corners' },
        { type: 'Stat (Percentile)', topStat: "13 (100%)", color: true, colName: 'Corners' },
        { type: 'Stat (Z-Score)', topStat: "13 (3.92)", colName: 'Corners' },
        { type: 'Totals', topStat: 13, colName: 'Corners' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Goalkeeper", function() {
    test.it('clicking Goalkeeper link goes to correct page', function() {
      playersPage.goToSection('goalkeeper');
      filters.closeDropdownFilter('Match Age');
      filters.closeDropdownFilter('Starter');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/gk\-shots/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'ExpGAg', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Saves', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Cross', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by ShotsAg', function() {
        playersPage.clickTableHeaderFor('ShotsAg');
      });

      test.it('adding filter - (GK Save Action: Keeper Parries), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('GK Save Action:', 'Keeper Parries');

        playersPage.getTableStatFor(1,'ShotsAg').then(function(stat) {
          assert.equal(stat, 73, '1st row - ShotsAg');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'WAT', '1st row - Team');
        });
      });

      test.it('adding filter - (Penalty Shot: Penalty Shot), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Penalty Shot:', 'Penalty Shot');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'WAT', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'SOGAg').then(function(stat) {
          assert.equal(stat, 3, '1st row - SOGAg');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'ExpGAg');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-10-03', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'T 1-1')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'TakeOn', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '82:25', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 4);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 4);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'FreeKick by Adam Smith');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'WBA', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '66:44 - 67:00 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Gomes should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'Gomes');
        });
      });

      test.it('selecting S. Mignolet from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Mignolet', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'S. Mignolet', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(10).then(function(stat) {
          assert.equal(stat, 3.15, 'pinned total - ExpGAg');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'Gomes', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(1)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'B. Guzan: 0 (AST-N/A)\nGomes: 0 (WAT-N/A)\nA. Boruc: 0 (BOR-N/A)\nS. Mignolet: 0 (LIV-N/A)\nT. Courtois: 0 (CHE-N/A)\nK. Darlow: 0 (NEW-N/A)\nM. Bunn: 0 (AST-N/A)\nW. Hennessey: 0 (CRY-N/A)\nB. Foster: 0 (WBA-N/A)\nC. Pantilimon: 0 (WAT-N/A)\n+ 13 more', 'tooltip for 1st bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,11);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'Saves').then(function(stat) {
          assert.equal(stat, 2, 'row 2 Saves');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "WBA vs WAT");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-10-03', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "WBA");
        });          

        playersPage.getTableStatFor(2,'ShotsAg').then(function(stat) {
          assert.equal(stat, 1, 'Opponent 2 - ShotsAg');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'SOGAg').then(function(stat) {
          assert.equal(stat, 2, 'League 2 - SOGAg');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.95, colName: 'ShotsAg' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'ShotsAg' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'ShotsAg' },
        { type: 'Per Game', topStat: 1, colName: 'ShotsAg' },
        { type: 'Team Stats', topStat: 3, colName: 'ShotsAg' },
        { type: 'Opponent Stats', topStat: 4, colName: 'ShotsAg' },
        { type: 'Opponent Per Game', topStat: 2, colName: 'ShotsAg' },
        { type: 'Opponent Per 90', topStat: 3.65, colName: 'ShotsAg' },
        { type: 'RANK', topStat: 1, color: true, colName: 'ShotsAg' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'ShotsAg' },
        { type: 'Z-Score', topStat: 2.981, colName: 'ShotsAg' },
        { type: 'Stat (Rank)', topStat: "3 (1)", color: true, colName: 'ShotsAg' },
        { type: 'Stat (Percentile)', topStat: "3 (100%)", color: true, colName: 'ShotsAg' },
        { type: 'Stat (Z-Score)', topStat: "3 (2.98)", colName: 'ShotsAg' },
        { type: 'Totals', topStat: 3, colName: 'ShotsAg' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Discipline", function() {
    test.it('clicking Discipline link goes to correct page', function() {
      playersPage.goToSection('discipline');
      filters.closeDropdownFilter('GK Save Action');
      filters.closeDropdownFilter('Penalty Shot');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /players\/discipline/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'Position', sortType: 'string', defaultSort: 'desc' },
        { colName: 'Age', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: '2ndYellow', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickTableHeaderFor(column.colName);
          playersPage.waitForTableToLoad();
          playersPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('sort table by PsAtt', function() {
        playersPage.clickTableHeaderFor('FoulSuf');
      });

      test.it('adding filter - (Venue: Home), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.addSelectionToDropdownSidebarFilter('Venue:', 'Home');

        playersPage.getTableStatFor(1,'FoulCom').then(function(stat) {
          assert.equal(stat, 22, '1st row - CrossOpen');
        });

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'CRY', '1st row - FoulCom');
        });
      });

      test.it('adding filter - (Date Range: corner), shows correct stats ', function() {
        filters.changeValuesForDateSidebarFilter('Date Range:', '2016-1-1', '2016-10-1');

        playersPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'CRY', '1st row - Team');
        });

        playersPage.getTableStatFor(1, 'Yellow').then(function(stat) {
          assert.equal(stat, 1, '1st row - Yellow');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        playersPage.clickTableStatFor(1, 'Yellow');
      });
        
      test.it('play by play modal shows correct data', function() {
        playersPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2016-02-02', 'row 1 date')
        });

        playersPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'L 1-2')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        playersPage.clickPlayPossessionIcon(1);
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        playersPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        playersPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '40:07', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('visual shows correct number of plays', function() {
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        playersPage.hoverOverPlayPossessionPlay(1);
        playersPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'BallTouch by Simon Francis');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        playersPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        playersPage.changePlayPossessionCropSlider(50);
        playersPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 16);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        playersPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 16);
        });
      });

      test.it('clicking export button opens export modal', function() {
        playersPage.clickPlayPossessionExportButton();
        playersPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        playersPage.clickPlayPossessionExportCloseButton();
        playersPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        playersPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        playersPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'CryP', 'video 1 - home team');
        });

        playersPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '1 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        playersPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '42:14 - 42:30 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        playersPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        playersPage.closePlayByPlayModal();

        playersPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for W. Zaha should add them to the pinned table', function() {
        playersPage.clickTablePin(1);

        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'W. Zaha');
        });
      });

      test.it('selecting R. Mahrez from search should add team to table', function() {
        playersPage.clickIsoBtn("on");
        driver.sleep(3000);
        playersPage.addToIsoTable('Mahrez', 1)

        playersPage.getIsoTableStat(2,7).then(function(stat) {
          assert.equal(stat, 'R. Mahrez', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        playersPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 16, 'pinned total - FoulCom');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        playersPage.clickIsoBtn("off");
        playersPage.getIsoTableStat(1,7).then(function(stat) {
          assert.equal(stat, 'W. Zaha', '1st row player name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        playersPage.clickChartColumnsBtn();
        playersPage.openHistogram(9); 
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        playersPage.hoverOverHistogramStack(2)
        playersPage.getTooltipText().then(function(text) {
          assert.equal(text, 'A. Kolarov: 3 (MCI-N/A)\nS. Sessègnon: 3 (WBA-N/A)\nV. Moses: 3 (WHU-N/A)\nPedro: 3 (CHE-N/A)\nS. Mané: 3 (SOT-N/A)\nR. Sterling: 3 (MCI-N/A)\nG. Varela: 3 (MUN-N/A)\nL. Baines: 3 (EVE-N/A)\nD. Origi: 3 (LIV-N/A)\nG. Wijnaldum: 3 (NEW-N/A)\n+ 18 more', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        playersPage.closeModal();
        playersPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        playersPage.openScatterChart(10,12);

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

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        playersPage.changeGroupBy("By Season");
        playersPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        playersPage.getTableStatFor(2,'FoulSuf').then(function(stat) {
          assert.equal(stat, 30, 'row 2 FoulSuf');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        playersPage.changeGroupBy("By Game");
        playersPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "BOR vs STO");
        });          

        playersPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2016-05-07', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        playersPage.changeGroupBy("By Opponent");
        playersPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "STO");
        });          

        playersPage.getTableStatFor(2,'FoulCom').then(function(stat) {
          assert.equal(stat, 1, 'Opponent 2 - FoulCom');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        playersPage.changeGroupBy("By League");
        playersPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        playersPage.getTableStatFor(2,'FoulSuf').then(function(stat) {
          assert.equal(stat, 30, 'League 2 - FoulSuf');
        });
      });

      test.it('selecting "Total"', function() {
        playersPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 15.04, colName: 'FoulSuf' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'FoulSuf' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'FoulSuf' },
        { type: 'Per Game', topStat: 3.75, colName: 'FoulSuf' },
        { type: 'Team Stats', topStat: 131, colName: 'FoulSuf' },
        { type: 'Opponent Stats', topStat: 128, colName: 'FoulSuf' },
        { type: 'Opponent Per Game', topStat: 14, colName: 'FoulSuf' },
        { type: 'Opponent Per 90', topStat: 31.76, colName: 'FoulSuf' },
        { type: 'RANK', topStat: 1, color: true, colName: 'FoulSuf' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'FoulSuf' },
        { type: 'Z-Score', topStat: 5.266, colName: 'FoulSuf' },
        { type: 'Stat (Rank)', topStat: "30 (1)", color: true, colName: 'FoulSuf' },
        { type: 'Stat (Percentile)', topStat: "30 (100%)", color: true, colName: 'FoulSuf' },
        { type: 'Stat (Z-Score)', topStat: "30 (5.27)", colName: 'FoulSuf' },
        { type: 'Totals', topStat: 30, colName: 'FoulSuf' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          playersPage.changeStatsView(statView.type);  
          playersPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            playersPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              var colorVal = statView.colorVal || topColor;
              assert.equal(color, colorVal);
            });
          });
        }
      });
    });
  });
});