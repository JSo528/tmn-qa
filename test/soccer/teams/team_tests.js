var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/soccer/navbar.js');
var Filters = require('../../../pages/soccer/filters.js');
var TablePage = require('../../../pages/soccer/tables/table_page.js');
var TeamsPage = require('../../../pages/soccer/teams/teams_page.js');
var TeamPage = require('../../../pages/soccer/teams/team_page.js');
var navbar, filters, tablePage, teamsPage, teamPage;

test.describe('#Section: Team', function() {
  test.it('should navigate to Barcelona team page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    tablePage = new TablePage(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    navbar.goToTablesPage();
    tablePage.changeSeason('Primera División 2015/2016 (Spain)');
    tablePage.clickTableStatFor(1,'Team');

    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /team\/Barcelona/);
    });
  });

  test.describe("#Page: Summary", function() {  
    test.it('set date range', function() {
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
    });

    test.describe("#stats", function() {
      test.describe('#sorting', function() {
        var columns = [
          { colName: 'Chance', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colName: 'Pass%', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colName: 'Touches', sortType: 'ferpNumber', defaultSort: 'desc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) teamPage.clickTableHeaderFor(column.colName);
            teamPage.waitForTableToLoad();
            teamPage.getTableStatsFor(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            teamPage.clickTableHeaderFor(column.colName);
            teamPage.waitForTableToLoad();
            teamPage.getTableStatsFor(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        }); 
      });

      test.describe('#createReport', function() {
        test.it('clicking create report btn opens custom report modal', function() {
          teamPage.clickCreateReportBtn();
          teamPage.changeReportName('Team Test');
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('adding stat adds column to preview table', function() {
          teamPage.addStatToCustomReport('[CrossClaim] "Crosses Claimed"', 'CClaimed');
          teamPage.isCustomReportColumnDisplayed('CClaimed').then(function(displayed) {
            assert.equal(displayed, true, 'CClaimed column should exist');
          });
        });

        test.it('removing stat removes column from preview table', function() {
          teamPage.removeStatFromCustomReport('[Duel%]');
          teamPage.isCustomReportColumnDisplayed('Duel%').then(function(displayed) {
            assert.equal(displayed, false, 'Duel% column should exist');
          });
        });

        test.it('changing stat alias changes column in preview table', function() {
          teamPage.changeStatInCustomReport('[OnTarget%]', null, 'OT%');
          teamPage.isCustomReportColumnDisplayed('OnTarget%').then(function(displayed) {
            assert.equal(displayed, false, 'OnTarget% column should not exist');
          });
          teamPage.isCustomReportColumnDisplayed('OT%').then(function(displayed) {
            assert.equal(displayed, true, 'OT% column should exist');
          });          
        });

        test.it('changing stat manually changes column in preview table', function() {
          teamPage.changeStatInCustomReport('[Pass%]', '[PsDist]', '');
          teamPage.isCustomReportColumnDisplayed('Pass%').then(function(displayed) {
            assert.equal(displayed, false, 'Pass% column should not exist');
          });
          teamPage.isCustomReportColumnDisplayed('PsDist').then(function(displayed) {
            assert.equal(displayed, true, 'PsDist column should exist');
          });
        });

        test.it('changing sort column column updates preview table', function() {
          teamPage.changeSortColumnInCustomReport('[Tackle%]');
          teamPage.getCustomReportPreviewTableStatsFor('Tackle%').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'desc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('changing sort order column updates preview table', function() {
          teamPage.changeSortOrderInCustomReport('ASC');
          teamPage.getCustomReportPreviewTableStatsFor('Tackle%').then(function(stats) {
            stats = extensions.normalizeArray(stats, 'ferpNumber');
            var sortedArray = extensions.customSortByType('ferpNumber', stats, 'asc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('adding filter updates preview table', function() {
          teamPage.addFilterToCustomReport('Period: Second Half');
          teamPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 44, 'UEFA shots');
          });
        });

        test.it('removing filter updates preview table', function() {
          teamPage.removeFilterFromCustomReport('Period');
          teamPage.getCustomReportPreviewTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 82, 'UEFA shots');
          });
        });

        test.it('pressing save button closes modal', function() {
          teamPage.clickSaveCustomReportButton();
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('closing modal if necessary', function() {
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) teamPage.clickCloseCustomReportButton();
          });
        });

        test.it('saving report sets it to current report', function() {
          teamPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Team Test');
          });
        });

        test.it('table stats show correct data for Tackle%', function() {
          teamPage.getTableStatsFor('Tackle%').then(function(stats) {
            assert.deepEqual(stats, ['50.6%','49.2%']);
          });
        });
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Field Location: Center Third), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event');
          filters.addSelectionToDropdownSidebarFilter('Field Location:', 'Center Third');

          teamPage.getTableStatFor(1,'Touches').then(function(stat) {
            assert.equal(stat, 4391, '1st row - Touches');
          });

          teamPage.getTableStatFor(2,'ExpG').then(function(stat) {
            assert.equal(stat, 18.69, '2nd - ExpG');
          });
        });
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'Ast');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-09-12', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-76:26', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Neymar da Silva Santos Junior', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '76:21', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 5);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 5);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'BallTouch by Gabriel Fernandez Arenas');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'RM', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '0 - 4', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '9:55 - 10:11 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(11,12);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });  
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total" shows the correct stats', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'Ast').then(function(stat) {
            assert.equal(stat, 21, 'Ast');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "MAL");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "MAL");
          });          

          teamPage.getTableStatFor(2,'Shot').then(function(stat) {
            assert.equal(stat, 6, 'Opponent 2 - shots');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'Ast').then(function(stat) {
            assert.equal(stat, 6, 'League 2 - Ast');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'Chance').then(function(stat) {
            assert.equal(stat, 34, '2nd row chance');
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking Splits tab', function() {
        teamPage.clickTab('splits')
      });

      test.describe('#editReport', function() {
        test.it('switching to Team Test report updates table', function() {
          teamPage.selectCustomReport('Team Test')
          teamPage.getTableStatFor(1, 'Chance').then(function(stat) {
            assert.equal(stat, 156, 'Row 1 (0-15) - Chance');
          });    
        });

        test.it('clicking edit report btn opens custom report modal', function() {
          teamPage.clickEditReportBtn();
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('changing report name', function() {
          teamPage.changeReportName('Team Test2');
        });

        test.it('pressing save button closes modal', function() {
          teamPage.clickSaveCustomReportButton();
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });

        test.it('close modal if neccessary', function() {
          teamPage.isCustomReportModalDisplayed().then(function(displayed) {
            if (displayed) teamPage.clickCloseCustomReportButton();
          });
        });


        test.it('saving report sets it to current report', function() {
          teamPage.getCurrentReport().then(function(stat) {
            assert.equal(stat, 'Team Test2');
          });
        });    
      });
    
      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 150.8, colName: 'Touches', rowNum: 1 },            
          { type: 'Minutes Per', topStat: 0.9, colName: 'PsAtt', rowNum: 2 },
          { type: 'Opponent Minutes Per', topStat: 86.3, colName: 'Chance', rowNum: 3 },
          { type: 'Per Game', topStat: '80.5%', colName: 'Ps%InA3rd', rowNum: 4 },
          { type: 'Opponent Stats', topStat: 17, colName: 'Ast', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: 1.04, colName: 'ExpG', rowNum: 7 },
          { type: 'Opponent Per 90', topStat: 7.65, colName: 'Shot', rowNum: 8 },
          { type: 'Totals', topStat: 27, colName: 'CClaimed', rowNum: 9 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#squad", function() {
      test.it('clicking Squad tab', function() {
        teamPage.clickTab('squad')
      });

      test.describe('#deleteReport', function() {
        test.it('clicking delete report removes report & sets default as the current report', function() {
            teamPage.selectCustomReport('Team Test2')
          teamPage.getCurrentReport().then(function(reportName) {
            if (reportName == 'Team Test2') {
              teamPage.clickDeleteReportBtn();
              teamPage.getCurrentReport().then(function(stat) {
                assert.equal(stat, 'default');
              });
            };
          });
        });
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'Touches');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2016-09-10', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-2:04', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Paul Pogba', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '2:50', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 16);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 16);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'BallTouch by Henrikh Mkhitaryan');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 24);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 24);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'ManU', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '1 - 2', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '1:56 - 2:12 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });
  });

  test.describe("#Page: Possessions", function() {  
    test.it('clicking Possessions link goes to correct page', function() {
      teamPage.goToSection('possessions');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /possessions/);
      });
    });

    test.describe("#stats", function() {
      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'PosWonA3rd');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-60:06', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Thomas Vermaelen', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '60:00', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 3);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 3);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Markel Susaeta Laskurain');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Sevilla', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '2 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '4:00 - 4:16 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total" shows the correct stats', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1, 'Poss%').then(function(stat) {
            assert.equal(stat, "65.6%", 'Poss%');
          });          
        });     

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'Poss%').then(function(stat) {
            assert.equal(stat, '74.1%', 'Opponent 2 - Poss%');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'PosWonD3rd').then(function(stat) {
            assert.equal(stat, 119, 'League 2 - PossWonD3rd');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'PsRec').then(function(stat) {
            assert.equal(stat, 3579);
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });
      test.describe("#filters", function() {
        test.it('adding filter - (Game Clock: 45 to 60), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.changeValuesForRangeSidebarFilter('Game Clock:', 45, 60);

          teamPage.getTableStatFor(1,'Touches').then(function(stat) {
            assert.equal(stat, 18506, '1st row - Touches');
          });

          teamPage.getTableStatFor(2,'PossLost').then(function(stat) {
            assert.equal(stat, 1493, '2nd - PossLost');
          });
        });
      });
    });

    test.describe("#squad", function() {
      test.it('clicking Squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.describe('#sorting', function() {
        var columns = [
          { colName: 'PosWonM3rd', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colName: 'PsRec', sortType: 'ferpNumber', defaultSort: 'desc' },
          { colName: 'Touches', sortType: 'ferpNumber', defaultSort: 'desc' },
        ]

        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (!column.initialCol) teamPage.clickTableHeaderFor(column.colName);
            teamPage.waitForTableToLoad();
            teamPage.getTableStatsFor(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
              assert.deepEqual(stats, sortedArray);
            })
          });

          test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
            teamPage.clickTableHeaderFor(column.colName);
            teamPage.waitForTableToLoad();
            teamPage.getTableStatsFor(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType);
              var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
              var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
              assert.deepEqual(stats, sortedArray);
            })
          });
        }); 
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(2, 'Touches');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-10-17', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-78:35', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Luis Alberto Suarez Diaz', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '75:59', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Patrick Ebert');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 16);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 16);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '5 - 2', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '78:27 - 78:43 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 35.5, colName: 'Touches', rowNum: 2 },            
          { type: 'Minutes Per', topStat: 48.5, colName: 'TouchOpBox', rowNum: 3 },
          { type: 'Opponent Minutes Per', topStat: 0.3, colName: 'PsRec', rowNum: 3 },
          { type: 'Per Game', topStat: 4.46, colName: 'PossLost', rowNum: 4 },
          { type: 'Opponent Stats', topStat: 25, colName: 'PosWonD3rd', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: 11.47, colName: 'PosWonM3rd', rowNum: 7 },
          { type: 'Opponent Per 90', topStat: 3.79, colName: 'PosWonA3rd', rowNum: 8 },
          { type: 'Totals', topStat: 10, colName: 'GM', rowNum: 9 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#playByPlay", function() {
      test.it('clicking Play By Play tab', function() {
        teamPage.clickTab('playByPlay');
      });
      
      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Andres Iniesta Lujan', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '0:32', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Andres Iniesta Lujan');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Athletic B', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '0 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:8 - 00:24 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });
  });

  test.describe("#Page: Passes", function() {  
    test.it('clicking Passes link goes to correct page', function() {
      teamPage.goToSection('passes');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /passes/);
      });
    });

    test.describe("#stats", function() {
      test.describe('#filters', function() {
        test.it('adding filter - (All Passers: Jordi Alba), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('All Passers:', 'Jordi Alba');

          teamPage.getTableStatFor(1,'PsAtt').then(function(stat) {
            assert.equal(stat, 801, 'Primera Division PsAtt');
          });
        });
      });

      test.describe('#visContainer', function() {
        test.it('drawing a box on the vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('left', 200, 0, 50, 50);
          teamPage.getTableStatFor(1, 'PsAtt').then(function(stat) {
            assert.equal(stat, 66, 'Jordi Alba PsAtt');
          });
        });

        test.it('changing the left vis container to scatter updates the visualization', function() {
          teamPage.changeVisChartTypeDropdown('left', 'Scatter');
          teamPage.getScatterPlayCount('left').then(function(stat) {
            assert.equal(stat, 105, '# of plays on left scatter chart');
          });
        });

        test.it('hovering over scatter play shows play detail', function() {
          teamPage.hoverOverScatterPlay('left', 1);
          teamPage.getVisContainerPlayDetail('left').then(function(stat) {
            assert.equal(stat, '2015-10-20 - Barcelona 2 @ BATE 08.9 yd Pass at 72:07 by Jordi Alba Ramos', 'left vis container play detail');
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking Splits tab', function() {
        teamPage.clickTab('splits');
      });
    
      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 3.43, colName: 'PsCmp', rowNum: 2 },            
          { type: 'Minutes Per', topStat: '87.3%', colName: 'Pass%', rowNum: 3 },
          { type: 'Opponent Minutes Per', topStat: '65.1%', colName: '%PassFwd', rowNum: 3 },
          { type: 'Per Game', topStat: 2.71, colName: 'PsOwnHalf', rowNum: 5 },
          { type: 'Opponent Stats', topStat: 0, colName: 'PsOppHalf', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: '0.0%', colName: 'Pass%OpHf', rowNum: 7 },
          { type: 'Opponent Per 90', topStat: 0, colName: 'PsIntoA3rd', rowNum: 8 },
          { type: 'Totals', topStat: 0, colName: 'PsInA3rd', rowNum: 9 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#squad", function() {
      test.it('clicking Squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.describe('#visContainer', function() {
        test.it('switching pass types for vis container should update visuals', function() {
          teamPage.changeVisFilterTypeDropdown('left', 'Passes To');
          teamPage.changeVisFilterTypeDropdown('right', 'Passes From');
          teamPage.getScatterPlayTransform('left', 1).then(function(stat) {
            assert.equal(stat, 'translate(-8,-8)', 'play 1 transform value');
          });
        });

        test.it('drawing another box on the vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('right', 300, 100, 50, 50);
          teamPage.getTableStatFor(4, 'PsAtt').then(function(stat) {
            assert.equal(stat, 110, 'Jordi Alba PsAtt');
          });
        });

        test.it('changing the vis container type to arrows updates the visualization', function() {
          teamPage.changeVisChartTypeDropdown('left', 'Arrows');
          teamPage.getArrowsPlayCount('left').then(function(stat) {
            assert.equal(stat, 128, '# of plays on right arrows chart');
          });
        });

        test.it('hovering over arrows play shows play detail', function() {
          teamPage.hoverOverArrowsPlay('left', 1);
          teamPage.getVisContainerPlayDetail('left').then(function(stat) {
            assert.equal(stat, '2015-09-16 - Barcelona 0 @ Roma 026.6 yd Pass at 3:09 by Jordi Alba Ramos', 'right vis container play detail');
          });
        });
      });
    });

    test.describe("#playByPlay", function() {
      test.it('clicking Play By Play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Rafael Alcantara do Nascimento', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '1:15', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 17);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Interception by Gorka Elustondo Urkola');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 23);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 23);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '2 - 2', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:-2 - 00:14 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });

    test.describe("#passMatrix", function() {
      test.it('clicking Pass Matrix tab', function() {
        teamPage.clickTab('passMatrix');
      });

      test.describe("#visContainer", function() {
        test.it('closing box on right vis container updates table', function() {
          teamPage.removeBoxOnVisContainer('right', 1);
          teamPage.getTableStatFor(1, 'count').then(function(stat) {
            assert.equal(stat, 5, '1st row play count');
          });
        });

        test.it('closing box on right vis container updates left visualization', function() {
          teamPage.getArrowsPlayCount('left').then(function(stat) {
            assert.equal(stat, 128, 'left vis play count');
          });
        });
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(2, 'count');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-10-17', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-78:35', 'row 1 period clock')
          });
        });
      });

      // TODO - uncomment once plays populate again
      // test.describe('#playPossession modal', function() {
      //   test.it('clicking on playPossession icon opens modal', function() {
      //     teamPage.clickPlayPossessionIcon(1);
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('table shows correct plays', function() {
      //     teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
      //       assert.equal(stat, 'Luis Alberto Suarez Diaz', '1st row player');
      //     });

      //     teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
      //       assert.equal(stat, '75:59', '1st row game clock');
      //     });
      //   });

      //   test.it('table shows correct number of plays', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('visual shows correct number of plays', function() {
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('hovering over play shows description in visual', function() {
      //     teamPage.hoverOverPlayPossessionPlay(1);
      //     teamPage.getPlayPossessionVisualDescription().then(function(stat) {
      //       assert.equal(stat, 'Pass by Patrick Ebert');
      //     });
      //   });

      //   test.it('hovering over play highlights row in table', function() {
      //     teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
      //       assert.equal(color, 'rgba(255, 251, 211, 1)');
      //     });
      //   });

      //   test.it('changing crop possessions slider updates visual', function() {
      //     teamPage.changePlayPossessionCropSlider(50);
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });  
      //   });

      //   test.it('changing crop possessions slider updates table', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });
      //   });

      //   test.it('clicking export button opens export modal', function() {
      //     teamPage.clickPlayPossessionExportButton();
      //     teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('clicking close button closes modals', function() {
      //     teamPage.clickPlayPossessionExportCloseButton();
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, false);
      //     });
      //   });
      // });

      // TODO - uncomment once plays populate again
      test.describe('#video', function() {
        // test.it('clicking video icon opens video in new window', function() {
        //   teamPage.clickPlayVideoIcon(1);
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        //   });
        // });

        // test.it('fixture info for video is correct', function() {
        //   teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
        //     assert.equal(stat, 'Barça', 'video 1 - home team');
        //   });

        //   teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
        //     assert.equal(stat, '5 - 2', 'video 1 - score');
        //   });
        // });

        // test.it('event time for video is correct', function() {
        //   teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
        //     assert.equal(stat, '78:27 - 78:43 (16s)');
        //   });
        // }); 

        // test.it('closing window goes back to original window', function() {
        //   teamPage.closeVideoPlayerWindow();
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /trumedianetworks/, 'Correct URL');
        //   });
        // });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });      
    });
  });

  test.describe("#Page: Creativity", function() {  
    test.it('clicking Creativity link goes to correct page', function() {
      teamPage.goToSection('creativity');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');
      filters.closeDropdownFilter('All Passers');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /creativity/);
      });
    });

    test.describe("#stats", function() {
      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'ThrghBalls');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-41:26', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Javier Eraso Goni', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '41:29', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Claim by Claudio Andres Bravo Munoz');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '2:03 - 2:19 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total"', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'CrossOpen').then(function(stat) {
            assert.equal(stat, 230, 'CrossOpen');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(3,'TakeOn%').then(function(stat) {
            assert.equal(stat, '54.8%', 'Opponent 3 - TakeOn%');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'KeyPass').then(function(stat) {
            assert.equal(stat, 67, 'League 2 - KeyPass');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'IntentAst').then(function(stat) {
            assert.equal(stat, 9);
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Teammates Any Off Field: Jordi Alba, J. Mascherano), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Teammates Any Off Field:', 'Jordi Alba');
          filters.addSelectionToDropdownSidebarFilter('Teammates Any Off Field:', 'J. Mascherano');

          teamPage.getTableStatFor(1,'TakeOn').then(function(stat) {
            assert.equal(stat, 621, '1st row - TakeOn');
          });

          teamPage.getTableStatFor(2,'BgChncCrtd').then(function(stat) {
            assert.equal(stat, 51, '2nd - BgChncCrtd');
          });
        });
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 153.5, colName: 'PsInA3rd', rowNum: 2 },            
          { type: 'Minutes Per', topStat: 9, colName: 'CrossOpen', rowNum: 3 },
          { type: 'Opponent Minutes Per', topStat: 165, colName: 'ThrghBalls', rowNum: 5 },
          { type: 'Per Game', topStat: 7.05, colName: 'Chance', rowNum: 6 },
          { type: 'Opponent Stats', topStat: 1, colName: 'Ast', rowNum: 7 },
          { type: 'Opponent Per Game', topStat: 0.14, colName: 'ExpA', rowNum: 8 },
          { type: 'Opponent Per 90', topStat: 3, colName: 'TakeOn', rowNum: 9 },
          { type: 'Totals', topStat: '47.7%', colName: 'TakeOn%', rowNum: 10 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#squad", function() {
      test.it('sort by KeyPass', function() {
        teamPage.clickTableHeaderFor('KeyPass');
      });

      test.it('clicking squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'KeyPass');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-10-17', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-78:35', 'row 1 period clock')
          });
        });
      });

      // TODO - uncomment once fixed
      // test.describe('#playPossession modal', function() {
      //   test.it('clicking on playPossession icon opens modal', function() {
      //     teamPage.clickPlayPossessionIcon(1);
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('table shows correct plays', function() {
      //     teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
      //       assert.equal(stat, 'Luis Alberto Suarez Diaz', '1st row player');
      //     });

      //     teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
      //       assert.equal(stat, '75:59', '1st row game clock');
      //     });
      //   });

      //   test.it('table shows correct number of plays', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('visual shows correct number of plays', function() {
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('hovering over play shows description in visual', function() {
      //     teamPage.hoverOverPlayPossessionPlay(1);
      //     teamPage.getPlayPossessionVisualDescription().then(function(stat) {
      //       assert.equal(stat, 'Pass by Patrick Ebert');
      //     });
      //   });

      //   test.it('hovering over play highlights row in table', function() {
      //     teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
      //       assert.equal(color, 'rgba(255, 251, 211, 1)');
      //     });
      //   });

      //   test.it('changing crop possessions slider updates visual', function() {
      //     teamPage.changePlayPossessionCropSlider(50);
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });  
      //   });

      //   test.it('changing crop possessions slider updates table', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });
      //   });

      //   test.it('clicking export button opens export modal', function() {
      //     teamPage.clickPlayPossessionExportButton();
      //     teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('clicking close button closes modals', function() {
      //     teamPage.clickPlayPossessionExportCloseButton();
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, false);
      //     });
      //   });
      // });

      test.describe('#video', function() {
        // test.it('clicking video icon opens video in new window', function() {
        //   teamPage.clickPlayVideoIcon(1);
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        //   });
        // });

        // test.it('fixture info for video is correct', function() {
        //   teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
        //     assert.equal(stat, 'Barça', 'video 1 - home team');
        //   });

        //   teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
        //     assert.equal(stat, '5 - 2', 'video 1 - score');
        //   });
        // });

        // test.it('event time for video is correct', function() {
        //   teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
        //     assert.equal(stat, '78:27 - 78:43 (16s)');
        //   });
        // }); 

        // test.it('closing window goes back to original window', function() {
        //   teamPage.closeVideoPlayerWindow();
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /trumedianetworks/, 'Correct URL');
        //   });
        // });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });

    test.describe("#playByPlay", function() {
      test.it('clicking play by play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Andres Iniesta Lujan', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '0:32', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Andres Iniesta Lujan');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Athletic B', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '0 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:8 - 00:24 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });
  });

  test.describe("#Page: Shots", function() {  
    test.it('clicking Shots link goes to correct page', function() {
      teamPage.goToSection('shots');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /shots/);
      });
    });

    test.describe('#stats', function() {
      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total"', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'OpnPlySOT').then(function(stat) {
            assert.equal(stat, 116, 'OpnPlySOT');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(3,'Off').then(function(stat) {
            assert.equal(stat, 5, 'Opponent 3 - Off');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'MinPerGoal').then(function(stat) {
            assert.equal(stat, 36, 'League 2 - MinPerGoal');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'%ShotHead').then(function(stat) {
            assert.equal(stat, '10.8%', '%ShotHead');
          });
        });
      });

      test.describe('#visContainer', function() {
        test.it('drawing a box on the right vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('right', 100, 0, 200, 200);
          teamPage.getTableStatFor(1, 'Shot').then(function(stat) {
            assert.equal(stat, 148, 'Primera Division Shot');
          });
        });

        test.it('drawing a box on the right vis container updates the left vis container', function() {
          teamPage.getVisShotCount('left').then(function(stat) {
            assert.equal(stat, 199, '# of shots on left vis container');
          });
        });

        test.it('hovering over goal mouth shot shows play detail', function() {
          teamPage.hoverOverVisShot('left', 1);
          teamPage.getVisContainerPlayDetail('left').then(function(stat) {
            assert.equal(stat, '2015-12-12 - Barcelona 1 @ Deportivo La Coruña 0 - [Final: Barcelona 2 @ Deportivo La Coruña 2]ExG: 0.03, 28.6 yd Miss at 45:01 by Andres Iniesta Lujan with right foot (Barcelona)individual play Goalkeeper German Dario Lux', 'left vis container play detail');
          });
        });

        test.it('hovering over half field shot shows play detail', function() {
          teamPage.hoverOverVisShot('right', 1);
          teamPage.getVisContainerPlayDetail('right').then(function(stat) {
            assert.equal(stat, '2015-10-31 - Barcelona 0 @ Getafe 0 - [Final: Barcelona 2 @ Getafe 0]ExG: 0.49, 2.4 yd Miss at 0:34 by Munir El Haddadi Mohamed with left foot (Barcelona)volley,individual play Goalkeeper Vicente Guaita Panadero', 'left vis container play detail');
          });
        });
      });
    });

    test.describe('#splits', function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 1.91, colName: 'Goal', rowNum: 1 },            
          { type: 'Minutes Per', topStat: 8.8, colName: 'Shot', rowNum: 2 },
          { type: 'Opponent Minutes Per', topStat: 45, colName: 'OpnPlySOT', rowNum: 3 },
          { type: 'Per Game', topStat: 2.14, colName: 'Off', rowNum: 5 },
          { type: 'Opponent Stats', topStat: 17, colName: 'Blkd', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: '47.1%', colName: 'OnTarget%', rowNum: 8 },
          { type: 'Opponent Per 90', topStat: '14.3%', colName: 'ShotConv', rowNum: 9 },
          { type: 'Totals', topStat: 141.4, colName: 'MinPerGoal', rowNum: 10 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe('#squad', function() {
      test.it('clicking squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.it('sort by Goal', function() {
        teamPage.clickTableHeaderFor('Goal');
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Shooters: L. Suarez), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Shooters:', 'L. Suarez');

          teamPage.getTableStatFor(1,'Shot').then(function(stat) {
            assert.equal(stat, 45, 'L Suarez - Shots');
          });

          teamPage.getTableStatFor(2,'Goal').then(function(stat) {
            assert.equal(stat, 0, 'C Bravo - Goals');
          });
        });
      });  

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'Goal');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-53:51', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Jordi Alba Ramos', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '53:23', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(2);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Sergio Busquets i Burgos');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(2).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '6 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '14:26 - 14:42 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    
      test.describe("#visContainer", function() {
        test.it('switching to third field changes background image', function() {
          teamPage.changeVisChartTypeDropdown('right', 'Third Field');
          teamPage.isThirdFieldImageDisplayed('right').then(function(displayed) {
            assert.equal(displayed, true);
          }); 
        });

        test.it('checking scale shots updates the size of the circles', function() {
          teamPage.toggleScaleShotsByExpectedValue();
          teamPage.getVisShotPixelHeight('left', 5).then(function(height) {
            assert.equal(height, 13.641114323983947, 'height size for 5th shot');
          }); 
        });
      });
    });

    test.describe('#playByPlay', function() {
      test.it('clicking play by play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Jordi Alba Ramos', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '53:23', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(4);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Sergio Busquets i Burgos');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(4).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 9);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 0', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '2:11 - 2:27 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });

    test.describe('#assistMatrix', function() {    
      test.it('clicking Assist Matrix tab', function() {
        teamPage.clickTab('assistMatrix');
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'count');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P2-53:51', 'row 1 period clock')
          });
        });
      });

      // TODO - uncomment this once fixed
    //   test.describe('#playPossession modal', function() {
    //     test.it('clicking on playPossession icon opens modal', function() {
    //       teamPage.clickPlayPossessionIcon(1);
    //       teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, true);
    //       });
    //     });

    //     test.it('table shows correct plays', function() {
    //       teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
    //         assert.equal(stat, 'Sergio Busquets i Burgos', '1st row player');
    //       });

    //       teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
    //         assert.equal(stat, '60:00', '1st row game clock');
    //       });
    //     });

    //     test.it('table shows correct number of plays', function() {
    //       teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //         assert.equal(stat, 2);
    //       });
    //     });

    //     test.it('visual shows correct number of plays', function() {
    //       teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //         assert.equal(stat, 2);
    //       });
    //     });

    //     test.it('hovering over play shows description in visual', function() {
    //       teamPage.hoverOverPlayPossessionPlay(1);
    //       teamPage.getPlayPossessionVisualDescription().then(function(stat) {
    //         assert.equal(stat, 'Pass by Ivan Rakitic');
    //       });
    //     });

    //     test.it('hovering over play highlights row in table', function() {
    //       teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
    //         assert.equal(color, 'rgba(255, 251, 211, 1)');
    //       });
    //     });

    //     test.it('changing crop possessions slider updates visual', function() {
    //       teamPage.changePlayPossessionCropSlider(50);
    //       teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //         assert.equal(stat, 7);
    //       });  
    //     });

    //     test.it('changing crop possessions slider updates table', function() {
    //       teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //         assert.equal(stat, 7);
    //       });
    //     });

    //     test.it('clicking export button opens export modal', function() {
    //       teamPage.clickPlayPossessionExportButton();
    //       teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, true);
    //       });
    //     });

    //     test.it('clicking close button closes modals', function() {
    //       teamPage.clickPlayPossessionExportCloseButton();
    //       teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, false);
    //       });
    //     });
    //   });

      test.describe('#video', function() {
    //     test.it('clicking video icon opens video in new window', function() {
    //       teamPage.clickPlayVideoIcon(1);
    //       filters.getCurrentUrl().then(function(url) {
    //         assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
    //       });
    //     });

    //     test.it('fixture info for video is correct', function() {
    //       teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
    //         assert.equal(stat, 'Barça', 'video 1 - home team');
    //       });

    //       teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
    //         assert.equal(stat, '0 - 2', 'video 1 - score');
    //       });
    //     });

    //     test.it('event time for video is correct', function() {
    //       teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
    //         assert.equal(stat, '9:26 - 9:42 (16s)');
    //       });
    //     }); 

    //     test.it('closing window goes back to original window', function() {
    //       teamPage.closeVideoPlayerWindow();
    //       filters.getCurrentUrl().then(function(url) {
    //         assert.match(url, /trumedianetworks/, 'Correct URL');
    //       });
    //     });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });
  });

  test.describe("#Page: Defence", function() {  
    test.it('clicking Defence link goes to correct page', function() {
      teamPage.goToSection('defence');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');
      filters.closeDropdownFilter('Shooters');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /defense/);
      });
    });

    test.describe('#stats', function() {
      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 16.56, colName: 'Tckl', rowNum: 1 },            
          { type: 'Minutes Per', topStat: '50.6%', colName: 'Tackle%', rowNum: 2 },
          { type: 'Opponent Minutes Per', topStat: 4.8, colName: 'Clrnce', rowNum: 1 },
          { type: 'Per Game', topStat: 16.5, colName: 'Int', rowNum: 2 },
          { type: 'Opponent Stats', topStat: 54, colName: 'ShtBlk', rowNum: 1 },
          { type: 'Opponent Per Game', topStat: '53.5%', colName: 'Duel%', rowNum: 2 },
          { type: 'Opponent Per 90', topStat: 19.69, colName: 'Aerials', rowNum: 1 },
          { type: 'Totals', topStat: 60, colName: 'ShotsAg', rowNum: 2 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      }); 

      test.describe('#visContainer', function() {
        test.it('drawing a box on the vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('left', 200, 200, 50, 50);
          teamPage.getTableStatFor(1, 'Aerials').then(function(stat) {
            assert.equal(stat, 5, 'Primera Division Aerials');
          });
        });

        test.it('changing the left vis container to scatter updates the visualization', function() {
          teamPage.changeVisChartTypeDropdown('left', 'Scatter');
          teamPage.getScatterPlayCount('left').then(function(stat) {
            assert.equal(stat, 5, '# of plays on left scatter chart');
          });
        });

        test.it('hovering over scatter play shows play detail', function() {
          teamPage.hoverOverScatterPlay('left', 1);
          teamPage.getVisContainerPlayDetail('left').then(function(stat) {
            assert.equal(stat, '2015-12-12 - Barcelona 2 @ Deportivo La Coruña 0Tackle at 64:52 by Ivan Rakitic', 'left vis container play detail');
          });
        });
      }); 


      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total" shows the correct stats', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1, 'Int').then(function(stat) {
            assert.equal(stat, 4, "ShotsAg");
          });          
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'Duel%').then(function(stat) {
            assert.equal(stat, '100.0%', 'Opponent 2 - Duel%');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'Recovery').then(function(stat) {
            assert.equal(stat, 3, 'League 2 - Recovery');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'Int').then(function(stat) {
            assert.equal(stat, 1, 'season 2 Int');
          });
        });

    
      });
    });

    test.describe('#splits', function() {
      test.it('clicking Splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe('#filters', function() {
        test.it('adding filter - (Teammates All Off Field: Jordi Alba), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Teammates All Off Field:', 'Jordi Alba');

          teamPage.getTableStatFor(2,'Recovery').then(function(stat) {
            assert.equal(stat, 2, 'Home Recovery');
          });
        });
      });

      test.describe('#visContainer', function() {
        test.it('drawing another box on the vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('left', 0, 100, 100, 200);
          teamPage.getTableStatFor(3, 'Tckl').then(function(stat) {
            assert.equal(stat, 3, 'Road Tckl');
          });
        });

        test.it('switching filter type to clearances for left vis container should update left visual', function() {
          teamPage.changeVisFilterTypeDropdown('left', 'Clearances');
          teamPage.getScatterPlayTransform('left', 1).then(function(stat) {
            assert.equal(stat, 'translate(-8,-8)', 'play 1 transform value');
          });
        });

        test.it('switching filter type to interceptions for right vis container should update right visual', function() {
          teamPage.changeVisFilterTypeDropdown('right', 'Interceptions');
          teamPage.getTagCloudPlayerFontSize('right', 1).then(function(stat) {
            assert.equal(stat, '40px', 'player 1 font size');
          });
        });
      });      
    });

    test.describe('#squad', function() {
      test.it('clicking Squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'Recovery');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-11-28', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-37:44', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Lionel Andres Messi Cuccittini', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '37:32', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 5);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 5);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Aritz Elustondo Irribaria');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Chile Snr', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '2 - 0', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '2:48 - 3:04 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });

    test.describe('#playByPlay', function() {
      test.it('clicking Play By Play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Neymar da Silva Santos Junior', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '12:10', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Roger Marti Salvador');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 19);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 19);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Celta', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:6 - 00:22 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });      
    });
  });

  test.describe("#Page: Set Pieces", function() {  
    test.it('clicking Set Pieces link goes to correct page', function() {
      teamPage.goToSection('setPieces');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');
      filters.closeDropdownFilter('Teammates All Off Field');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /set\-pieces/);
      });
    });

    test.describe("#stats", function() {
      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'CrnrOffTgt');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-14:00', 'row 1 period clock')
          });
        });
      });

      // TODO - uncomment once fixed
      // test.describe('#playPossession modal', function() {
      //   test.it('clicking on playPossession icon opens modal', function() {
      //     teamPage.clickPlayPossessionIcon(1);
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('table shows correct plays', function() {
      //     teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
      //       assert.equal(stat, 'Sergio Busquets i Burgos', '1st row player');
      //     });

      //     teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
      //       assert.equal(stat, '14:00', '1st row game clock');
      //     });
      //   });

      //   test.it('table shows correct number of plays', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 2);
      //     });
      //   });

      //   test.it('visual shows correct number of plays', function() {
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 2);
      //     });
      //   });

      //   test.it('hovering over play shows description in visual', function() {
      //     teamPage.hoverOverPlayPossessionPlay(1);
      //     teamPage.getPlayPossessionVisualDescription().then(function(stat) {
      //       assert.equal(stat, 'Pass by Ivan Rakitic');
      //     });
      //   });

      //   test.it('hovering over play highlights row in table', function() {
      //     teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
      //       assert.equal(color, 'rgba(255, 251, 211, 1)');
      //     });
      //   });

      //   test.it('changing crop possessions slider updates visual', function() {
      //     teamPage.changePlayPossessionCropSlider(50);
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });  
      //   });

      //   test.it('changing crop possessions slider updates table', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('clicking export button opens export modal', function() {
      //     teamPage.clickPlayPossessionExportButton();
      //     teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('clicking close button closes modals', function() {
      //     teamPage.clickPlayPossessionExportCloseButton();
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, false);
      //     });
      //   });
      // });

      test.describe('#video', function() {
        // test.it('clicking video icon opens video in new window', function() {
        //   teamPage.clickPlayVideoIcon(1);
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        //   });
        // });

        // test.it('fixture info for video is correct', function() {
        //   teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
        //     assert.equal(stat, 'Barça', 'video 1 - home team');
        //   });

        //   teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
        //     assert.equal(stat, '5 - 2', 'video 1 - score');
        //   });
        // });

        // test.it('event time for video is correct', function() {
        //   teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
        //     assert.equal(stat, '9:26 - 9:42 (16s)');
        //   });
        // }); 

        // test.it('closing window goes back to original window', function() {
        //   teamPage.closeVideoPlayerWindow();
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /trumedianetworks/, 'Correct URL');
        //   });
        // });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total"', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'ShrtCrnrs').then(function(stat) {
            assert.equal(stat, 50, 'ShrtCrnrs');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(3,'FKOnTgt%').then(function(stat) {
            assert.equal(stat, '50.0%', 'Opponent 3 - FKOnTgt%');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'ShrtCrnrs').then(function(stat) {
            assert.equal(stat, 14, 'League 2 - ShrtCrnrs');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'ShotDirFK').then(function(stat) {
            assert.equal(stat, 5);
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Teammates All On Field: Jordi Alba, J. Mascherano), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Teammates All On Field:', 'Jordi Alba');
          filters.addSelectionToDropdownSidebarFilter('Teammates All On Field:', 'J. Mascherano');

          teamPage.getTableStatFor(1,'CrnrOffTgt').then(function(stat) {
            assert.equal(stat, 10, '1st row - CrnrOffTgt');
          });

          teamPage.getTableStatFor(2,'ChncSetPl').then(function(stat) {
            assert.equal(stat, 9, '2nd - ChncSetPl');
          });
        });
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 1, colName: 'CrnrOffTgt', rowNum: 2 },            
          { type: 'Minutes Per', topStat: 105, colName: 'CrnrOnTgt', rowNum: 3 },
          { type: 'Opponent Minutes Per', topStat: '-', colName: 'ShotDirFK', rowNum: 5 },
          { type: 'Per Game', topStat: '83.3%', colName: 'RgtCrnrSc%', rowNum: 6 },
          { type: 'Opponent Stats', topStat: 0, colName: 'FKOnTgt', rowNum: 7 },
          { type: 'Opponent Per Game', topStat: '66.7%', colName: 'Ps%CrnrCrs', rowNum: 7 },
          { type: 'Opponent Per 90', topStat: 0, colName: 'GoalCrnrs', rowNum: 8 },
          { type: 'Totals', topStat: '42.9%', colName: 'FKOnTgt%', rowNum: 1 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#squad", function() {
      test.it('sort by chncSetPl', function() {
        teamPage.clickTableHeaderFor('ChncSetPl');
      });

      test.it('clicking squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'ChncSetPl');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-10-17', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-13:53', 'row 1 period clock')
          });
        });
      });

      // TODO - uncomment once fixed
    //   test.describe('#playPossession modal', function() {
    //     test.it('clicking on playPossession icon opens modal', function() {
    //       teamPage.clickPlayPossessionIcon(1);
    //       teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, true);
    //       });
    //     });

    //     test.it('table shows correct plays', function() {
    //       teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
    //         assert.equal(stat, 'Luis Alberto Suarez Diaz', '1st row player');
    //       });

    //       teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
    //         assert.equal(stat, '75:59', '1st row game clock');
    //       });
    //     });

    //     test.it('table shows correct number of plays', function() {
    //       teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //         assert.equal(stat, 7);
    //       });
    //     });

    //     test.it('visual shows correct number of plays', function() {
    //       teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //         assert.equal(stat, 7);
    //       });
    //     });

    //     test.it('hovering over play shows description in visual', function() {
    //       teamPage.hoverOverPlayPossessionPlay(1);
    //       teamPage.getPlayPossessionVisualDescription().then(function(stat) {
    //         assert.equal(stat, 'Pass by Patrick Ebert');
    //       });
    //     });

    //     test.it('hovering over play highlights row in table', function() {
    //       teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
    //         assert.equal(color, 'rgba(255, 251, 211, 1)');
    //       });
    //     });

    //     test.it('changing crop possessions slider updates visual', function() {
    //       teamPage.changePlayPossessionCropSlider(50);
    //       teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
    //         assert.equal(stat, 16);
    //       });  
    //     });

    //     test.it('changing crop possessions slider updates table', function() {
    //       teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
    //         assert.equal(stat, 16);
    //       });
    //     });

    //     test.it('clicking export button opens export modal', function() {
    //       teamPage.clickPlayPossessionExportButton();
    //       teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, true);
    //       });
    //     });

    //     test.it('clicking close button closes modals', function() {
    //       teamPage.clickPlayPossessionExportCloseButton();
    //       teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
    //         assert.equal(displayed, false);
    //       });
    //     });
    //   });

      test.describe('#video', function() {
    //     test.it('clicking video icon opens video in new window', function() {
    //       teamPage.clickPlayVideoIcon(1);
    //       filters.getCurrentUrl().then(function(url) {
    //         assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
    //       });
    //     });

    //     test.it('fixture info for video is correct', function() {
    //       teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
    //         assert.equal(stat, 'Barça', 'video 1 - home team');
    //       });

    //       teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
    //         assert.equal(stat, '5 - 2', 'video 1 - score');
    //       });
    //     });

    //     test.it('event time for video is correct', function() {
    //       teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
    //         assert.equal(stat, '78:27 - 78:43 (16s)');
    //       });
    //     }); 

    //     test.it('closing window goes back to original window', function() {
    //       teamPage.closeVideoPlayerWindow();
    //       filters.getCurrentUrl().then(function(url) {
    //         assert.match(url, /trumedianetworks/, 'Correct URL');
    //       });
    //     });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });

    test.describe("#playByPlay", function() {
      test.it('clicking play by play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Andres Iniesta Lujan', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '0:32', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 1);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Andres Iniesta Lujan');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Athletic B', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '0 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:8 - 00:24 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });
  });

  test.describe("#Page: Goalkeeper", function() {  
    test.it('clicking Goalkeeper link goes to correct page', function() {
      teamPage.goToSection('goalkeeper');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');
      filters.closeDropdownFilter('Teammates All On Field');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /gk\-shots/);
      });
    });

    test.describe('#stats', function() {
      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,9);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total"', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'Saves').then(function(stat) {
            assert.equal(stat, 65, 'Saves');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(3,'CrossClaim').then(function(stat) {
            assert.equal(stat, 1, 'Opponent 3 - CrossClaim');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'SOGAg').then(function(stat) {
            assert.equal(stat, 23, 'League 2 - SOGAg');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(2,'Cleared').then(function(stat) {
            assert.equal(stat, 7, 'Cleared');
          });
        });
      });

      test.describe('#visContainer', function() {
        test.it('drawing a box on the right vis container updates the table', function() {
          teamPage.drawBoxOnVisContainer('right', 100, 0, 200, 200);
          teamPage.getTableStatFor(1, 'ShotsAg').then(function(stat) {
            assert.equal(stat, 100, 'Primera Division ShotsAg');
          });
        });

        test.it('drawing a box on the right vis container updates the left vis container', function() {
          teamPage.getVisShotCount('left').then(function(stat) {
            assert.equal(stat, 101, '# of shots on left vis container');
          });
        });

        test.it('hovering over goal mouth shot shows play detail', function() {
          teamPage.hoverOverVisShot('left', 1);
          teamPage.getVisContainerPlayDetail('left').then(function(stat) {
            assert.equal(stat, '2015-08-23 - Barcelona 0 @ Athletic Club 0 - [Final: Barcelona 1 @ Athletic Club 0]ExG: 0.13, 8.8 yd Miss at 23:36 by Aritz Aduriz Zubeldia (Athletic Club)', 'left vis container play detail');
          });
        });

        test.it('hovering over half field shot shows play detail', function() {
          teamPage.hoverOverVisShot('right', 1);
          teamPage.getVisContainerPlayDetail('right').then(function(stat) {
            assert.equal(stat, '2015-08-23 - Barcelona 0 @ Athletic Club 0 - [Final: Barcelona 1 @ Athletic Club 0]ExG: 0.13, 8.8 yd Miss at 23:36 by Aritz Aduriz Zubeldia (Athletic Club)', 'left vis container play detail');
          });
        });
      });
    });

    test.describe('#splits', function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 0.55, colName: 'GAg', rowNum: 1 },            
          { type: 'Minutes Per', topStat: 120.6, colName: 'ExpGAg', rowNum: 2 },
          { type: 'Opponent Minutes Per', topStat: 24.3, colName: 'SOGAg', rowNum: 3 },
          { type: 'Per Game', topStat: 0.64, colName: 'Saves', rowNum: 5 },
          { type: 'Opponent Stats', topStat: 0, colName: 'CleanSheet', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: '33.3%', colName: 'Save%', rowNum: 8 },
          { type: 'Opponent Per 90', topStat: 0, colName: 'KeeperCtch', rowNum: 9 },
          { type: 'Totals', topStat: 6, colName: 'Cross', rowNum: 10 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe('#squad', function() {
      test.it('clicking squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.it('sort by ShotsAg', function() {
        teamPage.clickTableHeaderFor('ShotsAg');
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Goalies: C. Bravo), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Goalies:', 'C. Bravo');

          teamPage.getTableStatFor(1,'ShotsAg').then(function(stat) {
            assert.equal(stat, 73, 'C. Bravo - ShotsAg');
          });

          teamPage.getTableStatFor(2,'ShotsAg').then(function(stat) {
            assert.equal(stat, 0, 'T Vermaelen - ShotsAg');
          });
        });
      });  

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'ShotsAg');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-14:17', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Javier Alejandro Mascherano', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '13:33', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(3);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Aritz Aduriz Zubeldia');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(3).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 0', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '1:55 - 2:11 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    
      test.describe("#visContainer", function() {
        test.it('switching to third field changes background image', function() {
          teamPage.changeVisChartTypeDropdown('left', 'Third Field');
          teamPage.isThirdFieldImageDisplayed('left').then(function(displayed) {
            assert.equal(displayed, true);
          }); 
        });

        test.it('checking scale shots updates the size of the circles', function() {
          teamPage.toggleScaleShotsByExpectedValue();
          teamPage.getVisShotPixelHeight('right', 1).then(function(height) {
            assert.equal(height, 6.44980619863884, 'height size for 1st shot');
          }); 
        });
      });
    });

    test.describe('#playByPlay', function() {
      test.it('clicking play by play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Javier Alejandro Mascherano', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '13:33', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 7);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Gorka Elustondo Urkola');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(2).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 0', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '1:55 - 2:11 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });
  });

  test.describe("#Page: Discipline", function() {  
    test.it('clicking Discipline link goes to correct page', function() {
      teamPage.goToSection('discipline');
      filters.changeFilterGroupDropdown('Game');
      filters.changeValuesForDateSidebarFilter('Date Range:', '2015-01-01', '2016-01-01');
      teamPage.clickTab('stats');
      filters.closeDropdownFilter('Goalies');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /discipline/);
      });
    });

    test.describe("#stats", function() {
      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'FoulCom');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-13:53', 'row 1 period clock')
          });
        });
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Javier Alejandro Mascherano', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '13:33', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 6);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Lionel Andres Messi Cuccittini');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 15);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '1 - 0', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '3:28 - 3:44 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });

      test.describe("#chart/editColumns", function() {
        // histograms
        test.it('clicking show histogram link should open histogram modal', function() {
          teamPage.clickChartColumnsBtn();
          teamPage.openHistogram(7); 
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('hovering over bar should show stats for teams', function() {
          teamPage.hoverOverHistogramStack(1)
          teamPage.getTooltipText().then(function(text) {
            assert.equal(text, 'Watford: 0', 'tooltip for 1st bar');
          });
        });

        test.it('clicking close histogram button should close histogram modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        });                 

        // scatter plots          
        test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
          teamPage.openScatterChart(5,7);

          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, true);
          }); 
        });

        test.it('clicking close button should close scatter chart modal', function() {
          teamPage.closeModal();
          teamPage.isModalDisplayed().then(function(isDisplayed) {
            assert.equal(isDisplayed, false);
          }); 
        }); 
      });

      test.describe('#groupBy', function() {
        test.it('selecting "Total"', function() {
          teamPage.changeGroupBy("Totals");

          teamPage.getTableStatFor(1,'FoulSuf').then(function(stat) {
            assert.equal(stat, 345, 'FoulSuf');
          });
        }); 

        test.it('selecting "By Game" shows the correct stats', function() {
          teamPage.changeGroupBy("By Game");
          teamPage.getTableStatFor(1, 'opp').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(2,'date').then(function(stat) {
            assert.equal(stat, '2015-08-29', 'game 2 date');
          });
        });

        test.it('selecting "By Opponent" shows the correct stats', function() {
          teamPage.changeGroupBy("By Opponent");
          teamPage.getTableStatFor(1, 'opponent').then(function(stat) {
            assert.equal(stat, "ATH");
          });          

          teamPage.getTableStatFor(3,'Yellow').then(function(stat) {
            assert.equal(stat, 1, 'Opponent 3 - Yellow');
          });
        });

        test.it('selecting "By League" shows the correct stats', function() {
          teamPage.changeGroupBy("By League");
          teamPage.getTableStatFor(1, 'league').then(function(stat) {
            assert.equal(stat, "Primera División (Spain)");
          });          

          teamPage.getTableStatFor(2,'2ndYellow').then(function(stat) {
            assert.equal(stat, 0, 'League 2 - 2ndYellow');
          });
        });

        test.it('selecting "By Season" shows the correct stats', function() {
          teamPage.changeGroupBy("By Season");
          teamPage.getTableStatFor(1, 'seasonName').then(function(stat) {
            assert.equal(stat, 'Primera División 2015/2016 (Spain)');
          });

          teamPage.getTableStatFor(1,'Red').then(function(stat) {
            assert.equal(stat, 1, '1st row - Red');
          });
        });
      });
    });

    test.describe("#splits", function() {
      test.it('clicking splits tab', function() {
        teamPage.clickTab('splits');
      });

      test.describe('#statsView', function() {
        var statViews = [
          { type: 'Per 90 Min', topStat: 22, colName: 'GM', rowNum: 1 },            
          { type: 'Minutes Per', topStat: 8.9, colName: 'FoulCom', rowNum: 2 },
          { type: 'Opponent Minutes Per', topStat: 30, colName: 'Yellow', rowNum: 3 },
          { type: 'Per Game', topStat: 7.36, colName: 'FoulSuf', rowNum: 5 },
          { type: 'Opponent Stats', topStat: 1, colName: 'Red', rowNum: 6 },
          { type: 'Opponent Per Game', topStat: 2.14, colName: 'FoulCom', rowNum: 8 },
          { type: 'Opponent Per 90', topStat: 1.91, colName: 'FoulSuf', rowNum: 9 },
          { type: 'Totals', topStat: 8, colName: 'Yellow', rowNum: 10 }
        ];

        statViews.forEach(function(statView) {
          test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
            teamPage.changeStatsView(statView.type);  
            teamPage.getTableStatFor(statView.rowNum,statView.colName).then(function(stat) {
              assert.equal(stat, statView.topStat, 'Row: ' + statView.rowNum + ' Col: ' + statView.colName);
            });
          });
        });
      });  
    });

    test.describe("#squad", function() {
      test.it('clicking squad tab', function() {
        teamPage.clickTab('squad');
      });

      test.it('sort by FoulCom', function() {
        teamPage.clickTableHeaderFor('FoulCom');
        teamPage.clickTableHeaderFor('FoulCom');
      });

      test.describe("#filters", function() {
        test.it('adding filter - (Booking Type: dissent), shows correct stats ', function() {
          filters.changeFilterGroupDropdown('Event')
          filters.addSelectionToDropdownSidebarFilter('Booking Type:', 'dissent');

          teamPage.getTableStatFor(2,'FoulCom').then(function(stat) {
            assert.equal(stat, 26, '2nd row - FoulCom');
          });

          teamPage.getTableStatFor(1,'Yellow').then(function(stat) {
            assert.equal(stat, 3, '1st row - Yellow');
          });
        });
      });    

      test.describe('#playByPlay modal', function() {
        test.it('clicking on table stat opens modal', function() {
          teamPage.clickTableStatFor(1, 'FoulCom');
        });
          
        test.it('play by play modal shows correct data', function() {
          teamPage.getPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
            assert.equal(stat, '2015-08-23', 'row 1 date')
          });

          teamPage.getPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
            assert.equal(stat, 'P1-22:24', 'row 1 period clock')
          });
        });
      });

      // test.describe('#playPossession modal', function() {
      //   test.it('clicking on playPossession icon opens modal', function() {
      //     teamPage.clickPlayPossessionIcon(1);
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('table shows correct plays', function() {
      //     teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
      //       assert.equal(stat, 'Luis Alberto Suarez Diaz', '1st row player');
      //     });

      //     teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
      //       assert.equal(stat, '75:59', '1st row game clock');
      //     });
      //   });

      //   test.it('table shows correct number of plays', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('visual shows correct number of plays', function() {
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 7);
      //     });
      //   });

      //   test.it('hovering over play shows description in visual', function() {
      //     teamPage.hoverOverPlayPossessionPlay(1);
      //     teamPage.getPlayPossessionVisualDescription().then(function(stat) {
      //       assert.equal(stat, 'Pass by Patrick Ebert');
      //     });
      //   });

      //   test.it('hovering over play highlights row in table', function() {
      //     teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
      //       assert.equal(color, 'rgba(255, 251, 211, 1)');
      //     });
      //   });

      //   test.it('changing crop possessions slider updates visual', function() {
      //     teamPage.changePlayPossessionCropSlider(50);
      //     teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });  
      //   });

      //   test.it('changing crop possessions slider updates table', function() {
      //     teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //       assert.equal(stat, 16);
      //     });
      //   });

      //   test.it('clicking export button opens export modal', function() {
      //     teamPage.clickPlayPossessionExportButton();
      //     teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, true);
      //     });
      //   });

      //   test.it('clicking close button closes modals', function() {
      //     teamPage.clickPlayPossessionExportCloseButton();
      //     teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //       assert.equal(displayed, false);
      //     });
      //   });
      // });

      test.describe('#video', function() {
        // test.it('clicking video icon opens video in new window', function() {
        //   teamPage.clickPlayVideoIcon(1);
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        //   });
        // });

        // test.it('fixture info for video is correct', function() {
        //   teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
        //     assert.equal(stat, 'Barça', 'video 1 - home team');
        //   });

        //   teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
        //     assert.equal(stat, '5 - 2', 'video 1 - score');
        //   });
        // });

        // test.it('event time for video is correct', function() {
        //   teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
        //     assert.equal(stat, '78:27 - 78:43 (16s)');
        //   });
        // }); 

        // test.it('closing window goes back to original window', function() {
        //   teamPage.closeVideoPlayerWindow();
        //   filters.getCurrentUrl().then(function(url) {
        //     assert.match(url, /trumedianetworks/, 'Correct URL');
        //   });
        // });

        test.it('pressing close button closes play by play modal', function() {
          teamPage.closePlayByPlayModal();
          teamPage.isPlayByPlayModalDisplayed().then(function(stat) {
            assert.equal(stat, false);
          });
        });
      });
    });

    test.describe("#playByPlay", function() {
      test.it('clicking play by play tab', function() {
        teamPage.clickTab('playByPlay');
      });

      test.describe('#playPossession modal', function() {
        test.it('clicking on playPossession icon opens modal', function() {
          teamPage.clickPbpPlayPossessionIcon(1);
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('table shows correct plays', function() {
          teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
            assert.equal(stat, 'Javier Alejandro Mascherano', '1st row player');
          });

          teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
            assert.equal(stat, '7:05', '1st row game clock');
          });
        });

        test.it('table shows correct number of plays', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 4);
          });
        });

        test.it('visual shows correct number of plays', function() {
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 4);
          });
        });

        test.it('hovering over play shows description in visual', function() {
          teamPage.hoverOverPlayPossessionPlay(1);
          teamPage.getPlayPossessionVisualDescription().then(function(stat) {
            assert.equal(stat, 'Pass by Javier Alejandro Mascherano');
          });
        });

        test.it('hovering over play highlights row in table', function() {
          teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(255, 251, 211, 1)');
          });
        });

        test.it('changing crop possessions slider updates visual', function() {
          teamPage.changePlayPossessionCropSlider(50);
          teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
            assert.equal(stat, 11);
          });  
        });

        test.it('changing crop possessions slider updates table', function() {
          teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
            assert.equal(stat, 11);
          });
        });

        test.it('clicking export button opens export modal', function() {
          teamPage.clickPlayPossessionExportButton();
          teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });

        test.it('clicking close button closes modals', function() {
          teamPage.clickPlayPossessionExportCloseButton();
          teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          });
        });
      });

      test.describe('#video', function() {
        test.it('clicking video icon opens video in new window', function() {
          teamPage.clickPbpPlayVideoIcon(1);
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
          });
        });

        test.it('fixture info for video is correct', function() {
          teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
            assert.equal(stat, 'Barça', 'video 1 - home team');
          });

          teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
            assert.equal(stat, '4 - 1', 'video 1 - score');
          });
        });

        test.it('event time for video is correct', function() {
          teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
            assert.equal(stat, '00:9 - 00:25 (16s)');
          });
        }); 

        test.it('closing window goes back to original window', function() {
          teamPage.closeVideoPlayerWindow();
          filters.getCurrentUrl().then(function(url) {
            assert.match(url, /trumedianetworks/, 'Correct URL');
          });
        });
      });
    });
  });

  test.describe("#Page: Multi-Filter", function() {  
    test.it('clicking Multi-Filter link goes to correct page', function() {
      teamPage.goToSection('multiFilter');
      teamPage.changeReport('Summary');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /team\-multi\-filter/);
      });
    });

    test.it('should show the correct data initially', function() {
      teamPage.getMultiFilterTableStatFor(1,'filter').then(function(stat) {
        assert.equal(stat, 'top');
      });

      teamPage.getMultiFilterTableStatFor(3,'filter').then(function(stat) {
        assert.equal(stat, 'bottom');
      });      

      teamPage.getMultiFilterTableStatFor(1,'Pass%').then(function(stat) {
        assert.equal(stat, "86.0%");
      });
    });

    test.describe('#filters', function() {
      test.it('adding filter (All Receivers: L. Messi) updates data for top row', function() {
        filters.addSelectionToDropdownSidebarFilter('All Receivers:', 'L. Messi');
        teamPage.getMultiFilterTableStatFor(1, 'Touches').then(function(stat) {
          assert.equal(stat, 589);
        });
      });
    });

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamPage.clickMultiFilterTableStatFor(1, 'Ast');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamPage.getMultiFilterPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '9/12/2015', 'row 1 date')
        });

        teamPage.getMultiFilterPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
          assert.equal(stat, 'P2-76:26', 'row 1 period clock')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamPage.clickMultiFilterPlayPossessionIcon(1);
        teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      // test.it('table shows correct plays', function() {
      //   teamPage.getPlayPossessionTableStatFor(1,'playerName').then(function(stat) {
      //     assert.equal(stat, 'Javier Alejandro Mascherano', '1st row player');
      //   });

      //   teamPage.getPlayPossessionTableStatFor(1,'gameClock').then(function(stat) {
      //     assert.equal(stat, '13:33', '1st row game clock');
      //   });
      // });

      // test.it('table shows correct number of plays', function() {
      //   teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //     assert.equal(stat, 6);
      //   });
      // });

      // test.it('visual shows correct number of plays', function() {
      //   teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //     assert.equal(stat, 6);
      //   });
      // });

      // test.it('hovering over play shows description in visual', function() {
      //   teamPage.hoverOverPlayPossessionPlay(1);
      //   teamPage.getPlayPossessionVisualDescription().then(function(stat) {
      //     assert.equal(stat, 'Pass by Lionel Andres Messi Cuccittini');
      //   });
      // });

      // test.it('hovering over play highlights row in table', function() {
      //   teamPage.getPlayPossessionTableStatBgColor(1).then(function(color) {
      //     assert.equal(color, 'rgba(255, 251, 211, 1)');
      //   });
      // });

      // test.it('changing crop possessions slider updates visual', function() {
      //   teamPage.changePlayPossessionCropSlider(50);
      //   teamPage.getPlayPossessionVisualPlayCount().then(function(stat) {
      //     assert.equal(stat, 15);
      //   });  
      // });

      // test.it('changing crop possessions slider updates table', function() {
      //   teamPage.getPlayPossessionTablePlayCount().then(function(stat) {
      //     assert.equal(stat, 15);
      //   });
      // });

      // test.it('clicking export button opens export modal', function() {
      //   teamPage.clickPlayPossessionExportButton();
      //   teamPage.isPlayPossessionExportModalDisplayed().then(function(displayed) {
      //     assert.equal(displayed, true);
      //   });
      // });

      // test.it('clicking close button closes modals', function() {
      //   teamPage.clickPlayPossessionExportCloseButton();
      //   teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
      //     assert.equal(displayed, false);
      //   });
      // });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamPage.clickMultiFilterlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'Barça', 'video 1 - home team');
        });

        teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '4 - 0', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '32:45 - 33:01 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamPage.closeMultiFilterPlayByPlayModal();
        teamPage.isMultiFilterPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });

    test.describe('#groupBy', function() {
      test.it('selecting "Total" shows the correct stats', function() {
        teamPage.changeGroupBy("Totals");

        teamPage.getMultiFilterTableStatFor(2,'Ast').then(function(stat) {
          assert.equal(stat, 203, 'Ast', '2nd row - Ast');
        });
      }); 

      test.it('selecting "By Game" shows the correct stats', function() {
        teamPage.changeGroupBy("By Game");
        teamPage.getMultiFilterTableStatFor(1, 'opp').then(function(stat) {
          assert.equal(stat, "top");
        });          

        teamPage.getMultiFilterTableStatFor(2,'Touches').then(function(stat) {
          assert.equal(stat, 93, 'game 2 - Touches');
        });
      });

      test.it('selecting "By Opponent" shows the correct stats', function() {
        teamPage.changeGroupBy("By Opponent");
        teamPage.getMultiFilterTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, " ROM");
        });          

        teamPage.getMultiFilterTableStatFor(2,'PsAtt').then(function(stat) {
          assert.equal(stat, 94, 'Opponent 2 - PsAtt');
        });
      });

      test.it('selecting "By League" shows the correct stats', function() {
        teamPage.changeGroupBy("By League");
        teamPage.getMultiFilterTableStatFor(1, 'GM').then(function(stat) {
          assert.equal(stat, 11);
        });          

        teamPage.getMultiFilterTableStatFor(2,'Chance').then(function(stat) {
          assert.equal(stat, 14, 'League 2 - Chance');
        });
      });

      test.it('selecting "By Season" shows the correct stats', function() {
        teamPage.changeGroupBy("By Season");
        teamPage.getMultiFilterTableStatFor(2, 'GM').then(function(stat) {
          assert.equal(stat, 3);
        });

        teamPage.getMultiFilterTableStatFor(2,'Chance').then(function(stat) {
          assert.equal(stat, 14, '2nd row chance');
        });
      });
    });

    test.describe('#reports', function() {
      var reports = [
        { type: 'Possessions', topStat: 589, statType: "Touches" },  
        { type: 'Passes', topStat: 572, statType: "PsAtt" },  
        { type: 'Creativity', topStat: 216, statType: "PsInA3rd" },  
        { type: 'Shots', topStat: 26, statType: "Goal", rowNum: 5 },  
        { type: 'Defence', topStat: 200, statType: "Tckl", rowNum: 5 },  
        { type: 'Set Pieces', topStat: "100.0%", statType: "LftCrnrSc%" },  
        { type: 'Goalkeeper', topStat: 12, statType: "GAg", rowNum: 5 },  
        { type: 'Discipline', topStat: 104, statType: "FoulCom", rowNum: 5 },  
      ]
      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          var rowNum = report.rowNum || 1;
          teamPage.getMultiFilterTableStatFor(rowNum,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe("#Page: Comps", function() {  
    test.it('clicking Comp link goes to correct page', function() {
      teamPage.goToSection('comps');
      filters.changeFilterGroupDropdown('Season');
      filters.addSelectionToDropdownSidebarFilter('Season:', 'Primera División 2015/2016 (Spain)');
      filters.closeDropdownFilter('All Receivers');
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /team\-comps/);
      });
    });

    test.describe("#search", function() {
      test.it('adding Levante to team 2, adds team to comp container', function() {
        teamPage.selectForCompsSearch(2, 'Levante');
        teamPage.getCompsTableStatFor(2,"Player/Team").then(function(stat) { 
          assert.equal(stat, 'LEV');
        });
      });

      test.it('adding Getafe to team 3, adds team to comp container', function() {
        teamPage.selectForCompsSearch(3, 'Getafe');
        teamPage.getCompsTableStatFor(3,"Player/Team").then(function(stat) { 
          assert.equal(stat, 'GET');
        });
      });
    })

    test.describe('#playByPlay modal', function() {
      test.it('clicking on table stat opens modal', function() {
        teamPage.clickCompsTableStatFor(1, 'Ast');
      });
        
      test.it('play by play modal shows correct data', function() {
        teamPage.getCompsPlayByPlayModalTableStatFor(1, 'date').then(function(stat) {
          assert.equal(stat, '8/23/2015', 'row 1 date')
        });

        teamPage.getCompsPlayByPlayModalTableStatFor(1, 'period-clock').then(function(stat) {
          assert.equal(stat, 'P2-53:49', 'row 1 period clock')
        });
      });
    });

    test.describe('#playPossession modal', function() {
      test.it('clicking on playPossession icon opens modal', function() {
        teamPage.clickCompsPlayPossessionIcon(1);
        teamPage.isPlayPossessionModalDisplayed().then(function(displayed) {
          assert.equal(displayed, true);
        });
      });
    });

    test.describe('#video', function() {
      test.it('clicking video icon opens video in new window', function() {
        teamPage.clickCompsPlayVideoIcon(1);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'RM', 'video 1 - home team');
        });

        teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 4', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '9:55 - 10:11 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });

      test.it('pressing close button closes play by play modal', function() {
        teamPage.closeCompsPlayByPlayModal();
        teamPage.isCompsPlayByPlayModalDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });
  });

  test.describe("#Page: Pass Zones", function() {  
    test.it('clicking Pass Zones link goes to correct page', function() {
      teamPage.goToSection('passZones');
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /team\-bins/);
      });
    });

    test.it("main data initially shows correct width & color", function() {
      driver.sleep(2000);
      teamPage.getPassZoneMainBlockWidth(1).then(function(width) {
        assert.equal(width, 30.423308321795446, '1st block width');
      });

      teamPage.getPassZoneMainBlockColor(1).then(function(color) {
        assert.equal(color, "#ff0000", '1st block color')
      })
    });

    test.it("hovering over block shows tooltip", function() {
      teamPage.hoverOverPlayZoneMainBlock(1);
      teamPage.getPassZonesTooltipText().then(function(text) {
        assert.equal(text, 'Pass Compl% From Zone\nCompl%: 80% (24/30)\nAverage: 56.8%', '1st block tooltip')
      });
    }); 

    test.describe("#filters", function() {
      test.it('adding filter - (Field Location: Center Third), shows correct width & color', function() {
        filters.changeValuesForRangeSidebarFilter('Game Clock:', 75, 90);
        teamPage.getPassZoneMainBlockWidth(1).then(function(width) {
          assert.equal(width, 30.007750936700834, '1st block width');
        });

        teamPage.getPassZoneMainBlockColor(1).then(function(color) {
          assert.equal(color, "#ff0000", '1st block color')
        }) 
      });
    });

    test.describe('#video', function() {
      test.it('clicking into main block shows drill down data', function() {
        teamPage.clickPassZoneMainBlock(64);
        teamPage.getDrillDownBlockCount().then(function(count) {
          assert.equal(count, 100, 'drill down block count');
        });
      });

      test.it('clicking drill down block opens video in new window', function() {
        driver.sleep(5000);
        teamPage.clickDrillDownBlock(75);
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /sharedplayer\.scout7/, 'Correct URL');
        });
      });

      test.it('fixture info for video is correct', function() {
        teamPage.getVideoPlayerFixtureInfoHomeTeam(1).then(function(stat) {
          assert.equal(stat, 'RM', 'video 1 - home team');
        });

        teamPage.getVideoPlayerFixtureInfoScore(1).then(function(stat) {
          assert.equal(stat, '0 - 4', 'video 1 - score');
        });
      });

      test.it('event time for video is correct', function() {
        teamPage.getVideoPlayerEventTimes(1).then(function(stat) {
          assert.equal(stat, '81:44 - 82:00 (16s)');
        });
      }); 

      test.it('closing window goes back to original window', function() {
        teamPage.closeVideoPlayerWindow();
        filters.getCurrentUrl().then(function(url) {
          assert.match(url, /trumedianetworks/, 'Correct URL');
        });
      });
    });
  });
});