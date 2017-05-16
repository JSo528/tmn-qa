var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var ScoresPage = require('../../../pages/nfl/scores/scores_page.js');
var GamePage = require('../../../pages/nfl/scores/game_page.js');
var navbar, filters, scoresPage, gamePage;

test.describe('#Page: Game', function() {
  test.it('game page should have correct title', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    gamePage = new GamePage(driver);
    
    var gameUrl = '/football/game/Falcons-49ers/2016-12-18/2016121809/nfl?f=%7B%7D&is=true'
    gamePage.visit(url+gameUrl);
    gamePage.getBoxScorePageTitle().then(function(text) {
      assert.equal(text, 'Week W15 - 12/18/2016, 4:05 PM ET');
    });
  });

  test.describe('#boxScore', function() {
    test.describe('#filters', function() {
      test.it('adding filter - (Def Possession #: 0 to 100), shows correct stats ', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Def Possession #:', 0, 5);

        gamePage.getBoxScoreTableStat(33,3).then(function(stat) {
          assert.equal(stat, 5, 'Jaquiski Tartt - Tkl');
        });
      });

      test.it('adding filter - (Def Reverse Half Possession #: 2 to 4), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Def Reverse Half Possession #:', 2, 4);

        gamePage.getBoxScoreTableStat(33,13).then(function(stat) {
          assert.equal(stat, 2, ' Keanu Neal - Solo');
        });
      });
    });

    test.describe('#videoPlaylist - player', function() {
      test.it('clicking a player table stat should open Pop up Play by Play modal', function() {
        gamePage.clickBoxScoreTableStat(33,4);
        gamePage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Falcons Ball Starting At 5:55 At The ATL 45');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        gamePage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'ATL 50');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        gamePage.clickFlatViewTab();
        gamePage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 20);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickByPossessionTab();
        gamePage.clickByPossessionPlayVideoIcon(3);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 SF 22");
        });
      });

      test.it('closing modals', function() {
        gamePage.closeVideoPlaylistModal();
        gamePage.closePlayByPlayModal();
      });
    });

    test.describe('#videoPlaylist - team', function() {
      test.it('clicking a team table stat should open Pop up Play by Play modal', function() {
        gamePage.clickBoxScoreTableStat(52,12);
        gamePage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' 49ers Ball Starting At 7:30 At The SF 13');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        gamePage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'ATL 13');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        gamePage.clickFlatViewTab();
        gamePage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 5);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickByPossessionTab();
        gamePage.clickByPossessionPlayVideoIcon(3);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 ATL 37");
        });
      });

      test.it('closing modals', function() {
        gamePage.closeVideoPlaylistModal();
        gamePage.closePlayByPlayModal();
      });
    });

    test.describe('#scoringSummary', function() {
      test.it('remove filters', function() {
        this.timeout(120000);
        filters.changeValuesForRangeSidebarFilter('Def Possession #:', '', '');
        filters.changeValuesForRangeSidebarFilter('Def Reverse Half Possession #:', '', '');
      });

      test.it('scoring summary text should be correct', function() {
        gamePage.getBoxScoreSummaryText(1,1).then(function(stat) {
          assert.equal(stat, 'TD - 10:31', '1st score, 1st col');
        });

        gamePage.getBoxScoreSummaryText(2,2).then(function(stat) {
          assert.equal(stat, '(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.\n3-M.Bryant extra point is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.', '2nd score, 2nd col');
        });

        gamePage.getBoxScoreSummaryText(3,3).then(function(stat) {
          assert.equal(stat, 0, '3rd score, 3rd col');
        });

        gamePage.getBoxScoreSummaryText(4,4).then(function(stat) {
          assert.equal(stat, 21, '4th score, 4th col');
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickBoxScoreSummaryPlayVideoIcon(1);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 5 SF 5");
        });
      });

      test.it('closing modals', function() {
        gamePage.closeVideoPlaylistModal();
      });
    });      
  });

  test.describe('#performanceStats', function() {
    test.it('clicking Performance Stats link goes to correct page', function() {
      gamePage.goToSection('performanceStats');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /game\-performance/);
      });
    });

    test.describe("#sorting", function() {
      var columns = [
        { colName: 'DistTotal', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'RelSprintTime', sortType: 'ferpTime', defaultSort: 'desc' },
        { colName: 'RelMaxSprintCount', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) gamePage.clickPerformanceStatsTableHeaderFor(column.colName);
          gamePage.waitForTableToLoad();
          gamePage.getPerformanceStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          gamePage.clickPerformanceStatsTableHeaderFor(column.colName);
          gamePage.waitForTableToLoad();
          gamePage.getPerformanceStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });

    test.describe("#filters", function() {
      test.it('changing filter - (Session Type: In Play), shows correct stats', function() {
        gamePage.clickPerformanceStatsTableHeaderFor('DistTotal');
        filters.toggleSidebarFilter('Session Type:', 'In Play', true);

        gamePage.getPerformanceStatsTableStatFor(1,'DistTotal').then(function(stat) {
          assert.equal(stat, 1779, 'Jaquiski Tartt DistTotal');
        });
      });  

      test.it('changing filter - (Primary Position: WR), shows correct stats', function() {
        filters.changeFilterGroupDropdown('Player')
        filters.addSelectionToDropdownSidebarFilter('Primary Position:', 'WR');

        gamePage.getPerformanceStatsTableStatFor(1,'DistTotal').then(function(stat) {
          assert.equal(stat, 1369, 'Jeremy Kerley DistTotal');
        });
      });  
    });    
    
    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the Jeremy Kerley should add him to the pinned table', function() {
        gamePage.clickTablePin(1);

        gamePage.getIsoTableStat(1,2).then(function(stat) {
          assert.equal(stat, 'Jeremy Kerley (WR-SF)');
        });
      });

      test.it('selecting Quinton Patton from search should add player to table', function() {
        gamePage.clickIsoBtn("on");
        gamePage.addToIsoTable('Quinton Patton', 1)

        gamePage.getPerformanceStatsTableStatFor(2,'Player').then(function(stat) {
          assert.equal(stat, 'Quinton Patton (WR-SF)', '2nd row player name');
        })
      });

      test.it('pinned average should show the correct #', function() {
        gamePage.getPinnedAverageTableStat(7).then(function(stat) {
          assert.equal(stat, 1103.6, 'pinned total - DistTotal');
        });
      });

      test.it('Jeremy Kerleys data should show in the session table', function() {
        gamePage.toggleShowPinnedPlayerSessions();
        gamePage.getPerformanceStatsSessionTableStatFor(1,'session').then(function(stat) {
          assert.equal(stat, 'In Play - Q2', 'row 1 session');
        });

        gamePage.getPerformanceStatsSessionTableStatFor(2,'TimeMoving').then(function(stat) {
          assert.equal(stat, '0:01:55', 'row 2 timeMoving');
        });
      });

      test.it('Quinton Pattons data should show in the session table', function() {
        gamePage.getPerformanceStatsSessionTableStatFor(5,'player').then(function(stat) {
          assert.equal(stat, 'Quinton Patton (WR-SF)', 'row 5 player');
        });
      });

      test.it('turning off isolation mode should show player in iso table', function() {
        gamePage.clickIsoBtn("off");
        gamePage.getIsoTableStat(1,2).then(function(stat) {
          assert.equal(stat, 'Jeremy Kerley (WR-SF)');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        gamePage.clickChartColumnsBtn();
        gamePage.openPerformanceStatsHistogram(7); 
        gamePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        gamePage.hoverOverHistogramStack(1)
        gamePage.getTooltipText().then(function(text) {
          assert.equal(text, 'Jeremy Kerley: 284.40000000000003 (WR)\nJeremy Kerley: 239.10000000000002 (WR)\nJeremy Kerley: 214.9 (WR)', 'tooltip for 1st bar');
        });
      }); 

      test.it('clicking close histogram button should close histogram modal', function() {
        gamePage.closeModal();
        gamePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        gamePage.openPerformanceStatsScatterChart(15,16);

        gamePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        gamePage.closeModal();
        gamePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });  
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Zebra Team Summary', topStat: 1369, statType: "DistTotal" },  
        { type: 'Zebra Relative Summary', topStat: 1369, statType: "DistTotal" },  
        { type: 'Rates and Peaks', topStat: 10.8, statType: "MaxStndYPS" },  
        { type: 'Accel/Decel/CoD', topStat: 68, statType: "TotalAccels" },  
        { type: 'Dist/Time/Sprints By Team Zone', topStat: 1369, statType: "DistTotal" },   
        { type: 'Dist/Time/Sprints By Player Relative Zone', topStat: 1369, statType: "DistTotal" },   
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          gamePage.changeReport(report.type);  
          gamePage.getPerformanceStatsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#report', function() {
    test.it('clicking Report link goes to correct page', function() {
      gamePage.goToSection('report');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /performance\-report\-game/);
      });
    });

    test.describe('#sectionsDropdown', function() {
      test.it('all sections should be displayed initially ', function() {
        gamePage.isReportPositionsDisplayed().then(function(stat) {
          assert.equal(stat, true);
        });
        
        gamePage.isReportTeamDisplayed().then(function(stat) {
          assert.equal(stat, true);
        });

        gamePage.isReportPlayersDisplayed().then(function(stat) {
          assert.equal(stat, true);
        });
      });
      
      test.it('removing players hides section', function() {
        gamePage.changeReportDropdown('Sections', 'Players');
        gamePage.isReportPlayersDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });

      test.it('removing team hides section', function() {
        gamePage.changeReportDropdown('Sections', 'Team');
        gamePage.isReportTeamDisplayed().then(function(stat) {
          assert.equal(stat, false);
        });
      });
    });

    test.describe('#positionsDropdown', function() {
      test.it('list should include all positions initially ', function() {
        gamePage.getReportPositions().then(function(positions){
          assert.include(positions, 'QB');
          assert.include(positions, 'RB');
          assert.include(positions, 'SPEC');
        });
      });

      test.it('removing QB updates the list correctly', function() {
        gamePage.changeReportDropdown('Positions', 'QB');
        gamePage.getReportPositions().then(function(positions){
          assert.notInclude(positions, 'QB');
        });
      });

      test.it('removing SPEC updates the list correctly', function() {
        gamePage.changeReportDropdown('Positions', 'SPEC');
        gamePage.getReportPositions().then(function(positions){
          assert.notInclude(positions, 'SPEC');
        });
      });

      test.it('removing RB updates the list correctly', function() {
        gamePage.changeReportDropdown('Positions', 'RB');
        gamePage.getReportPositions().then(function(positions){
          assert.notInclude(positions, 'RB');
        });
      });

      test.it('adding back RB updates the list correctly', function() {
        gamePage.changeReportDropdown('Positions', 'RB');
        gamePage.getReportPositions().then(function(positions){
          assert.include(positions, 'RB');
        });
      });
    });

    test.describe('#playersDropdown', function() {
      test.it('add back players section', function() {
        gamePage.changeReportDropdown('Sections', 'Players');
        gamePage.isReportPlayersDisplayed().then(function(stat) {
          assert.equal(stat, true);
        });
      });

      test.it('list should include all players initially ', function() {
        gamePage.getReportPlayers().then(function(players){
          assert.include(players, 'Quinton Patton');
          assert.include(players, 'Aaron Burbridge');
        });
      });

      test.it('removing Quinton Patton updates the list correctly', function() {
        gamePage.changeReportPlayerDropdown('Quinton Patton');
        gamePage.getReportPlayers().then(function(players){
          assert.notInclude(players, 'Quinton Patton');
        });
      }); 

      test.it('removing Aaron Burbridge updates the list correctly', function() {
        gamePage.changeReportPlayerDropdown('Aaron Burbridge');
        gamePage.getReportPlayers().then(function(players){
          assert.notInclude(players, 'Aaron Burbridge');
        });
      });         

      test.it('adding back Aaron Burbridge updates the list correctly', function() {
        gamePage.changeReportPlayerDropdown('Aaron Burbridge');
        gamePage.getReportPlayers().then(function(players){
          assert.include(players, 'Aaron Burbridge');
        });
      });      
    });

    test.describe('#compareToDropdown', function() {
      test.it('add back teams section', function() {
        gamePage.changeReportDropdown('Sections', 'Team');
        gamePage.isReportPlayersDisplayed().then(function(stat) {
          assert.equal(stat, true);
        });
      });

      test.it('changing time period to prior 7 days updates the view correctly', function() {
        gamePage.changeReportDropdown('Compare to', 'Prior 7 days practices');
        
        gamePage.getReportTeamComparedToString().then(function(string) {
          assert.equal(string, 'Prior 7 Days Practices');
        });
      });

      test.it('changing time period to prior 28 days updates the view correctly', function() {
        gamePage.changeReportDropdown('Compare to', 'Prior 28 days practices');
        
        gamePage.getReportTeamComparedToString().then(function(string) {
          assert.equal(string, 'Prior 28 Days Practices');
        });
      });
    });
  });

  test.describe('#teamSummary', function() {
    test.it('clicking Report link goes to correct page', function() {
      gamePage.goToSection('teamSummary');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /game\-team\-summary/);
      });
    });

    test.describe('#statsSummary', function() {
      test.it('table has correct info', function() {
        gamePage.getTeamSummaryTableStat(1,2).then(function(stat) {
          assert.equal(stat, 13, '49ers Pts Scored');
        });

        gamePage.getTeamSummaryTableStat(3,3).then(function(stat) {
          assert.equal(stat, '2 - 1', 'Falcons Fumbles');
        });

        gamePage.getTeamSummaryTableStat(5,2).then(function(stat) {
          assert.equal(stat, '23:59', '49ers Time of Possession');
        });

        gamePage.getTeamSummaryTableStat(15,3).then(function(stat) {
          assert.equal(stat, 550, 'Falcons Total Net Yards');
        });
      });
    });

    test.describe('#scoringSummary', function() {
      test.it('table has correct info', function() {
        gamePage.getTeamSummaryScoringSummaryTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'TD - 10:31', '1st row, 1st col');
        });

        gamePage.getTeamSummaryScoringSummaryTableStat(2,2).then(function(stat) {
          assert.equal(stat, '(7:48) 2-M.Ryan pass short left to 18-T.Gabriel for 9 yards, TOUCHDOWN.\n3-M.Bryant extra point is GOOD, Center-47-J.Harris, Holder-5-M.Bosher.', '2nd row, 2nd col');
        });

        gamePage.getTeamSummaryScoringSummaryTableStat(3,3).then(function(stat) {
          assert.equal(stat, 0, '3rd row, 3rd col');
        });

        gamePage.getTeamSummaryScoringSummaryTableStat(4,4).then(function(stat) {
          assert.equal(stat, 21, '4th row, 4th col');
        });                
      });    

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickTeamSummaryScoringSummaryVideoIcon(1);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 5 SF 5");
        });
      });      

      test.it('closing modal & filters', function() {
        gamePage.closeVideoPlaylistModal();
      });  
    });  
  });

  test.describe('#playByPlay', function() {
    test.it('clicking Play By Play link goes to correct page', function() {
      gamePage.goToSection('playByPlay');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /game\-play\-by\-play/);
      });
    });

    test.describe('#byPosession', function() {
      test.it('changing filter - (Shotgun: Shotgun) shows correct stats for drives in by possession tab', function() {
        filters.changeFilterGroupDropdown('Adv');
        filters.addSelectionToDropdownSidebarFilter('Shotgun:', 'Shotgun');
        

        gamePage.getPlayByPlayByPosessionTableStat(1,1).then(function(stat) {
          assert.equal(stat, '1st & 10', '1st row, 1st col');
        });

        gamePage.getPlayByPlayByPosessionTableStat(2,2).then(function(stat) {
          assert.equal(stat, 'SF 29', '2nd row, 2nd col');
        });

        gamePage.getPlayByPlayByPosessionTableStat(3,4).then(function(stat) {
          assert.equal(stat, '(13:51) (Shotgun) 7-C.Kaepernick pass incomplete short left to 17-J.Kerley.', '3rd row, 4th col');
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickPlayByPlayByPosessionVideoIcon(6);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "2nd & 6 SF 49");
        });
      });

      test.it('closing modal', function() {
        gamePage.closeVideoPlaylistModal();
      });    
    });

    test.describe('#flatView', function() {
      test.it('changing filter - (Yards After Catch: 0 to 5) shows correct stats for drives in flat view tab', function() {
        filters.changeValuesForRangeSidebarFilter('Yards After Catch:', 0, 5);
        gamePage.clickPlayByPlayTab('flatView');

        gamePage.getPlayByPlayFlatViewTableStat(1,1).then(function(stat) {
          assert.equal(stat, '2016-12-18', '1st row, 1st col');
        });

        gamePage.getPlayByPlayFlatViewTableStat(2,2).then(function(stat) {
          assert.equal(stat, '(4:39) (Shotgun) 2-M.Ryan pass short middle to 12-M.Sanu to SF 27 for 16 yards (29-J.Tartt).', '2nd row, 2nd col');
        });
      });      

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickPlayByPlayFlatViewVideoIcon(9);
        gamePage.getPlayByPlayFlatViewVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 ATL 22");
        });
      });

      test.it('closing modal', function() {
        gamePage.closeVideoPlaylistModal();
      });          
    });

    test.describe('#scoringSummary', function() {
      test.it('table has correct info', function() {
        gamePage.getPlayByPlayScoringSummaryTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'TD - 0:40', '1st row, 1st col');
        });

        gamePage.getPlayByPlayScoringSummaryTableStat(2,2).then(function(stat) {
          assert.equal(stat, '(12:50) (Shotgun) 7-C.Kaepernick pass short left to 88-G.Celek for 16 yards, TOUCHDOWN.', '2nd row, 2nd col');
        });
      });    

      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickPlayByPlayScoringSummaryVideoIcon(3);
        gamePage.getPlayByPlayScoringSummaryVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 4 ATL 5");
        });
      });      

      test.it('closing modal & filters', function() {
        gamePage.closeVideoPlaylistModal();
        filters.closeDropdownFilter('Shotgun');
        filters.changeValuesForRangeSidebarFilter('Yards After Catch:', '', '');
      });             
    });
  });

  test.describe('#drives', function() {
    test.it('clicking Play By Play link goes to correct page', function() {
      gamePage.goToSection('drives');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /game\-drives/);
      });
    });

    test.describe('#filters', function() {
      test.it('changing filter - (Drive Red Zone: Yes) shows correct stats for drives', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.selectForBooleanDropdownSidebarFilter('Drive Red Zone:', 'Yes');
        

        gamePage.getDrivesTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'Falcons ball starting at 13:28 at the SF 47', '1st row, 1st col');
        });

        gamePage.getDrivesTableStat(2,2).then(function(stat) {
          assert.equal(stat, 'Touchdown', '2nd row, 2nd col');
        });

        gamePage.getDrivesTableStat(3,3).then(function(stat) {
          assert.equal(stat, '(Plays: 11 Yards: 55 Possession: 5:51)', '3rd row, 3rd col');
        });
      });

      test.it('changing filter - (Drive Start: Kickoff) shows correct stats for scoring summary', function() {
        filters.addSelectionToDropdownSidebarFilter('Drive Start:', 'Kickoff');
        
        gamePage.getDrivesSummaryTableStat(1,1).then(function(stat) {
          assert.equal(stat, 'TD - 12:45', '1st row, 1st col');
        });

        gamePage.getDrivesSummaryTableStat(2,2).then(function(stat) {
          assert.equal(stat, '(:17) (Shotgun) 7-C.Kaepernick pass short left to 81-R.Streater for 5 yards, TOUCHDOWN.\n4-P.Dawson extra point is No Good, Wide Left, Center-86-K.Nelson, Holder-5-B.Pinion.', '2nd row, 2nd col');
        });
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking video icon should open up video modal', function() {
        gamePage.clickDrivesSummaryPlayVideoIcon(2);
        gamePage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 4 ATL 5");
        });
      });

      test.it('closing modal & filters', function() {
        gamePage.closeVideoPlaylistModal();
        filters.closeDropdownFilter('Drive Start');
        filters.closeDropdownFilter('Drive Red Zone');
      });
    });
  });
});