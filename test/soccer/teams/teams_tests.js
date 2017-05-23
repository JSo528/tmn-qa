var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/soccer/navbar.js');
var Filters = require('../../../pages/soccer/filters.js');
var TeamsPage = require('../../../pages/soccer/teams/teams_page.js');
var navbar, filters, teamsPage;

test.describe('#Section: Teams', function() {
  test.it('navigating to teams page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    teamsPage = new TeamsPage(driver);
    
    navbar.goToTeamsPage();
    filters.removeSelectionFromDropdownFilter('Season:');
    filters.addSelectionToDropdownFilter('Season:', 'Premier League 2015/2016 (England)');
  });

  test.describe("#Page: Summary", function() {
    // test.describe('#sorting', function() {
    //   var columns = [
    //     { colName: 'Touches', sortType: 'ferpNumber', defaultSort: 'desc' },
    //     { colName: 'OnTarget%', sortType: 'ferpNumber', defaultSort: 'desc' },
    //     { colName: 'ExpG', sortType: 'ferpNumber', defaultSort: 'desc' },
    //   ]

    //   columns.forEach(function(column) {
    //     test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
    //       if (!column.initialCol) teamsPage.clickSummaryTableHeaderFor(column.colName);
    //       teamsPage.waitForTableToLoad();
    //       teamsPage.getSummaryTableStatsFor(column.colName).then(function(stats) {
    //         stats = extensions.normalizeArray(stats, column.sortType);
    //         var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
    //         assert.deepEqual(stats, sortedArray);
    //       })
    //     });

    //     test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
    //       teamsPage.clickSummaryTableHeaderFor(column.colName);
    //       teamsPage.waitForTableToLoad();
    //       teamsPage.getSummaryTableStatsFor(column.colName).then(function(stats) {
    //         stats = extensions.normalizeArray(stats, column.sortType);
    //         var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
    //         var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
    //         assert.deepEqual(stats, sortedArray);
    //       })
    //     });
    //   }); 
    // });
  
    test.describe("#filters", function() {
      test.it('sorting by touches', function() {
        teamsPage.clickSummaryTableHeaderFor('Touches');
      });

      test.it('adding filter - (Body Part: Left Foot), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Body Part:', 'Left Foot');

        teamsPage.getSummaryTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 215, '1st row - Touches');
        });

        teamsPage.getSummaryTableStatFor(1,'ExpG').then(function(stat) {
          assert.equal(stat, 17.06, '1st row - ExpG');
        });
      });

      test.it('adding filter - (Expected Goals: 0.5 to 1), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Expected Goals:', 0.5, 1);

        teamsPage.getSummaryTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 11, '1st row - Touches');
        });

        teamsPage.getSummaryTableStatFor(1, 'ExpG').then(function(stat) {
          assert.equal(stat, 6.85, '1st row - ExpG');
        });
      });

    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickSummaryTableStatFor(1, 'Touches');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-09-12', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
          assert.equal(stat, 'P2-89:41', 'row 1 period clock')
        });
      });
    });

    // test.describe('#playPossession modal', function() {
    //   test.it('clicking on playPossession icon opens modal', function() {
    //     teamsPage.clickPlayPossessionIcon(1);
    //     teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //       assert.equal(displayed, true);
    //     });
    //   });

    //   test.it('table shows correct plays', function() {
    //     teamsPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
    //       assert.equal(stat, 'Aleksandar Kolarov', '1st row player');
    //     });

    //     teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
    //       assert.equal(stat, '89:16', '1st row game clock');
    //     });
    //   });

    //   test.it('table shows correct number of plays', function() {
    //     teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //       assert.equal(stat, 11);
    //     });
    //   });

    //   test.it('visual shows correct number of plays', function() {
    //     teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //       assert.equal(stat, 11);
    //     });
    //   });

    //   test.it('hovering over play shows description in visual', function() {
    //     teamsPage.hoverOverPlayPossessionPlay(1);
    //     teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
    //       assert.equal(stat, 'Clearance by Scott Dann');
    //     });
    //   });

    //   test.it('hovering over play highlights row in table', function() {
    //     teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
    //       assert.equal(color, 'rgba(255, 251, 211, 1)');
    //     });
    //   });

    //   test.it('changing crop possessions slider updates visual', function() {
    //     teamsPage.changePlayPossessionCropSlider(50);
    //     teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //       assert.equal(stat, 13);
    //     });  
    //   });

    //   test.it('changing crop possessions slider updates table', function() {
    //     teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //       assert.equal(stat, 13);
    //     });
    //   });

    //   test.it('clicking export button opens export modal', function() {
    //     teamsPage.clickPlayPossessionExportButton();
    //     teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
    //       assert.equal(displayed, true);
    //     });
    //   });

    //   test.it('clicking close button closes modals', function() {
    //     teamsPage.clickPlayPossessionExportCloseButton();
    //     teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //       assert.equal(displayed, false);
    //     });
    //   });
    // });

    test.describe('#video', function() {
    //   test.it('clicking video icon opens video in new window', function() {
    //     teamsPage.clickPlayVideoIcon(1);
    //     filters.getCurrentUrl().then(function(url) {
    //       assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
    //     });
    //   });

    //   test.it('fixture info for video is correct', function() {
    //     teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
    //       assert.equal(stat, 'ManC', 'video 1 - home team');
    //     });

    //     teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
    //       assert.equal(stat, '6 - 1', 'video 1 - score');
    //     });
    //   });

    //   test.it('event time for video is correct', function() {
    //     teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
    //       assert.equal(stat, '7:03 - 7:19 (16s)');
    //     });
    //   }); 

    //   test.it('closing window goes back to original window', function() {
    //     teamsPage.closeVideoPlayerWindow();
    //     filters.getCurrentUrl().then(function(url) {
    //       assert.match(url, /trumedianetworks/, 'Correct URL');
    //     });
    //   });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();
        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    // test.describe("#pinning/isoMode", function() {
    //   test.it('clicking the pin icon for the Manchester City should add them to the pinned table', function() {
    //     teamsPage.clickTablePin(1);

    //     teamsPage.getIsoTableStat(1,4).then(function(stat) {
    //       assert.equal(stat, 'Manchester City');
    //     });
    //   });

    //   test.it('selecting Aston Villa from search should add team to table', function() {
    //     teamsPage.clickIsoBtn("on");
    //     driver.sleep(3000);
    //     teamsPage.addToIsoTable('aston', 1)

    //     teamsPage.getIsoTableStat(2,4).then(function(stat) {
    //       assert.equal(stat, 'Aston Villa', '2nd row team name');
    //     })
    //   });

    //   test.it('pinned total should show the correct sum', function() {
    //     teamsPage.getPinnedTotalTableStat(5).then(function(stat) {
    //       assert.equal(stat, 13, 'pinned total - Touches');
    //     });
    //   });

    //   test.it('turning off isolation mode should show teams in iso table', function() {
    //     teamsPage.clickIsoBtn("off");
    //     teamsPage.getIsoTableStat(1,4).then(function(stat) {
    //       assert.equal(stat, 'Manchester City', '1st row team name');
    //     });
    //   });
    // });

    // test.describe("#chart/editColumns", function() {
    //   // histograms
    //   test.it('clicking show histogram link should open histogram modal', function() {
    //     teamsPage.clickChartColumnsBtn();
    //     teamsPage.openHistogram(5); 
    //     teamsPage.isModalDisplayed().then(function(isDisplayed) {
    //       assert.equal(isDisplayed, true);
    //     }); 
    //   });

    //   test.it('hovering over bar should show stats for teams', function() {
    //     teamsPage.hoverOverHistogramStack(1)
    //     teamsPage.getTooltipText().then(function(text) {
    //       assert.equal(text, 'Watford: 1\nNewcastle United: 0', 'tooltip for 1st bar');
    //     });
    //   });

    //   test.it('clicking close histogram button should close histogram modal', function() {
    //     teamsPage.closeModal();
    //     teamsPage.isModalDisplayed().then(function(isDisplayed) {
    //       assert.equal(isDisplayed, false);
    //     }); 
    //   });                 

    //   // scatter plots          
    //   test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
    //     teamsPage.openScatterChart(11,12);

    //     teamsPage.isModalDisplayed().then(function(isDisplayed) {
    //       assert.equal(isDisplayed, true);
    //     }); 
    //   });

    //   test.it('clicking close button should close scatter chart modal', function() {
    //     teamsPage.closeModal();
    //     teamsPage.isModalDisplayed().then(function(isDisplayed) {
    //       assert.equal(isDisplayed, false);
    //     }); 
    //   });

    //   test.it('clearing pins', function() {
    //     teamsPage.clearTablePins();
    //   });   
    // });

    // test.describe('#groupBy', function() {
    //   test.it('selecting "By Season" shows the correct stats', function() {
    //     teamsPage.changeGroupBy("By Season");
    //     teamsPage.getSummaryTableStatFor(1, 'season').then(function(stat) {
    //       assert.equal(stat, 'Premier League 2015/2016 (England)');
    //     });

    //     teamsPage.getSummaryTableStatFor(2,'Chance').then(function(stat) {
    //       assert.equal(stat, 1);
    //     });
    //   });

    //   test.it('selecting "By Game" shows the correct stats', function() {
    //     teamsPage.changeGroupBy("By Game");
    //     teamsPage.getSummaryTableStatFor(1, 'game').then(function(stat) {
    //       assert.equal(stat, "MCI vs BOR");
    //     });          

    //     teamsPage.getSummaryTableStatFor(2,'date').then(function(stat) {
    //       assert.equal(stat, '2015-12-19', 'game 2 date');
    //     });
    //   });

    //   test.it('selecting "By Opponent" shows the correct stats', function() {
    //     teamsPage.changeGroupBy("By Opponent");
    //     teamsPage.getSummaryTableStatFor(1, 'opponent').then(function(stat) {
    //       assert.equal(stat, "CRY");
    //     });          

    //     teamsPage.getSummaryTableStatFor(2,'Shot').then(function(stat) {
    //       assert.equal(stat, 2, 'Opponent 2 - shots');
    //     });
    //   });

    //   test.it('selecting "By League" shows the correct stats', function() {
    //     teamsPage.changeGroupBy("By League");
    //     teamsPage.getSummaryTableStatFor(1, 'league').then(function(stat) {
    //       assert.equal(stat, "Premier League (England)");
    //     });          

    //     teamsPage.getSummaryTableStatFor(2,'Ast').then(function(stat) {
    //       assert.equal(stat, 1, 'League 2 - Ast');
    //     });
    //   });

    //   test.it('selecting "Total"', function() {
    //     teamsPage.changeGroupBy("Totals");
    //   });     
    // });

    // test.describe('#statsView', function() {
    //   var topColor = "rgba(108, 223, 118, 1)";
    //   var statViews = [
    //     { type: 'Per 90 Min', topStat: 1.06, colName: 'Touches' },            
    //     { type: 'Minutes Per', topStat: 0, colNmae: 'Touches' },
    //     { type: 'Opponent Minutes Per', topStat: "-", colName: 'Touches' },
    //     { type: 'Per Game', topStat: 1.13, colName: 'Touches' },
    //     { type: 'Team Stats', topStat: 11, colName: 'Touches' },
    //     { type: 'Opponent Stats', topStat: 10, colName: 'Touches' },
    //     { type: 'Opponent Per Game', topStat: 1.00, colName: 'Touches' },
    //     { type: 'Opponent Per 90', topStat: 0.94, colName: 'Touches' },
    //     { type: 'RANK', topStat: 1, color: true, colName: 'Touches' },
    //     { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Touches' },
    //     { type: 'Z-Score', topStat: 2.134, colName: 'Touches' },
    //     { type: 'Stat (Rank)', topStat: "11 (1)", color: true, colName: 'Touches' },
    //     { type: 'Stat (Percentile)', topStat: "11 (100%)", color: true, colName: 'Touches' },
    //     { type: 'Stat (Z-Score)', topStat: "11 (2.13)", colName: 'Touches' },
    //     { type: 'Totals', topStat: 11, colName: 'Touches' }
    //   ];

    //   statViews.forEach(function(statView) {
    //     test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
    //       teamsPage.changeStatsView(statView.type);  
    //       teamsPage.getSummaryTableStatFor(1,statView.colName).then(function(stat) {
    //         assert.equal(stat, statView.topStat);
    //       });
    //     });

    //     if (statView.color) {
    //       test.it("selecting " + statView.type + " shows the top value the right color", function() {
    //         teamsPage.getSummaryTableStatBgColor(1,statView.colName).then(function(color) {
    //           assert.equal(color, topColor);
    //         });
    //       });
    //     }
    //   });
    // });

    test.describe('#reports', function() {
      test.describe('#createReport', function() {
        test.it('clicking create report btn opens custom report modal', function() {
          teamsPage.clickCreateReportBtn();
          teamsPage.changeReportName('Test');
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('adding stat adds column to preview table', function() {
          teamsPage.addStatToCustomReport('[+/-] "Plus / Minus"', 'PlusMinus');
          teamsPage.isCustomReportColumnDisplayed('PlusMinus').then(function(displayed) {
            assert.equal(displayed, true, 'PlusMinus column should exist');
          });
        });

        test.it('removing stat removes column from preview table', function() {
          teamsPage.removeStatFromCustomReport('[Tackle%]');
          teamsPage.isCustomReportColumnDisplayed('Tackle%').then(function(displayed) {
            assert.equal(displayed, false, 'Tackle% column should exist');
          });
        });

        test.it('changing stat alias changes column in preview table', function() {
          teamsPage.changeStatInCustomReport('[Chance]', null, 'C');
          teamsPage.isCustomReportColumnDisplayed('Chance').then(function(displayed) {
            assert.equal(displayed, false, 'Chance column should not exist');
          });
          teamsPage.isCustomReportColumnDisplayed('C').then(function(displayed) {
            assert.equal(displayed, true, 'C column should exist');
          });          
        });

        test.it('changing stat manually changes column in preview table', function() {
          teamsPage.changeStatInCustomReport('[ExpG]', '[Clear%]', '');
          teamsPage.isCustomReportColumnDisplayed('ExpG').then(function(displayed) {
            assert.equal(displayed, false, 'ExpG column should not exist');
          });
          teamsPage.isCustomReportColumnDisplayed('Clear%').then(function(displayed) {
            assert.equal(displayed, true, 'Clear% column should exist');
          });
        });

        test.it('changing sort column column updates preview table', function() {
          teamsPage.changeSortColumnInCustomReport('[Shot]');
          teamsPage.getCustomReportPreviewTableStatsFor('Shot').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'desc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('changing sort order column updates preview table', function() {
          teamsPage.changeSortOrderInCustomReport('ASC');
          teamsPage.getCustomReportPreviewTableStatsFor('Shot').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'asc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('adding filter updates preview table', function() {
          teamsPage.addFilterToCustomReport('Game Start Formation: 4-4-2');
          teamsPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 11, 'team 1 shots');
          });
        });

        test.it('removing filter updates preview table', function() {
          teamsPage.removeFilterFromCustomReport('Expected Goals');
          teamsPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 116, 'team 1 shots');
          });
        });

        test.it('pressing save button closes modal', function() {
          teamsPage.clickSaveCustomReportButton();
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('closing modal if necessary', function() {
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) teamsPage.clickCloseCustomReportButton();
          });
        });

        test.it('saving report sets it to current report', function() {
          teamsPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Test');
          });
        });

        test.it('table stats show correct data', function() {
          teamsPage.getSummaryTableStatsFor('PlusMinus').then(function(stats) {
            assert.deepEqual(stats, ['13','-10','3','-3','0','-2','0','0','2','-1','1','0','-1']);
          });
        });
      });

      test.describe('#editReport', function() {
        test.it('clicking edit report btn opens custom report modal', function() {
          teamsPage.clickEditReportBtn();
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('changing report name', function() {
          teamsPage.changeReportName('Test2');
        });

        test.it('pressing save button closes modal', function() {
          teamsPage.clickSaveCustomReportButton();
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('close modal if neccessary', function() {
          teamsPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) teamsPage.clickCloseCustomReportButton();
          });
        });


        test.it('saving report sets it to current report', function() {
          teamsPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Test2');
          });
        });    
      });

      test.describe('#deleteReport', function() {
        test.it('clicking delete report removes report & sets default as the current report', function() {
          teamsPage.getCurrentReport().then(function(reportName) {
            if (reportName == 'Test2') {
              teamsPage.clickDeleteReportBtn();
              teamsPage.getCurrentReport().then(function(stat) {
                assert.equal(stat, 'default');
              });
            };
          });
        });
      });
    });    
  });

  test.describe("#Page: Possessions", function() {

  });

  test.describe("#Page: Passes", function() {

  });

  test.describe("#Page: Creativity", function() {

  });

  test.describe("#Page: Shots", function() {

  });

  test.describe("#Page: Defence", function() {

  });

  test.describe("#Page: Set Pieces", function() {

  });

  test.describe("#Page: Goalkeeper", function() {

  });

  test.describe("#Page: Discipline", function() {

  });
});