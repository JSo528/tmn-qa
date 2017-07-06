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
    test.describe('#reports', function() {
      test.describe('#createReport', function() {
        test.it('clicking create report btn opens custom report modal', function() {
          teamsPage.clickCreateReportBtn();
          teamsPage.changeReportName('Teams Test');
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
            assert.equal(stat, 349, 'team 1 shots');
          });
        });

        test.it('removing filter updates preview table', function() {
          teamsPage.removeFilterFromCustomReport('Game Start Formation');
          teamsPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 475, 'team 1 shots');
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
            assert.equal(stat, 'Teams Test');
          });
        });

        test.it('table stats show correct data for PlusMinus', function() {
          teamsPage.getTableStatsFor('PlusMinus').then(function(stats) {
            assert.deepEqual(stats, ['34','30','13','14','29','32','18','6','-12','4','-14','-22','-14','-10','-10','-28','-21','14','-14','-49']);
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
          teamsPage.changeReportName('Teams Test2');
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
            assert.equal(stat, 'Teams Test2');
          });
        });    
      });

      test.describe('#deleteReport', function() {
        test.it('clicking delete report removes report & sets default as the current report', function() {
          teamsPage.getCurrentReport().then(function(reportName) {
            if (reportName == 'Teams Test2') {
              teamsPage.clickDeleteReportBtn();
              teamsPage.getCurrentReport().then(function(stat) {
                assert.equal(stat, 'default');
              });
            };
          });
        });
      });
    });    

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'Touches', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'OnTarget%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ExpG', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });

    test.describe("#filters", function() {
      test.it('sorting by touches', function() {
        teamsPage.clickTableHeaderFor('Touches');
      });

      test.it('adding filter - (Body Part: Left Foot), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Body Part:', 'Left Foot');

        teamsPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 236, '1st row - Touches');
        });

        teamsPage.getTableStatFor(1,'ExpG').then(function(stat) {
          assert.equal(stat, 24.75, '1st row - ExpG');
        });
      });

      test.it('adding filter - (Expected Goals: 0.5 to 1), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Expected Goals:', 0.5, 1);

        teamsPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 11, '1st row - Touches');
        });

        teamsPage.getTableStatFor(1, 'ExpG').then(function(stat) {
          assert.equal(stat, 7.05, '1st row - ExpG');
        });
      });
    });
  
    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'Touches');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2016-09-10', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
          assert.equal(stat, 'P1-35:09', 'row 1 period clock')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
          assert.equal(stat, 'Raheem Shaquille Sterling', '1st row player');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '33:58', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 18);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 18);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by David de Gea Quintana');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 26);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 26);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Ars', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '4:14 - 4:30 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();
        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Manchester City should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Manchester City');
        });
      });

      test.it('selecting Aston Villa from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(5).then(function(stat) {
          assert.equal(stat, 19, 'pinned total - Touches');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Manchester City', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(5); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(1)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(11,12);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2016/2017 (England)');
        });

        teamsPage.getTableStatFor(2,'Chance').then(function(stat) {
          assert.equal(stat, 0);
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "STO vs ARS");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2017-04-23', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "STO");
        });          

        teamsPage.getTableStatFor(2,'Shot').then(function(stat) {
          assert.equal(stat, 2, 'Opponent 2 - shots');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'Ast').then(function(stat) {
          assert.equal(stat, 0, 'League 2 - Ast');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      });     
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.85, colName: 'Touches' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Touches' },
        { type: 'Opponent Minutes Per', topStat: 581.9, colName: 'Touches' },
        { type: 'Per Game', topStat: 0.92, colName: 'Touches' },
        { type: 'Team Stats', topStat: 11, colName: 'Touches' },
        { type: 'Opponent Stats', topStat: 10, colName: 'Touches' },
        { type: 'Opponent Per Game', topStat: 1.00, colName: 'Touches' },
        { type: 'Opponent Per 90', topStat: 0.91, colName: 'Touches' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Touches' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Touches' },
        { type: 'Z-Score', topStat: 2.287, colName: 'Touches' },
        { type: 'Stat (Rank)', topStat: "11 (1)", color: true, colName: 'Touches' },
        { type: 'Stat (Percentile)', topStat: "11 (100%)", color: true, colName: 'Touches' },
        { type: 'Stat (Z-Score)', topStat: "11 (2.29)", colName: 'Touches' },
        { type: 'Totals', topStat: 11, colName: 'Touches' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });    
  });

  test.describe("#Page: Possessions", function() {
    test.it('clicking Possessions link goes to correct page', function() {
      teamsPage.goToSection('possessions');
      filters.closeDropdownFilter('Body Part');
      filters.closeDropdownFilter('Expected Goals');
      filters.removeSelectionFromDropdownFilter('Season:');
      filters.addSelectionToDropdownFilter('Season:', 'Premier League 2015/2016 (England)');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/possessions/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'PossLost', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colName: 'TouchOpBox', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Poss%', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Cross Type: Free Kick), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Cross Type:', 'Free Kicks');

        teamsPage.getTableStatFor(1,'Poss%').then(function(stat) {
          assert.equal(stat, '33.1%', '1st row - Poss%');
        });

        teamsPage.getTableStatFor(1,'Touches').then(function(stat) {
          assert.equal(stat, 39, '1st row - Touches');
        });
      });

      test.it('adding filter - (Field Location: Right Half), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Field Location:', 'Right Half');

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Tottenham Hotspur', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'GM').then(function(stat) {
          assert.equal(stat, 30, '1st row - GM');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'Touches');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-08', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'players').then(function(stat) {
          assert.equal(stat, 'goalie : S. Romero , toucher : C. Eriksen', 'row 1 players')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'FreeKick', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '56:31', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'FreeKick by Christian Dannemann Eriksen');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Tot', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '1:04 - 1:20 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();
        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Tottenham Hotspur should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Tottenham Hotspur');
        });
      });

      test.it('selecting Norwich City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('norwich', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Norwich City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(8).then(function(stat) {
          assert.equal(stat, '39.0%', 'pinned total - Poss%');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Tottenham Hotspur', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(1)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Watford: 0\nTottenham Hotspur: 0\nStoke City: 0\nNewcastle United: 0\nArsenal: 0\nAston Villa: 0\nManchester United: 0\nLeicester City: 0\nWest Ham United: 0\nEverton: 0\n+ 2 more', 'tooltip for 1st bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(5,9);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'Poss%').then(function(stat) {
          assert.equal(stat, '30.6%', 'row 2 poss%');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "MCI vs SOT");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-12-21', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "SOT");
        });          

        teamsPage.getTableStatFor(2,'PossLost').then(function(stat) {
          assert.equal(stat, 1, 'Opponent 2 - PossLost');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'Touches').then(function(stat) {
          assert.equal(stat, 15, 'League 2 - touches');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.08, colName: 'PossLost' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'PossLost' },
        { type: 'Opponent Minutes Per', topStat: '-', colName: 'PossLost' },
        { type: 'Per Game', topStat: 0.09, colName: 'PossLost' },
        { type: 'Team Stats', topStat: 3, colName: 'PossLost' },
        { type: 'Opponent Stats', topStat: 2, colName: 'PossLost' },
        { type: 'Opponent Per Game', topStat: 0.08, colName: 'PossLost' },
        { type: 'Opponent Per 90', topStat: 0.07, colName: 'PossLost' },
        { type: 'RANK', topStat: 20, color: true, colName: 'PossLost' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'PossLost' },
        { type: 'Z-Score', topStat: -2.968, colName: 'PossLost' },
        { type: 'Stat (Rank)', topStat: "3 (20)", color: true, colName: 'PossLost' },
        { type: 'Stat (Percentile)', topStat: "3 (0%)", color: true, colName: 'PossLost' },
        { type: 'Stat (Z-Score)', topStat: "3 (-2.97)", colName: 'PossLost' },
        { type: 'Totals', topStat: 3, colName: 'PossLost' }
      ];

      test.it('sorting by PossLost', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.clickTableHeaderFor('PossLost');
        teamsPage.clickTableHeaderFor('PossLost');
        teamsPage.waitForTableToLoad();
      });    

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Passes", function() {
    test.it('clicking Passes link goes to correct page', function() {
      teamsPage.goToSection('passes');
      filters.closeDropdownFilter('Field Location')
      filters.closeDropdownFilter('Cross Type')

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/passes/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: '%PassFwd', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'PsInA3rd', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Crosses', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Pass Distance: 25 to 100), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Pass Distance:', 25, 100);

        teamsPage.getTableStatFor(1,'Crosses').then(function(stat) {
          assert.equal(stat, 388, '1st row - Crosses');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Sunderland', '1st row - Team');
        });
      });

      test.it('adding filter - (Pass Direction: Square), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Pass Direction:', 'Square');

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Stoke City', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'PsOwnHalf').then(function(stat) {
          assert.equal(stat, 64, '1st row - PsOwnHalf');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'PsCmp');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-09', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'play').then(function(stat) {
          assert.equal(stat, 'Pass')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '12:07', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 18);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 18);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by Jordan Henderson');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Eve', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '3 - 4', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '00:-6 - 00:10 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Stoke City should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Stoke City');
        });
      });

      test.it('selecting Watford from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('watford', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Watford', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(7).then(function(stat) {
          assert.equal(stat, '97.0%', 'pinned total - Pass%');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Stoke City', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Southampton: 54\nNorwich City: 48\nWest Bromwich Albion: 48\nNewcastle United: 47\nCrystal Palace: 45\nWatford: 44', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(5,9);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'PsAtt').then(function(stat) {
          assert.equal(stat, 156, 'row 2 PsAtt');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "CRY vs AST");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-09-27', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "AST");
        });          

        teamsPage.getTableStatFor(2,'PsOppHalf').then(function(stat) {
          assert.equal(stat, 4, 'Opponent 2 - PsOppHalf');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(1,'PsIntoA3rd').then(function(stat) {
          assert.equal(stat, 2, 'League 2 - PsIntoA3rd');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.27, colName: 'Crosses' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Crosses' },
        { type: 'Opponent Minutes Per', topStat: 118.4, colName: 'Crosses' },
        { type: 'Per Game', topStat: 0.29, colName: 'Crosses' },
        { type: 'Team Stats', topStat: 11, colName: 'Crosses' },
        { type: 'Opponent Stats', topStat: 10, colName: 'Crosses' },
        { type: 'Opponent Per Game', topStat: 0.26, colName: 'Crosses' },
        { type: 'Opponent Per 90', topStat: 0.25, colName: 'Crosses' },
        { type: 'RANK', topStat: 20, color: true, colName: 'Crosses' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'Crosses' },
        { type: 'Z-Score', topStat: -1.984, colName: 'Crosses' },
        { type: 'Stat (Rank)', topStat: "11 (20)", color: true, colName: 'Crosses' },
        { type: 'Stat (Percentile)', topStat: "11 (0%)", color: true, colName: 'Crosses' },
        { type: 'Stat (Z-Score)', topStat: "11 (-1.98)", colName: 'Crosses' },
        { type: 'Totals', topStat: 11, colName: 'Crosses' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Creativity", function() {
    test.it('clicking Creativity link goes to correct page', function() {
      teamsPage.goToSection('creativity');
      filters.closeDropdownFilter('Pass Direction');
      filters.closeDropdownFilter('Pass Distance');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/creativity/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'ThrghBalls', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'IntentAst', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'KeyPass', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Pass From Field Location: Attacking Half), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Pass From Field Location:', 'Attacking Half');

        teamsPage.getTableStatFor(1,'CrossOpen').then(function(stat) {
          assert.equal(stat, 615, '1st row - CrossOpen');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'West Bromwich Albion', '1st row - Team');
        });
      });

      test.it('adding filter - (Pass Play Style: corner), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Pass Play Style:', 'corner');

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Newcastle United', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'KeyPass').then(function(stat) {
          assert.equal(stat, 15, '1st row - KeyPass');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'Chance');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-09', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'T 2-2')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '36:15', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 3);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 3);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Clearance by Jose Miguel da Rocha Fonte');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 14);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 14);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'LeiC', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '1 - 0', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '6:25 - 6:41 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the Newcastle United should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Newcastle United');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 59, 'pinned total - Chance');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Newcastle United', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Liverpool: 30\nWatford: 28\nNorwich City: 26', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'ExpA').then(function(stat) {
          assert.equal(stat, 4.13, 'row 2 ExpA');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "NOR vs CRY");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-08-22', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "AST");
        });          

        teamsPage.getTableStatFor(2,'IntentAst').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - IntentAst');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'BgChncCrtd').then(function(stat) {
          assert.equal(stat, 5, 'League 2 - BgChncCrtd');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.37, colName: 'KeyPass' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'KeyPass' },
        { type: 'Opponent Minutes Per', topStat: 78.1, colName: 'KeyPass' },
        { type: 'Per Game', topStat: 0.39, colName: 'KeyPass' },
        { type: 'Team Stats', topStat: 15, colName: 'KeyPass' },
        { type: 'Opponent Stats', topStat: 20, colName: 'KeyPass' },
        { type: 'Opponent Per Game', topStat: 0.53, colName: 'KeyPass' },
        { type: 'Opponent Per 90', topStat: 0.49, colName: 'KeyPass' },
        { type: 'RANK', topStat: 20, color: true, colName: 'KeyPass' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'KeyPass' },
        { type: 'Z-Score', topStat: -1.558, colName: 'KeyPass' },
        { type: 'Stat (Rank)', topStat: "15 (20)", color: true, colName: 'KeyPass' },
        { type: 'Stat (Percentile)', topStat: "15 (0%)", color: true, colName: 'KeyPass' },
        { type: 'Stat (Z-Score)', topStat: "15 (-1.56)", colName: 'KeyPass' },
        { type: 'Totals', topStat: 15, colName: 'KeyPass' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Shots", function() {
    test.it('clicking Shots link goes to correct page', function() {
      teamsPage.goToSection('shots');
      filters.closeDropdownFilter('Pass From Field Location');
      filters.closeDropdownFilter('Pass Play Style');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/shots/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'OnTarget%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'MinPerGoal', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colName: 'OpnPlySOT', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Shot Distance: 20 to 40), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Shot Distance:', 20, 40);

        teamsPage.getTableStatFor(1,'Off').then(function(stat) {
          assert.equal(stat, 78, '1st row - Off');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'West Bromwich Albion', '1st row - Team');
        });
      });

      test.it('adding filter - (Shot Style: Assisted), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Shot Style:', 'Assisted');

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'West Bromwich Albion', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'MinPerGoal').then(function(stat) {
          assert.equal(stat, 3659.7, '1st row - MinPerGoal');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'Blkd');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-15', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'T 0-0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '13:44', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 15);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by Troy Deeney');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'ManC', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '1:07 - 1:23 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for West Bromwich Albion should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'West Bromwich Albion');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 71, 'pinned total - Blkd');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'West Bromwich Albion', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Watford: 47\nArsenal: 43\nLeicester City: 40', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'%ShotInBox').then(function(stat) {
          assert.equal(stat, '8.4%', 'row 2 %ShotInBox');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "CRY vs ARS");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-08-29', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "MCI");
        });          

        teamsPage.getTableStatFor(2,'%ShtOutBox').then(function(stat) {
          assert.equal(stat, "100.0%", 'Opponent 2 - %ShtOutBox');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'%ShtRFoot').then(function(stat) {
          assert.equal(stat, '66.4%', 'League 2 - %ShtRFoot');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.37, colName: 'OpnPlySOT' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'OpnPlySOT' },
        { type: 'Opponent Minutes Per', topStat: 74.9, colName: 'OpnPlySOT' },
        { type: 'Per Game', topStat: 0.39, colName: 'OpnPlySOT' },
        { type: 'Team Stats', topStat: 15, colName: 'OpnPlySOT' },
        { type: 'Opponent Stats', topStat: 15, colName: 'OpnPlySOT' },
        { type: 'Opponent Per Game', topStat: 0.39, colName: 'OpnPlySOT' },
        { type: 'Opponent Per 90', topStat: 0.37, colName: 'OpnPlySOT' },
        { type: 'RANK', topStat: 20, color: true, colName: 'OpnPlySOT' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'OpnPlySOT' },
        { type: 'Z-Score', topStat: -1.597, colName: 'OpnPlySOT' },
        { type: 'Stat (Rank)', topStat: "15 (20)", color: true, colName: 'OpnPlySOT' },
        { type: 'Stat (Percentile)', topStat: "15 (0%)", color: true, colName: 'OpnPlySOT' },
        { type: 'Stat (Z-Score)', topStat: "15 (-1.60)", colName: 'OpnPlySOT' },
        { type: 'Totals', topStat: 15, colName: 'OpnPlySOT' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Defence", function() {
    test.it('clicking Defence link goes to correct page', function() {
      teamsPage.goToSection('defence');
      filters.closeDropdownFilter('Shot Distance');
      filters.closeDropdownFilter('Shot Style');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/defense/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'Clrnce', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'ShtBlk', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Aerial%', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Game Clock: 10 to 20), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Game Clock:', 10, 20);

        teamsPage.getTableStatFor(1,'Clrnce').then(function(stat) {
          assert.equal(stat, 113, '1st row - Clrnce');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Norwich City', '1st row - Team');
        });
      });

      test.it('adding filter - (Score Difference: 0 to 1), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Score Difference:', 0, 1);

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Norwich City', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'Int').then(function(stat) {
          assert.equal(stat, 40, '1st row - Int');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'ShtBlk');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-08', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'team-opponent-score').then(function(stat) {
          assert.equal(stat, '0 - 0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '12:34', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 11);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(7);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by Joel Ward');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(7).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 17);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'ManC', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '2 - 1', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '10:01 - 10:17 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Norwich City should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Norwich City');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 31, 'pinned total - ShtBlk');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Norwich City', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'West Ham United: 8\nSouthampton: 8', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'Duel%').then(function(stat) {
          assert.equal(stat, '45.9%', 'row 2 Duel%');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "CHE vs CRY");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-11-23', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "CHE");
        });          

        teamsPage.getTableStatFor(2,'Tackl').then(function(stat) {
          assert.equal(stat, 0, 'Opponent 2 - Tackl');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'CrossBlkd').then(function(stat) {
          assert.equal(stat, 4, 'League 2 - CrossBlkd');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 11.35, colName: 'Duels' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'Duels' },
        { type: 'Opponent Minutes Per', topStat: 9.8, colName: 'Duels' },
        { type: 'Per Game', topStat: 12.16, colName: 'Duels' },
        { type: 'Team Stats', topStat: 462, colName: 'Duels' },
        { type: 'Opponent Stats', topStat: 462, colName: 'Duels' },
        { type: 'Opponent Per Game', topStat: 12.16, colName: 'Duels' },
        { type: 'Opponent Per 90', topStat: 11.35, colName: 'Duels' },
        { type: 'RANK', topStat: 1, color: true, colName: 'Duels' },
        { type: 'Percentile', topStat: '100.0%', color: true, colName: 'Duels' },
        { type: 'Z-Score', topStat: 2.314, colName: 'Duels' },
        { type: 'Stat (Rank)', topStat: "462 (1)", color: true, colName: 'Duels' },
        { type: 'Stat (Percentile)', topStat: "462 (100%)", color: true, colName: 'Duels' },
        { type: 'Stat (Z-Score)', topStat: "462 (2.31)", colName: 'Duels' },
        { type: 'Totals', topStat: 462, colName: 'Duels' }
      ];
      
      test.it('sorting by Duels', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.clickTableHeaderFor('Duels');
        teamsPage.waitForTableToLoad();
      });    

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Set Pieces", function() {
    test.it('clicking Set Pieces link goes to correct page', function() {
      teamsPage.goToSection('setPieces');
      filters.closeDropdownFilter('Game Clock');
      filters.closeDropdownFilter('Score Difference');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/set\-pieces/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'FKOffTgt', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Corners', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'CrnrOnTgt', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Shot Outcome: On-target), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Shot Outcome:', 'On-target');

        teamsPage.getTableStatFor(1,'GoalCrnrs').then(function(stat) {
          assert.equal(stat, 2, '1st row - GoalCrnrs');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Stoke City', '1st row - Team');
        });
      });

      test.it('adding filter - (Team Win Probability: 50 to 100), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Team Win Probability:', 50, 100);

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'CrnrOnTgt').then(function(stat) {
          assert.equal(stat, 2, '1st row - CrnrOnTgt');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'GoalCrnrs');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-08', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'W 1-0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '71:49', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 2);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'Pass by Ashley Westwood');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 5);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 5);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'LeiC', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '3 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '38:45 - 39:01 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Aston Villa should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 9, 'pinned total - CrnrOnTgt');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'AFC Bournemouth: 7\nLeicester City: 7\nWest Bromwich Albion: 5\nSunderland: 5', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'FKOnTgt').then(function(stat) {
          assert.equal(stat, 1, 'row 2 FKOnTgt');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "CHE vs CRY");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-09-27', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "CHE");
        });          

        teamsPage.getTableStatFor(2,'ShotDirFK').then(function(stat) {
          assert.equal(stat, 1, 'Opponent 2 - ShotDirFK');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'FKOnTgt').then(function(stat) {
          assert.equal(stat, 1, 'League 2 - FKOnTgt');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.12, colName: 'CrnrOnTgt' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'CrnrOnTgt' },
        { type: 'Opponent Minutes Per', topStat: 226.2, colName: 'CrnrOnTgt' },
        { type: 'Per Game', topStat: 0.13, colName: 'CrnrOnTgt' },
        { type: 'Team Stats', topStat: 2, colName: 'CrnrOnTgt' },
        { type: 'Opponent Stats', topStat: 0, colName: 'CrnrOnTgt' },
        { type: 'Opponent Per Game', topStat: 0, colName: 'CrnrOnTgt' },
        { type: 'Opponent Per 90', topStat: 0, colName: 'CrnrOnTgt' },
        { type: 'RANK', topStat: 20, color: true, colName: 'CrnrOnTgt' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'CrnrOnTgt' },
        { type: 'Z-Score', topStat: -1.298, colName: 'CrnrOnTgt' },
        { type: 'Stat (Rank)', topStat: "2 (20)", color: true, colName: 'CrnrOnTgt' },
        { type: 'Stat (Percentile)', topStat: "2 (0%)", color: true, colName: 'CrnrOnTgt' },
        { type: 'Stat (Z-Score)', topStat: "2 (-1.30)", colName: 'CrnrOnTgt' },
        { type: 'Totals', topStat: 2, colName: 'CrnrOnTgt' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Goalkeeper", function() {
    test.it('clicking Goalkeeper link goes to correct page', function() {
      teamsPage.goToSection('goalkeeper');
      filters.closeDropdownFilter('Shot Outcome');
      filters.changeValuesForRangeSidebarFilter('Team Win Probability:', 0, 100);

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/gk\-shots/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'ShotsAg', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Save%', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'CleanSheet', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (GK Save Position: Keeper Dives), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('GK Save Position:', 'Keeper Dives');

        teamsPage.getTableStatFor(1,'ShotsAg').then(function(stat) {
          assert.equal(stat, 73, '1st row - ShotsAg');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Norwich City', '1st row - Team');
        });
      });

      test.it('adding filter - (Goal Mouth: On-target Right Half), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Goal Mouth:', 'On-target Right Half');

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'SOGAg').then(function(stat) {
          assert.equal(stat, 29, '1st row - SOGAg');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'ExpGAg');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-22', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'L 1-2')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '73:04', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 6);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 6);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'TakeOn by Adama Traore Diarra');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 9);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Liv', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '3 - 2', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '12:05 - 12:21 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Aston Villa should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 49, 'pinned total - Saves');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Manchester City: 25\nWest Ham United: 24\nWest Bromwich Albion: 23\nLiverpool: 22', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(10,11);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'Saves').then(function(stat) {
          assert.equal(stat, 34, 'row 2 Saves');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "NOR vs CRY");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-08-16', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "ARS");
        });          

        teamsPage.getTableStatFor(2,'ShotsAg').then(function(stat) {
          assert.equal(stat, 1, 'Opponent 2 - ShotsAg');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'SOGAg').then(function(stat) {
          assert.equal(stat, 34, 'League 2 - SOGAg');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 76, 76, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 0.07, colName: 'CleanSheet' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'CleanSheet' },
        { type: 'Opponent Minutes Per', topStat: 200.7, colName: 'CleanSheet' },
        { type: 'Per Game', topStat: 0.08, colName: 'CleanSheet' },
        { type: 'Team Stats', topStat: 2, colName: 'CleanSheet' },
        { type: 'Opponent Stats', topStat: 3, colName: 'CleanSheet' },
        { type: 'Opponent Per Game', topStat: 0.1, colName: 'CleanSheet' },
        { type: 'Opponent Per 90', topStat: 0.09, colName: 'CleanSheet' },
        { type: 'RANK', topStat: 20, color: true, colName: 'CleanSheet' },
        { type: 'Percentile', topStat: '0.0%', color: true, colName: 'CleanSheet' },
        { type: 'Z-Score', topStat: -1.902, colName: 'CleanSheet' },
        { type: 'Stat (Rank)', topStat: "2 (20)", color: true, colName: 'CleanSheet' },
        { type: 'Stat (Percentile)', topStat: "2 (0%)", color: true, colName: 'CleanSheet' },
        { type: 'Stat (Z-Score)', topStat: "2 (-1.90)", colName: 'CleanSheet' },
        { type: 'Totals', topStat: 2, colName: 'CleanSheet' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });
  });

  test.describe("#Page: Discipline", function() {
    test.it('clicking Discipline link goes to correct page', function() {
      teamsPage.goToSection('discipline');
      filters.closeDropdownFilter('GK Save Position');
      filters.closeDropdownFilter('Goal Mouth');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /teams\/discipline/);
      });
    });

    test.describe('#sorting', function() {
      var columns = [
        { colName: 'FoulCom', sortType: 'ferpNumber', defaultSort: 'asc' },
        { colName: 'FoulSuf', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'Yellow', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamsPage.clickTableHeaderFor(column.colName);
          teamsPage.waitForTableToLoad();
          teamsPage.getTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      }); 
    });
  
    test.describe("#filters", function() {
      test.it('adding filter - (Period: First Half), shows correct stats ', function() {
        filters.addSelectionToDropdownSidebarFilter('Period:', 'First Half');

        teamsPage.getTableStatFor(1,'FoulCom').then(function(stat) {
          assert.equal(stat, 171, '1st row - CrossOpen');
        });

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'West Ham United', '1st row - FoulCom');
        });
      });

      test.it('adding filter - (Pass Play Style: corner), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Team Win Probability:', 0, 25);

        teamsPage.getTableStatFor(1,'team').then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row - Team');
        });

        teamsPage.getTableStatFor(1, 'Yellow').then(function(stat) {
          assert.equal(stat, 15, '1st row - Yellow');
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamsPage.clickTableStatFor(1, 'Yellow');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamsPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '2015-08-08', 'row 1 date')
        });

        teamsPage.getPlayByPlayModalTableStatFor(1, 'result').then(function(stat) {
          assert.equal(stat, 'W 1-0')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamsPage.clickPlayPossessionIcon(1);
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('table shows correct plays', function() {
        teamsPage.getPlayPossessionTableStatFor(1,'playType').then(function(stat) {
          assert.equal(stat, 'Pass', '1st row playType');
        });

        teamsPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
          assert.equal(stat, '44:50', '1st row game clock');
        });
      });

      test.it('table shows correct number of plays', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 3);
        });
      });

      test.it('visual shows correct number of plays', function() {
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 3);
        });
      });

      test.it('hovering over play shows description in visual', function() {
        teamsPage.hoverOverPlayPossessionPlay(1);
        teamsPage.getPlayPossessionVisualDescription().then(function(stat) {
          assert.equal(stat, 'FreeKick by Marc Pugh');
        });
      });

      test.it('hovering over play highlights row in table', function() {
        teamsPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
          assert.equal(color, 'rgba(255, 251, 211, 1)');
        });
      });

      test.it('changing crop possessions slider updates visual', function() {
        teamsPage.changePlayPossessionCropSlider(50);
        teamsPage.getPlayPossessionVisualPlayCount().then(function(stat) {
          assert.equal(stat, 10);
        });  
      });

      test.it('changing crop possessions slider updates table', function() {
        teamsPage.getPlayPossessionTablePlayCount().then(function(stat) {
          assert.equal(stat, 10);
        });
      });

      test.it('clicking export button opens export modal', function() {
        teamsPage.clickPlayPossessionExportButton();
        teamsPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('clicking close button closes modals', function() {
        teamsPage.clickPlayPossessionExportCloseButton();
        teamsPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamsPage.clickPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamsPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'AVFC', 'video 1 - home team');
        });

        teamsPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '1 - 3', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamsPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '12:28 - 12:44 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamsPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamsPage.closePlayByPlayModal();

        teamsPage.isPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Aston Villa should add them to the pinned table', function() {
        teamsPage.clickTablePin(1);

        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa');
        });
      });

      test.it('selecting Leicester City from search should add team to table', function() {
        teamsPage.clickIsoBtn("on");
        driver.sleep(3000);
        teamsPage.addToIsoTable('leicester', 1)

        teamsPage.getIsoTableStat(2,4).then(function(stat) {
          assert.equal(stat, 'Leicester City', '2nd row team name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamsPage.getPinnedTotalTableStat(9).then(function(stat) {
          assert.equal(stat, 1, 'pinned total - Red');
        });
      });

      test.it('turning off isolation mode should show teams in iso table', function() {
        teamsPage.clickIsoBtn("off");
        teamsPage.getIsoTableStat(1,4).then(function(stat) {
          assert.equal(stat, 'Aston Villa', '1st row team name');
        });
      });
    });

    test.describe("#chart/editColumns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamsPage.clickChartColumnsBtn();
        teamsPage.openHistogram(9); 
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamsPage.hoverOverHistogramStack(2)
        teamsPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Aston Villa: 1\nWest Bromwich Albion: 1\nNorwich City: 1\nNewcastle United: 1\nStoke City: 1', 'tooltip for 2nd bar');
        });
      });

      test.it('clicking close histogram button should close histogram modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamsPage.openScatterChart(7,8);

        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        teamsPage.closeModal();
        teamsPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        teamsPage.clearTablePins();
      });   
    });

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Season");
        teamsPage.getTableStatFor(1, 'season').then(function(stat) {
          assert.equal(stat, 'Premier League 2015/2016 (England)');
        });

        teamsPage.getTableStatFor(2,'Yellow').then(function(stat) {
          assert.equal(stat, 13, 'row 2 Yellow');
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Game");
        teamsPage.getTableStatFor(1, 'game').then(function(stat) {
          assert.equal(stat, "WHU vs CHE");
        });          

        teamsPage.getTableStatFor(2,'date').then(function(stat) {
          assert.equal(stat, '2015-09-19', 'game 2 date');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamsPage.changeGroupBy("By Opponent");
        teamsPage.getTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, "WHU");
        });          

        teamsPage.getTableStatFor(2,'FoulCom').then(function(stat) {
          assert.equal(stat, 10, 'Opponent 2 - FoulCom');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamsPage.changeGroupBy("By League");
        teamsPage.getTableStatFor(1, 'league').then(function(stat) {
          assert.equal(stat, "Premier League (England)");
        });          

        teamsPage.getTableStatFor(2,'FoulSuf').then(function(stat) {
          assert.equal(stat, 74, 'League 2 - FoulSuf');
        });
      });

      test.it('selecting "Total"', function() {
        teamsPage.changeGroupBy("Totals");
      }); 
    });

    test.describe('#statsView', function() {
      var topColor = "rgba(255, 116, 116, 1)";
      var statViews = [
        { type: 'Per 90 Min', topStat: 2.56, colName: 'FoulCom' },            
        { type: 'Minutes Per', topStat: 0, colNmae: 'FoulCom' },
        { type: 'Opponent Minutes Per', topStat: 50.1, colName: 'FoulCom' },
        { type: 'Per Game', topStat: 2.73, colName: 'FoulCom' },
        { type: 'Team Stats', topStat: 82, colName: 'FoulCom' },
        { type: 'Opponent Stats', topStat: 54, colName: 'FoulCom' },
        { type: 'Opponent Per Game', topStat: 2.84, colName: 'FoulCom' },
        { type: 'Opponent Per 90', topStat: 2.63, colName: 'FoulCom' },
        { type: 'RANK', topStat: 17, color: true, colName: 'FoulCom' },
        { type: 'Percentile', topStat: '15.8%', color: true, colName: 'FoulCom', colorVal: "rgba(255, 122, 122, 1)" },
        { type: 'Z-Score', topStat: -1.227, colName: 'FoulCom' },
        { type: 'Stat (Rank)', topStat: "82 (17)", color: true, colName: 'FoulCom' },
        { type: 'Stat (Percentile)', topStat: "82 (16%)", color: true, colName: 'FoulCom', colorVal: "rgba(255, 122, 122, 1)" },
        { type: 'Stat (Z-Score)', topStat: "82 (-1.23)", colName: 'FoulCom' },
        { type: 'Totals', topStat: 82, colName: 'FoulCom' }
      ];

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamsPage.changeStatsView(statView.type);  
          teamsPage.getTableStatFor(1,statView.colName).then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamsPage.getTableStatBgColor(1,statView.colName).then(function(color) {
              var colorVal = statView.colorVal || topColor;
              assert.equal(color, colorVal);
            });
          });
        }
      });
    });
  });
});