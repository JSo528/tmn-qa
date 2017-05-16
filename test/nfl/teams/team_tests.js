var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var TeamsPage = require('../../../pages/nfl/teams/teams_page.js');
var TeamPage = require('../../../pages/nfl/teams/team_page.js');
var navbar, filters, teamsPage, teamPage;

test.describe('#Page: Team', function() {
  test.it('navigating to teams page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    teamsPage = new TeamsPage(driver);
    teamPage = new TeamPage(driver);
    
    navbar.goToTeamsPage();
    filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);

    teamsPage.clickStatsTableStat(1,3); // should click into NE Patriots Team Link
  });

  test.describe('#Section: Overview', function() {
    test.it('bio tab shows correct information', function() {
      teamPage.getOverviewRosterTableStat(1, 'player').then(function(stat) {
        assert.equal(stat, 'T. Brady');
      });

      teamPage.getOverviewRosterTableStat(1, 'weight').then(function(stat) {
        assert.equal(stat, '225');
      });
    });

    test.it('game stats tab shows correct information', function() {
      teamPage.clickRosterTab('Game Stats');
      teamPage.getOverviewRosterTableStat(1, 'status').then(function(stat) {
        assert.equal(stat, 'STARTER');
      });

      teamPage.getOverviewRosterTableStat(1, 'Stats').then(function(stat) {
        assert.equal(stat, '17 G, 66.2% Comp%, 4933 PsYds, 37 PsTD, 6 Int');
      });
    });

    test.it('overall tab shows correct information', function() {
      teamPage.getOverviewResultsTableStat(1, 'week').then(function(stat) {
        assert.equal(stat, 'P2');
      });

      teamPage.getOverviewResultsTableStat(1, 'Stats').then(function(stat) {
        assert.equal(stat, '362 Yds, 369 OpYds, 0 TO, 4 OpTO, 26:00 TOP');
      });
    });

    test.it('pass tab shows correct information', function() {
      teamPage.clickResultsTab('Pass');
      teamPage.getOverviewResultsTableStat(1, 'opponent').then(function(stat) {
        assert.equal(stat, 'Saints');
      });

      teamPage.getOverviewResultsTableStat(1, 'Stats').then(function(stat) {
        assert.equal(stat, '18 Cmp, 31 Att, 58.1% Comp%, 211 PsYds, 0 PsTD, 0 Int, 7.45 Yd/Att');
      });
    });

    test.it('rush tab shows correct information', function() {
      teamPage.clickResultsTab('Rush');
      teamPage.getOverviewResultsTableStat(1, 'result').then(function(stat) {
        assert.equal(stat, 'W 34 - 22');
      });

      teamPage.getOverviewResultsTableStat(1, 'Stats').then(function(stat) {
        assert.equal(stat, '30 Rush, 151 RnYds, 5.03 Yd/Rsh, 2 RshTD, 7 Rush1D, 0 RshFmb, 0 RshFL');
      });
    });

    test.it('offense tab shows correct information', function() {
      teamPage.getOverviewRankTableStat(1, 'Stat').then(function(stat) {
        assert.equal(stat, 'Yards Per Game');
      });

      teamPage.getOverviewRankTableStat(1, 'Number').then(function(stat) {
        assert.equal(stat, 396.5);
      });      

      teamPage.getOverviewRankTableStat(1, 'NFL Rank').then(function(stat) {
        assert.equal(stat, 4);
      });

      teamPage.getOverviewRankTableStat(1, 'NFL Leader').then(function(stat) {
        assert.equal(stat, 'NO');
      });
    });

    test.it('defense tab shows correct information', function() {
      teamPage.clickRankTab('Defense');
      teamPage.getOverviewRankTableStat(1, 'Stat').then(function(stat) {
        assert.equal(stat, 'Yd/G (By Opponent)');
      });

      teamPage.getOverviewRankTableStat(1, 'Number').then(function(stat) {
        assert.equal(stat, 327.4);
      });

      teamPage.getOverviewRankTableStat(1, 'NFL Rank').then(function(stat) {
        assert.equal(stat, 8);
      });

      teamPage.getOverviewRankTableStat(1, 'Div Leader').then(function(stat) {
        assert.equal(stat, 'NE');
      });      
    });
  });

  test.describe('#Section: Summary', function() {
    test.it('test setup', function() {
      teamPage.goToSection("summary");
    });

    test.it("LaGarrette Blount's stats are correct initially", function() {
      teamPage.getSummaryRosterTableStat(5,1).then(function(stat) {
        assert.equal(stat, 'LeGarrette Blount', 'Player');
      });

      teamPage.getSummaryRosterTableStat(5,4).then(function(stat) {
        assert.equal(stat, 1161, 'LeGarrette Blount Yds');
      });

      teamPage.getSummaryRosterTableStat(5,7).then(function(stat) {
        assert.equal(stat, 18, 'LeGarrette Blount TDs');
      });
    });

    test.it("Stats summary values are correct initially", function() {
      teamPage.getSummaryStatsTableStat(1,2).then(function(stat) {
        assert.equal(stat, '14 - 2', 'Patriots record');
      });

      teamPage.getSummaryStatsTableStat(2,3).then(function(stat) {
        assert.equal(stat, '250 - 441', 'Opponents Points Scored-Allowed');
      });

      teamPage.getSummaryStatsTableStat(3,2).then(function(stat) {
        assert.equal(stat, 11, 'Patriots Turnovers');
      });
    });

    test.describe('#filters', function() {
      test.it('adding filter - (Drive Result: TD), shows correct stats', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.addSelectionToDropdownSidebarFilter('Drive Result:', 'TD');

        teamPage.getSummaryRosterTableStat(5,4).then(function(stat) {
          assert.equal(stat, 590, 'LeGarrette Blount Yds');
        });

        teamPage.getSummaryRosterTableStat(5,7).then(function(stat) {
          assert.equal(stat, 18, 'LeGarrette Blount TDs');
        });
      });

      test.it('adding filter - (Drive Yards: 50+), shows correct stats', function() {
        filters.changeValuesForRangeSidebarFilter('Drive Yards:', 50, '');

        teamPage.getSummaryRosterTableStat(5,4).then(function(stat) {
          assert.equal(stat, 482, 'LeGarrette Blount Yds');
        });

        teamPage.getSummaryRosterTableStat(5,7).then(function(stat) {
          assert.equal(stat, 13, 'LeGarrette Blount TDs');
        });
      });      
    });
  });

  test.describe('#Section: Game Log', function() {
    test.it('test setup', function() {
      teamPage.goToSection("gameLog");
      filters.closeDropdownFilter('Drive Result');
      filters.closeDropdownFilter('Drive Yards');
    });

    // Sorting
    test.describe("#sorting", function() {
      var columns = [
        { colName: 'Date', sortType: 'dates', defaultSort: 'asc', initialCol: true },
        { colName: 'PS', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'TO', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickGameLogTableHeaderFor(column.colName);
          teamPage.waitForTableToLoad();
          teamPage.getGameLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickGameLogTableHeaderFor(column.colName);
          teamPage.waitForTableToLoad();
          teamPage.getGameLogTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });

    test.describe("#filters", function() {
      test.it('changing filter - (Play Num in Drive: 0 to 5), shows correct stats', function() {
        teamPage.clickGameLogTableHeaderFor('Date');
        filters.changeFilterGroupDropdown('Play');
        filters.changeValuesForRangeSidebarFilter('Play Num in Drive:', 0, 5);

        teamPage.getGameLogTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 211, '1st row - Yds');
        });

        teamPage.getGameLogTableStatFor(1,'PA').then(function(stat) {
          assert.equal(stat, 6, '1st row - PA');
        });
      });

      test.it('adding filter - (Play Red Zone: Yes), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Play Red Zone:', 'Yes');

        teamPage.getGameLogTableStatFor(2,'OpYds').then(function(stat) {
          assert.equal(stat, 12, '2nd row - OpYds');
        });

        teamPage.getGameLogTableStatFor(2,'PS').then(function(stat) {
          assert.equal(stat, 6, '2nd row - PS');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        teamPage.clickGameLogTableStatFor(16,'Yds');
        teamPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Patriots Ball Starting At 4:27 At The MIA 45');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        teamPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'MIA 17');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 6);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        teamPage.clickByPossessionTab();
        teamPage.clickByPossessionPlayVideoIcon(2);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 MIA 14");
        });
      });

      test.it('closing modals', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlayModal();
      });
    });

    test.describe("#reports", function() {
      test.it('closing filters', function() {
        filters.closeDropdownFilter('Play Red Zone');
        filters.closeDropdownFilter('Play Num in Drive');
      });

      var reports = [
        { type: 'Team Offense', topStat: 363, statType: "Yd/G" },  
        { type: 'Team Defense', topStat: 344, statType: "Yd/G" },  
        { type: 'Team Turnovers', topStat: -2, statType: "TOMgn" },  
        { type: 'Team Drives', topStat: 2, statType: "OffTD" },  
        { type: 'Team Drive Rates', topStat: 2.3, statType: "Pts/D" },  
        { type: 'Opponent Drive Rates', topStat: 2.1, statType: "Pts/D" },  
        { type: 'Team Offensive Rates', topStat: 5.5, statType: "Yd/Ply" },  
        { type: 'Defensive Rates', topStat: 5.83, statType: "Yd/Ply" },  
        { type: 'Team Offensive Conversions', topStat: '62.5%', statType: "3rdCv%" },  
        { type: 'Defensive Conversions', topStat: '50.0%', statType: "3rdCv%" },  
        { type: 'Team Special Teams Summary', topStat: '100.0%', statType: "FG%" },  
        { type: 'Team Penalties', topStat: 8, statType: "Pen" },  
        { type: 'Offensive Plays', topStat: 2, statType: "OffTD" },  
        { type: 'Defensive Plays', topStat: 3, statType: "OffTD" },  
        { type: 'QB Stats', topStat: 106.1, statType: "PsrRt" },  
        { type: 'Opponent QB Stats', topStat: 104.7, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 106.1, statType: "PsrRt" },  
        { type: 'Opponent Passing Rates', topStat: 104.7, statType: "PsrRt" },  
        { type: 'Rushing', topStat: 106, statType: "RnYds" },  
        { type: 'Opponent Rushing', topStat: 92, statType: "RnYds" },  
        { type: 'Receptions', topStat: 264, statType: "RecYds" },  
        { type: 'Opponent Receptions', topStat: 271, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 363, statType: "Yds" },  
        { type: 'Rushing Receiving', topStat: 363, statType: "Yds" },  
        { type: 'Opponent Rushing Receiving', topStat: 344, statType: "Yds" },  
        { type: 'Touchdowns', topStat: 2, statType: "TD" },  
        { type: 'Opponent Touchdowns', topStat: 3, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 47, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 3, statType: "FG" },  
        { type: 'Two Point Conversions', topStat: 0, statType: "2PtAt" }, 
        { type: 'Third Down Conversions', topStat: '62.5%', statType: "3rdCv%" }, 
        { type: 'Red Zone Drives', topStat: '50.0%', statType: "RZTD%" }, 
        { type: 'Team Differentials', topStat: 2, statType: "PtsMgn" }, 
        { type: 'Kickoffs', topStat: 81.8, statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 2, statType: "P" }, 
        { type: 'Returns', topStat: 26, statType: "K-RYd" }, 
        { type: 'Opponent Returns', topStat: 61, statType: "K-RYd" }, 
        { type: 'Team Offense Rank', topStat: 363, statType: "Yd/G" }, 
        { type: 'Receptions (Adv)', topStat: 74, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 19, statType: "Prsrs" }, 
        { type: 'Team Record', topStat: 1, statType: "Win%" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getGameLogTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Play By Play', function() {
    test.it('test setup', function() {
      teamPage.goToSection("playByPlay");
    });

    test.describe('when selecting filter (Off Half Possession #: 3 to 5)', function() {
      test.it('test setup', function() {
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Off Half Possession #:', 3, 5);
      });
      
      test.it('should show the correct drive header text', function() {
        teamPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, " Patriots Ball Starting At 2:54 At The NE 44");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getPlayByPlayTableStat(1,2).then(function(pitch) {
          assert.equal(pitch, 'NE 44');
        });
        teamPage.getPlayByPlayTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, '(2:54) 29-L.Blount left guard to NE 48 for 4 yards (46-N.Hewitt).');
        });
      });
    });

    test.describe('when selecting defense tab', function() {
      test.it('should show correct row data', function() {
        filters.changeValuesForRangeSidebarFilter('Off Half Possession #:', "", "");
        filters.changeValuesForRangeSidebarFilter('Def Half Possession #:', 3, 5);
        teamPage.clickPlayByPlayPossessionTab('Defense');
      });

      test.it('should show the correct drive header text', function() {
        teamPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, " Dolphins Ball Starting At 14:56 At The MIA 25");
        });
      });

      test.it('should show the correct row data', function() {
        teamPage.getPlayByPlayTableStat(1,1).then(function(pitch) {
          assert.equal(pitch, 'Kickoff');
        });
        teamPage.getPlayByPlayTableStat(1,4).then(function(pitch) {
          assert.equal(pitch, '3-S.Gostkowski kicks 65 yards from NE 35 to end zone, Touchback.');
        });
      });
    })

    test.describe("#videoPlaylist", function() {
      test.it('clicking video icon should open up video modal', function() {
        teamPage.clickPlayByPlayVideoIcon(20);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "2nd & 5 MIA 8");
        });
      });

      test.it('closing modals', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlayModal();
      });

      test.it('removing filter', function() {
        filters.changeValuesForRangeSidebarFilter('Def Half Possession #:', '', '');
      });  
    });  
  });

  test.describe('#Section: Occurrences & Streaks', function() {
    test.it('test setup', function() {
      teamPage.goToSection("occurrencesAndStreaks");
    });

    test.it('table should be populated on load', function() {
      teamPage.getStreaksTableStat(1,4).then(function(stat) {
        assert.isNotNull(stat);
      });
    });  

    test.it('table should have proper headers on load', function() {
      teamPage.getStreaksTableHeader(1).then(function(header) {
        assert.equal(header, "Count");
      });

      teamPage.getStreaksTableHeader(2).then(function(header) {
        assert.equal(header, "StartDate");
      });        

      teamPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "EndDate");
      });        

      teamPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "W");
      });        
    });        

    test.it('changing the main constraint should update the table headers', function() {
      teamPage.changeMainConstraint("Streaks Of", "At Least", 400, "Yards", "In a Game", "Within a Season");
      teamPage.getStreaksTableHeader(2).then(function(header) {
        assert.equal(header, "StartDate");
      });

      teamPage.getStreaksTableHeader(3).then(function(header) {
        assert.equal(header, "EndDate");
      });

      teamPage.getStreaksTableHeader(4).then(function(header) {
        assert.equal(header, "Yds");
      });
    });

    test.it('changing the main constraint should update the table stats', function() {
      teamPage.getStreaksTableStat(1,4).then(function(yards) {
        assert.equal(yards, 496, 'W14 Yards');
      });

      teamPage.getStreaksTableStat(1,2).then(function(team) {
        assert.equal(team, "2016 W14 - BAL@NE\n ", 'Row1 Game');
      });
    });      
  });

  test.describe('#Section: Splits', function() {
    test.it('test setup', function() {
      teamPage.goToSection("splits");
    });

    test.it('should show the correct section titles', function() {
      teamPage.getSplitsTableHeaderText(1).then(function(title) {
        assert.equal(title, 'Totals');
      });

      teamPage.getSplitsTableHeaderText(2).then(function(title) {
        assert.equal(title, 'Seasons');
      });

      teamPage.getSplitsTableHeaderText(3).then(function(title) {
        assert.equal(title, 'Home/Road');
      });

      teamPage.getSplitsTableHeaderText(4).then(function(title) {
        assert.equal(title, 'Division');
      });
      
      teamPage.getSplitsTableHeaderText(5).then(function(title) {
        assert.equal(title, 'Quarter');
      });

      teamPage.getSplitsTableHeaderText(6).then(function(title) {
        assert.equal(title, 'Downs');
      });             

      teamPage.getSplitsTableHeaderText(7).then(function(title) {
        assert.equal(title, 'Goalline Distance');
      });             

      teamPage.getSplitsTableHeaderText(8).then(function(title) {
        assert.equal(title, 'First Down Distance');
      });             

      teamPage.getSplitsTableHeaderText(9).then(function(title) {
        assert.equal(title, 'Goal To Go Distance');
      });             

      teamPage.getSplitsTableHeaderText(10).then(function(title) {
        assert.equal(title, 'QB Vs Non QB');
      });             

      teamPage.getSplitsTableHeaderText(11).then(function(title) {
        assert.equal(title, 'Air Yards');
      });             
    });  

    test.it('should show the correct data in the totals subsection', function() {
      teamPage.getSplitsTableStat(1,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Totals', 'row 1 title should be labled "Totals"');
      });             

      teamPage.getSplitsTableStat(1,3).then(function(wins) {
        assert.equal(wins, 14, 'row 1 should have 14 wins');
      });             

      teamPage.getSplitsTableStat(2,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Opponent', 'row 2 title should be labled "Opponent"');
      });                   

      teamPage.getSplitsTableStat(2,7).then(function(stat) {
        assert.equal(stat, 250, 'row 2 should have 250 PS');
      });                         
    });

    test.it('should show the correct data in the home/road subsection', function() {
      teamPage.getSplitsTableStat(4,1).then(function(rowTitle) {
        assert.equal(rowTitle, 'Home', 'row 1 title');
      });             

      teamPage.getSplitsTableStat(5,2).then(function(stat) {
        assert.equal(stat, 8, 'row 2 should g');
      });             

      teamPage.getSplitsTableStat(4,11).then(function(stat) {
        assert.equal(stat, 2645, 'row 1 OpYds');
      });                   

      teamPage.getSplitsTableStat(5,14).then(function(stat) {
        assert.equal(stat, 5, 'row 2 TOMgn');
      });  
    });                              

    test.describe("#reports", function() {
      var reports = [
        { type: 'Team Offense', totalsStat: 386.3, roadStat: 389.1, statType: "Yd/G" },  
        { type: 'Team Defense', totalsStat: 326.4, roadStat: 322.3, statType: "Yd/G" },  
        { type: 'Team Turnovers', totalsStat: 12, roadStat: 5, statType: "TOMgn" },  
        { type: 'Team Drives', totalsStat: 51, roadStat: 26, statType: "OffTD" },  
        { type: 'Team Drive Rates', totalsStat: 2.4, roadStat: 2.5, statType: "Pts/D" },  
        { type: 'Opponent Drive Rates', totalsStat: 1.39, roadStat: 1.42, statType: "Pts/D" },  
        { type: 'Team Offensive Rates', totalsStat: 5.85, roadStat: 5.8, statType: "Yd/Ply" },  
        { type: 'Defensive Rates', totalsStat: 5.23, roadStat: 5.25, statType: "Yd/Ply" },  
        { type: 'Team Offensive Conversions', totalsStat: '45.8%', roadStat: '50.4%', statType: "3rdCv%" },  
        { type: 'Defensive Conversions', totalsStat: '36.9%',roadStat: '37.9%', statType: "3rdCv%" },  
        { type: 'Team Special Teams Summary', totalsStat: '84.4%', roadStat: '83.3%', statType: "FG%" },  
        { type: 'Team Penalties', totalsStat: 93, roadStat: 45, statType: "Pen" },  
        { type: 'Offensive Plays', totalsStat: 51, roadStat: 26, statType: "OffTD" },  
        { type: 'Defensive Plays', totalsStat: 27, roadStat: 15, statType: "OffTD" },  
        { type: 'QB Stats', totalsStat: 109.5, roadStat: 110.5, statType: "PsrRt" },  
        { type: 'Opponent QB Stats', totalsStat: 84.4, roadStat: 87.7, statType: "PsrRt" },  
        { type: 'Passing Rates', totalsStat: 109.5, roadStat: 110.5, statType: "PsrRt" },  
        { type: 'Opponent Passing Rates', totalsStat: 84.4, roadStat: 87.7, statType: "PsrRt" },  
        { type: 'Rushing', totalsStat: 1872, roadStat: 934, statType: "RnYds" },  
        { type: 'Opponent Rushing', totalsStat: 1417, roadStat: 699, statType: "RnYds" },  
        { type: 'Receptions', totalsStat: 4456, roadStat: 2237, statType: "RecYds" },  
        { type: 'Opponent Receptions', totalsStat: 4033, roadStat: 1981, statType: "RecYds" },  
        { type: 'From Scrimmage', totalsStat: 6180, roadStat: 3113, statType: "Yds" },  
        { type: 'Rushing Receiving', totalsStat: 6180, roadStat: 3113, statType: "Yds" },  
        { type: 'Opponent Rushing Receiving', totalsStat: 5223, roadStat: 2578, statType: "Yds" },  
        { type: 'Touchdowns', totalsStat: 51, roadStat: 26, statType: "TD" },  
        { type: 'Opponent Touchdowns', totalsStat: 27, roadStat: 15, statType: "TD" },  
        { type: 'Defensive Stats', totalsStat: 902, roadStat: 425, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', totalsStat: 27, roadStat: 15, statType: "FG" },  
        { type: 'Two Point Conversions', totalsStat: 2, roadStat: 2, statType: "2PtAt" }, 
        { type: 'Third Down Conversions', totalsStat: '45.8%', roadStat: '50.4%', statType: "3rdCv%" }, 
        { type: 'Red Zone Drives', totalsStat: '63.3%', roadStat: '63.3%', statType: "RZTD%" }, 
        { type: 'Team Differentials', totalsStat: 191, roadStat: 101, statType: "PtsMgn" }, 
        { type: 'Kickoffs', totalsStat: 76.6, roadStat: 76.6, statType: "OpKRSP" }, 
        { type: 'Punts', totalsStat: 72, roadStat: 34, statType: "P" }, 
        { type: 'Returns', totalsStat: 542, roadStat: 285, statType: "K-RYd" }, 
        { type: 'Opponent Returns', totalsStat: 771, roadStat: 427, statType: "K-RYd" }, 
        { type: 'Team Offense Rank', totalsStat: 386.3, roadStat: 389.1, statType: "Yd/G" }, 
        { type: 'Receptions (Adv)', totalsStat: 1140, roadStat: 579, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', totalsStat: 303, roadStat: 150, statType: "Prsrs" }, 
        { type: 'Team Record', totalsStat: .875, roadStat: 1, statType: "Win%" },  
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for totals: " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getSplitsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.totalsStat);
          });
        });

        test.it("selecting (report: " + report.type + ") shows the correct stat value for road: " + report.statType, function() {
          teamPage.getSplitsTableStatFor(5,report.statType).then(function(stat) {
            assert.equal(stat, report.roadStat);
          });
        });
      });
    });
  });
  
  test.describe('#Section: Roster', function() {
    test.it('test setup', function() {
      teamPage.goToSection("roster");
    });

    test.describe("#sorting", function() {
      var columns = [
        { colName: 'OffTD', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'Rush', sortType: 'ferpNumber', defaultSort: 'desc' },
        { colName: 'FL', sortType: 'ferpNumber', defaultSort: 'asc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) teamPage.clickRosterTableHeaderFor(column.colName);
          teamPage.waitForTableToLoad();
          teamPage.getRosterTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          teamPage.clickRosterTableHeaderFor(column.colName);
          teamPage.waitForTableToLoad();
          teamPage.getRosterTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });      

    test.describe("#filters", function() {
      test.it('adding filter - (Deepest Drive Dist to Goal: 0 to 30), shows correct stats ', function() {
        teamPage.clickRosterTableHeaderFor('Yds');
        filters.changeFilterGroupDropdown('Drive');
        filters.changeValuesForRangeSidebarFilter('Deepest Drive Dist to Goal:', 0, 30);

        teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 2626, '1st row - Yds');
        });
      });

      test.it('adding filter - (Drive Goal To Go: Yes), shows correct stats ', function() {
        filters.selectForBooleanDropdownSidebarFilter('Drive Goal To Go:', 'Yes');

        teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 1594, '1st row - Yds');
        });
      });

      test.it('adding filter - (Drive Plays: 0 to 8), shows correct stats ', function() {
        filters.changeValuesForRangeSidebarFilter('Drive Plays:', 0, 8);

        teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 777, '1st row - Yds');
        });
      });
    });

    test.describe("#videoPlaylist", function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        teamPage.clickRosterTableStatFor(1,'OffTD');
        teamPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Patriots Ball Starting At 3:07 At The NYJ 47');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        teamPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'NYJ 5');
        });
      });

      test.it('1st play in Flat View section should have the correct Yards stat', function() {
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 5);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        teamPage.clickByPossessionTab();
        teamPage.clickByPossessionPlayVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "3rd & 5 NYJ 5");
        });
      });

      test.it('closing modals', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlayModal();
      });
    });

    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for Tom Brady should add him to the pinned table', function() {
        teamPage.clickTablePin(1);

        teamPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, 'Tom Brady (QB-NE)');
        });
      });

      test.it('selecting LeGarrette Blount from search should add player to table', function() {
        teamPage.clickIsoBtn("on");
        teamPage.addToIsoTable('LeGarrette Blount', 1)

        teamPage.getRosterTableStatFor(2,'Player').then(function(stat) {
          assert.equal(stat, 'LeGarrette Blount (RB-NE)', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        teamPage.getPinnedTotalTableStat(4).then(function(stat) {
          assert.equal(stat, 1017, 'pinned total - Yds');
        });
      });

      test.it('turning off isolation mode should show players in iso table', function() {
        teamPage.clickIsoBtn("off");
        teamPage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, 'Tom Brady (QB-NE)', '1st row player name');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        teamPage.clickChartColumnsBtn();
        teamPage.openHistogram(4); 
        teamPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        teamPage.hoverOverHistogramStack(5)
        teamPage.getTooltipText().then(function(text) {
          assert.equal(text, 'Tom Brady: 777 (QB)', 'tooltip for 5th bar');
        });
      });

      test.it('pinned teams should be represented by circles', function() {
        teamPage.getHistogramCircleCount().then(function(count) {
          assert.equal(count, 2, '# of circles on histogram')
        })
      })

      test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
        teamPage.toggleHistogramDisplayPinsAsBars();
        teamPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 10, '# of bars on histogram');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        teamPage.changeHistogramBinCount(3);
        teamPage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        teamPage.closeModal();
        teamPage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        teamPage.openScatterChart(10,11);

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

      test.it('clearing pins', function() {
        teamPage.clearTablePins();
      });   
    });

    test.describe("#groupBy", function() {
      test.it('remove filters', function() {
        filters.closeDropdownFilter('Drive Plays');
        filters.closeDropdownFilter('Drive Goal To Go');
        filters.changeValuesForRangeSidebarFilter('Deepest Drive Dist to Goal:', '', '');
        
      });

      test.it('selecting "By Season" shows the correct headers', function() {
        teamPage.changeGroupBy("By Season");
        teamPage.getRosterTableHeader(4).then(function(header) {
          assert.equal(header, "Season");
        });

        teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 3618, 'Tom Brady Yds');
        });
      });

      test.it('selecting "By Game" shows the correct headers', function() {
        teamPage.changeGroupBy("By Game");
        teamPage.getRosterTableHeader(4).then(function(header) {
          assert.equal(header, "Opponent");
        });          

        teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 420, 'Game 1 - Yds');
        });
      });        

      test.it('selecting "Total"', function() {
        teamPage.changeGroupBy("Totals");
      });      
    });

    test.describe("#statsView", function() {
      var topColor = "rgba(108, 223, 118, 1)";
      var statViews = [
        { type: 'Rank', topStat: 1, color: true },            
        { type: 'Percentile', topStat: "100.0%", color: true },
        { type: 'Z-Score', topStat: 2.996 },
        { type: 'Stat Grade', topStat: 80 },
        { type: 'Stat (Rank)', topStat: "3618 (1)", color: true },
        { type: 'Stat (Percentile)', topStat: "3618 (100%)", color: true },
        { type: 'Stat (Z-Score)', topStat: "3618 (3.00)" },
        { type: 'Stat (Stat Grade)', topStat: "3618 (80)" },
        { type: 'Per Game', topStat: 301.50 },
        { type: 'Per Team Game', topStat: 226.13 },
        { type: 'Pct of Team', topStat: "58.5%" },
        { type: 'Pct of Team on Field', topStat: "0.0%" },
        { type: 'Team Stats', topStat: 6180 },
        { type: 'Team Stats on Field', topStat: 3618 },
        { type: 'Stats', topStat: 3618, col: 12 }
      ];
  
      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          teamPage.changeStatsView(statView.type);  
          teamPage.getRosterTableStatFor(1,'Yds').then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });

        if (statView.color) {
          test.it("selecting " + statView.type + " shows the top value the right color", function() {
            teamPage.getRosterTableBgColorFor(1,'Yds').then(function(color) {
              assert.equal(color, topColor);
            });
          });
        }
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'QB Stats', topStat: 112.2, statType: "PsrRt" },  
        { type: 'QB Stats (Adv)', topStat: 112.2, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 112.2, statType: "PsrRt" },  
        { type: 'Passing Rates (Adv)', topStat: 8.23, statType: "Yd/Att" },  
        { type: 'Rushing', topStat: 1161, statType: "RnYds" },  
        { type: 'Receptions', topStat: 1106, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 1199, statType: "ScrYds" },  
        { type: 'Rushing Receiving', topStat: 1199, statType: "ScrYds" },  
        { type: 'Touchdowns', topStat: 28, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 92, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 27, statType: "FG" },  
        { type: 'Kickoffs', topStat: 76.6, statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 72, statType: "P" }, 
        { type: 'Returns', topStat: 180, statType: "K-RYd" }, 
        { type: 'Receptions (Adv)', topStat: 604, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 60, statType: "Prsrs" }, 
        { type: 'Blocking', topStat: 49, statType: "PrsrAllwd" }, 
        { type: 'Player Participation/Grades', topStat: 61.0, statType: "PffGrade" }, 
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getRosterTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Multi-Filter', function() {
    test.it('test setup', function() {
      teamPage.goToSection("multiFilter");
    });

    test.it('should show the correct data initially', function() {
      teamPage.getMultiFilterTableStatFor(1,'Filter').then(function(stat) {
        assert.equal(stat, 'top');
      });

      teamPage.getMultiFilterTableStatFor(2,'Filter').then(function(stat) {
        assert.equal(stat, 'bottom');
      });      

      teamPage.getMultiFilterTableStatFor(1,'Win%').then(function(stat) {
        assert.equal(stat, "0.875");
      });
    });  

    test.describe('#filters', function() {
      test.it('adding filter (Opponent Timeouts Left: 0 to 1) updates data for top row', function() {
        filters.changeValuesForRangeSidebarFilter('Opponent Timeouts Left:', 0, 1);
        teamPage.getMultiFilterTableStatFor(1,'Yds').then(function(stat) {
          assert.equal(stat, 366);
        });
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        teamPage.clickMultiFilterTableStatFor(1,'TO');
        teamPage.getPossessionHeaderText(1).then(function(text) {
          assert.equal(text, ' Patriots Ball Starting At 8:39 At The SEA 43');
        });
      });

      test.it('1st play in Play by Play modal should have the correct ballposition info', function() {
        teamPage.getPossessionPlayText(1,2).then(function(text) {
          assert.equal(text, 'SEA 43');
        });
      });

      test.it('1st play in Flat View section should have the correct PlayYardsGain stat', function() {
        teamPage.clickFlatViewTab();
        teamPage.getFlatViewPlayText(1,6).then(function(stat) {
          assert.equal(stat, 5);
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        teamPage.clickByPossessionTab();
        teamPage.clickByPossessionPlayVideoIcon(1);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "2nd & 10 SEA 43");
        });
      });

      test.it('closing modals', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlayModal();
      });
    });  

    test.describe('#groupBy', function() {
      test.it('selecting "By Season" shows the correct stats', function() {
        teamPage.changeGroupBy("By Season");
        teamPage.getMultiFilterTableStatFor(1, 'Season').then(function(stat) {
          assert.equal(stat, 2016);
        });

        teamPage.getMultiFilterTableStatFor(2,'W').then(function(stat) {
          assert.equal(stat, 14);
        });
      });

      test.it('selecting "By Game" shows the correct stats', function() {
        teamPage.changeGroupBy("By Game");
        teamPage.getMultiFilterTableStatFor(1, 'opponent').then(function(stat) {
          assert.equal(stat, " @ ARI");
        });          

        teamPage.getMultiFilterTableStatFor(2,'OpYds').then(function(stat) {
          assert.equal(stat, 67, 'Game 2 - OpYds');
        });
      });

      test.it('selecting "By Game Result" shows the correct stats', function() {
        teamPage.changeGroupBy("By Game Result");
        teamPage.getMultiFilterTableStatFor(1, 'W').then(function(stat) {
          assert.equal(stat, 12, 'Row 1 - W');
        });          

        teamPage.getMultiFilterTableStatFor(4,'L').then(function(stat) {
          assert.equal(stat, 2, 'Row 4 - L');
        });
      });

      test.it('selecting "Total"', function() {
        teamPage.changeGroupBy("Totals");
      });     
    });  

    test.describe("#reports", function() {
      var reports = [
        { type: 'Team Offense', topStat: 3.89, bottomStat: 5.85, statType: "Yd/Ply" },  
        { type: 'Team Defense', topStat: 8.5, bottomStat: 88.6, statType: "RnYd/G" },  
        { type: 'Team Turnovers', topStat: 2, bottomStat: 12, statType: "TOMgn" },  
        { type: 'Team Drives', topStat: 3, bottomStat: 51, statType: "OffTD" },  
        { type: 'Team Drive Rates', topStat: 1.88, bottomStat: 2.40, statType: "Pts/D" },  
        { type: 'Opponent Drive Rates', topStat: 2.00, bottomStat: 1.39, statType: "Pts/D" },  
        { type: 'Team Offensive Rates', topStat: 3.89, bottomStat: 5.85, statType: "Yd/Ply" },  
        { type: 'Defensive Rates', topStat: 5.42, bottomStat: 5.23, statType: "Yd/Ply" },  
        { type: 'Team Offensive Conversions', topStat: "30.4%", bottomStat: "45.8%", statType: "3rdCv%" },  
        { type: 'Defensive Conversions', topStat: "42.1%", bottomStat: "36.9%", statType: "3rdCv%" },  
        { type: 'Team Special Teams Summary', topStat: "50.0%", bottomStat: "84.4%", statType: "FG%" },  
        { type: 'Team Penalties', topStat: 4, bottomStat: 93, statType: "Pen" },  
        { type: 'Offensive Plays', topStat: 3, bottomStat: 51, statType: "OffTD" },  
        { type: 'Defensive Plays', topStat: 3, bottomStat: 27, statType: "OffTD" },  
        { type: 'QB Stats', topStat: 99.8, bottomStat: 109.5, statType: "PsrRt" },  
        { type: 'Opponent QB Stats', topStat: 84.5, bottomStat: 84.4, statType: "PsrRt" },  
        { type: 'Passing Rates', topStat: 99.8, bottomStat: 109.5, statType: "PsrRt" },  
        { type: 'Opponent Passing Rates', topStat: 84.5, bottomStat: 84.4, statType: "PsrRt" },  
        { type: 'Rushing', topStat: 159, bottomStat: 1872, statType: "RnYds" },  
        { type: 'Opponent Rushing', topStat: 110, bottomStat: 1417, statType: "RnYds" },  
        { type: 'Receptions', topStat: 207, bottomStat: 4456, statType: "RecYds" },  
        { type: 'Opponent Receptions', topStat: 483, bottomStat: 4033, statType: "RecYds" },  
        { type: 'From Scrimmage', topStat: 366, bottomStat: 6180, statType: "Yds" },  
        { type: 'Rushing Receiving', topStat: 366, bottomStat: 6180, statType: "Yds" },  
        { type: 'Opponent Rushing Receiving', topStat: 575, bottomStat: 5223, statType: "Yds" },  
        { type: 'Touchdowns', topStat: 3, bottomStat: 51, statType: "TD" },  
        { type: 'Opponent Touchdowns', topStat: 3, bottomStat: 27, statType: "TD" },  
        { type: 'Defensive Stats', topStat: 78, bottomStat: 902, statType: "DfTkl" },  
        { type: 'FG / XP / 2Pt', topStat: 3, bottomStat: 27, statType: "FG" },  
        { type: 'Two Point Conversions', topStat: '-', bottomStat: '50.0%', statType: "2PtCv%" }, 
        { type: 'Third Down Conversions', topStat: '30.4%', bottomStat: '45.8%', statType: "3rdCv%" }, 
        { type: 'Red Zone Drives', topStat: '100.0%', bottomStat: '63.3%', statType: "RZTD%" }, 
        { type: 'Team Differentials', topStat: -4, bottomStat: 191, statType: "PtsMgn" }, 
        { type: 'Kickoffs', topStat: 79.0, bottomStat: 76.6, statType: "OpKRSP" }, 
        { type: 'Punts', topStat: 7, bottomStat: 72, statType: "P" }, 
        { type: 'Returns', topStat: 70, bottomStat: 542, statType: "K-RYd" }, 
        { type: 'Opponent Returns', topStat: 75, bottomStat: 771, statType: "K-RYd" }, 
        { type: 'Team Offense Rank', topStat: 28.2, bottomStat: 386.3, statType: "Yd/G" }, 
        { type: 'Receptions (Adv)', topStat: 97, bottomStat: 1140, statType: "Routes" }, 
        { type: 'Defensive Stats (Adv)', topStat: 30, bottomStat: 303, statType: "Prsrs" }
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct top stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getMultiFilterTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });

        test.it("selecting (report: " + report.type + ") shows the correct bottom stat value for " + report.statType, function() {
          teamPage.changeReport(report.type);  
          teamPage.getMultiFilterTableStatFor(2,report.statType).then(function(stat) {
            assert.equal(stat, report.bottomStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Play Card', function() {
    test.it('going to SF 49ers 2016 page', function() {
      navbar.goToTeamsPage();
      filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
      teamsPage.clickStatsTableStat(31,3); // should click into 49ers Team Link
    });

    test.it('going to play card section', function() {
      teamPage.goToSection("playCard");
      browser.refresh();
    });

    test.describe('#defensivePlay: rush', function() {
      test.describe('#metadata', function() {
        test.it("should show the correct personnel in heading", function() {
          teamPage.getPlayCardPersonnel('away').then(function(stat) {
            assert.equal(stat, '12P');
          });

          teamPage.getPlayCardPersonnel('home').then(function(stat) {
            assert.equal(stat, '3-4-4');
          });
        });

        test.it("should show the correct quarter and time", function() {
          teamPage.getPlayCardQuarter().then(function(stat) {
            assert.equal(stat, 'Q 1');
          });

          teamPage.getPlayCardTime().then(function(stat) {
            assert.equal(stat, '15:00');
          });
        });

        test.it("should show the correct play result", function() {
          teamPage.getPlayCardPlayResult().then(function(stat) {
            assert.equal(stat, '(15:00) 30-T.Gurley right tackle to LA 29 for 4 yards (51-G.Hodges; 99-D.Buckner).');
          });
        });
      });
      
      test.describe('#playVisual', function() {
        test.it("paths don't show initially", function() {
          teamPage.getPlayCardNumPaths().then(function(stat) {
            assert.equal(stat, 0, '# of routes visible');
          });
        });

        test.it("paths show when Show Paths switch is toggled", function() {
          teamPage.togglePlayCardShowPaths();
          teamPage.getPlayCardNumPaths().then(function(stat) {
            assert.equal(stat, 11, '# of routes visible');
          });
        });

        test.it("paths don't show when Show Paths switch is toggled off", function() {
          teamPage.togglePlayCardShowPaths();
          teamPage.getPlayCardNumPaths().then(function(stat) {
            assert.equal(stat, 0, '# of routes visible');
          });
        });

        test.it("selecting jump to: end updates play visual and time meter", function() {
          teamPage.clickPlayCardJumpToEnd();

          teamPage.getPlayCardPlayerLocation(1).then(function(stat) {
            assert.equal(stat, 'translate(251.9179245283019,251.05005000000006)', 'location for #55');
          })

          teamPage.getPlayCardPlayTime().then(function(stat) {
            assert.equal(stat, 4.7, 'play time');
          })
        });

        test.it("moving time meter manually updates play visual", function() {
          teamPage.clickPlayCardTimeSlider(50);

          teamPage.getPlayCardPlayerLocation(1).then(function(stat) {
            assert.equal(stat, 'translate(305.6166169811321,194.41633005000017)', 'location for #55');
          })

          teamPage.getPlayCardPlayTime().then(function(stat) {
            assert.equal(stat, 1.399, 'play time');
          })
        });

        test.it("selecting jump to: snap updates play visual and time meter", function() {
          teamPage.clickPlayCardJumpToSnap();

          teamPage.getPlayCardPlayerLocation(1).then(function(stat) {
            assert.equal(stat, 'translate(324.17961226415093,225.34999950000008)', 'location for #55');
          })

          teamPage.getPlayCardPlayTime().then(function(stat) {
            assert.equal(stat, 0, 'play time');
          })
        });

        test.it("hovering over player shows tooltip and highlights player in player list", function() {
          teamPage.hoverOverPlayCardPlayer(1);
          teamPage.getPlayCardTooltip().then(function(text) {
            assert.equal(text, 'Ahmad Brooks #55', 'tooltip text');
          });

          teamPage.getPlayCardParticipationTableBgColor(1).then(function(color) {
            assert.equal(color, 'rgba(97, 153, 209, 1)', 'Ahmed Brooks background color');
          });
        });

        test.it("clicking on player in right list should hide player in visual", function() {
          teamPage.clickPlayCardParticipationTablePlayer(1);
          teamPage.getPlayCardNumPlayers().then(function(count) {
            assert.equal(count, 10, '# of players on play card');
          });
        });
      });
    });

    test.describe('#defensivePlay: pass', function() {
      test.it("selecting 2nd play in list should be pass play", function() {
        teamPage.clickPlayCardPlay(2);
      });

      test.describe('#metadata', function() {
        test.it("should show the correct personnel in heading", function() {
          teamPage.getPlayCardPersonnel('away').then(function(stat) {
            assert.equal(stat, '12P');
          });

          teamPage.getPlayCardPersonnel('home').then(function(stat) {
            assert.equal(stat, '3-4-4');
          });
        });

        test.it("should show the correct quarter and time", function() {
          teamPage.getPlayCardQuarter().then(function(stat) {
            assert.equal(stat, 'Q 1');
          });

          teamPage.getPlayCardTime().then(function(stat) {
            assert.equal(stat, '14:17');
          });
        });

        test.it("should show the correct play result", function() {
          teamPage.getPlayCardPlayResult().then(function(stat) {
            assert.equal(stat, '(14:17) (Shotgun) 17-C.Keenum pass short right to 89-T.Higbee to LA 31 for 2 yards (95-T.Carradine, 35-E.Reid). Caught at LA30. 1-yd. YAC');
          });
        });
      });
      
      test.describe('#playVisual', function() {
        test.it("selecting jump to: throw updates play visual and time meter", function() {
          teamPage.clickPlayCardJumpToThrow();

          teamPage.getPlayCardPlayerLocation(1).then(function(stat) {
            assert.equal(stat, 'translate(584.2724493710692,292.58335000000017)', 'location for #58');
          })

          teamPage.getPlayCardPlayTime().then(function(stat) {
            assert.equal(stat, 1.4, 'play time');
          })
        });

        test.it("selecting jump to: pass result updates play visual and time meter", function() {
          teamPage.clickPlayCardJumpToCatch();

          teamPage.getPlayCardPlayerLocation(1).then(function(stat) {
            assert.equal(stat, 'translate(667.4010056603772,282.9799799999999)', 'location for #58');
          })

          teamPage.getPlayCardPlayTime().then(function(stat) {
            assert.equal(stat, 2.4, 'play time');
          })
        });
      });
    });

    test.describe('#offensivePlay: rush', function() {
      test.it("selecting 9th play in list should be offensive rush play", function() {
        teamPage.clickPlayCardPlay(9);
      });

      test.describe('#metadata', function() {
        test.it("should show the correct personnel in heading", function() {
          teamPage.getPlayCardPersonnel('away').then(function(stat) {
            assert.equal(stat, '4-2-5');
          });

          teamPage.getPlayCardPersonnel('home').then(function(stat) {
            assert.equal(stat, '11P');
          });
        });

        test.it("should show the correct quarter and time", function() {
          teamPage.getPlayCardQuarter().then(function(stat) {
            assert.equal(stat, 'Q 1');
          });

          teamPage.getPlayCardTime().then(function(stat) {
            assert.equal(stat, '11:20');
          });
        });

        test.it("should show the correct play result", function() {
          teamPage.getPlayCardPlayResult().then(function(stat) {
            assert.equal(stat, '(11:20) (Shotgun) 28-C.Hyde left tackle to SF 19 for 1 yard (21-C.Sensabaugh, 26-M.Barron).');
          });
        });
      });
      
      test.describe('#playVisual', function() {
        test.it("tackle icon should initially be visible in visual", function() {
          teamPage.isPlayCardTackleDisplayed().then(function(displayed) {
            assert.equal(displayed, true, 'red X is displayed for tackle');
          });
        });

        test.it("toggling show result off should hide tackle icon in visual", function() {
          teamPage.togglePlayCardShowResult();
          teamPage.isPlayCardTackleDisplayed().then(function(displayed) {
            assert.equal(displayed, false, 'red X is displayed for tackle');
          });
        });

        test.it("rusher should be listed on player list", function() {
          teamPage.getPlayCardParticipationTablePlayerAction(5).then(function(text) {
            assert.equal(text, 'Rusher', 'action for Carlos Hyde');
          });
        });
      });

      test.describe('#findSimilarPreSnap', function() {
        test.it("clicking btn should show 10 similiar presnap plays", function() {
          teamPage.clickPlayCardFindSimilarPreSnapBtn();
          teamPage.getPlayCardModalPlayCount().then(function(count) {
            assert.equal(count, 10);
          });
        });

        test.it("close modal", function() {
          teamPage.closePlayByPlayModal();
        });
      });
    });

    test.describe('#offensivePlay: pass', function() {
      test.it("selecting 10th play in list should be offensive pass play", function() {
        teamPage.clickPlayCardPlay(10);
      });

      test.describe('#metadata', function() {
        test.it("should show the correct personnel in heading", function() {
          teamPage.getPlayCardPersonnel('away').then(function(stat) {
            assert.equal(stat, '4-2-5');
          });

          teamPage.getPlayCardPersonnel('home').then(function(stat) {
            assert.equal(stat, '11P');
          });
        });

        test.it("should show the correct quarter and time", function() {
          teamPage.getPlayCardQuarter().then(function(stat) {
            assert.equal(stat, 'Q 1');
          });

          teamPage.getPlayCardTime().then(function(stat) {
            assert.equal(stat, '11:00');
          });
        });

        test.it("should show the correct play result", function() {
          teamPage.getPlayCardPlayResult().then(function(stat) {
            assert.equal(stat, '(11:00) (No Huddle, Shotgun) 2-B.Gabbert pass incomplete short right to 82-T.Smith.');
          });
        });
      });

      test.describe('#playVisual', function() {
        test.it("pass path should be hidden when show result toggle is off", function() {
          teamPage.isPlayCardPassPathDisplayed().then(function(displayed) {
            assert.equal(displayed, false);
          })
        });

        test.it("pass path should show when show result toggle is on", function() {
          teamPage.togglePlayCardShowResult();
          teamPage.isPlayCardPassPathDisplayed().then(function(displayed) {
            assert.equal(displayed, true, 'pass path displayed');
          })
        });

        test.it("incomplete pass should be represented by empty circle", function() {
          teamPage.isPlayCardIncompletePassDisplayed().then(function(displayed) {
            assert.equal(displayed, true, 'incomplete pass displayed')
          })
        });

        test.it("target and passer should be listed on player list", function() {
          teamPage.getPlayCardParticipationTablePlayerAction(1).then(function(text) {
            assert.equal(text, 'Target', 'action for Torrey Smith');
          });

          teamPage.getPlayCardParticipationTablePlayerAction(6).then(function(text) {
            assert.equal(text, 'Passer', 'action for Blaine Gabbert');
          });          
        });
      });   

      test.describe('#findSimilarPass', function() {
        test.it("clicking btn should show 10 similiar pass plays", function() {
          teamPage.clickPlayCardFindSimilarPassBtn();
          teamPage.getPlayCardModalPlayCount().then(function(count) {
            assert.equal(count, 10);
          });
        });

        test.it("close modal", function() {
          teamPage.closePlayByPlayModal();
        });
      });
    });

    // test.describe("#videoPlaylist", function() {
    //   test.it("selecting 17th play in list should be defensive sack play", function() {
      
    //   });      

    //   test.it('clicking play video should open up video modal', function() {

    //     teamPage.getVideoPlaylistText(1,1).then(function(text) {
    //       assert.equal(text, "2nd & 1 ARI 1");
    //     });
    //   });

    //   test.it('closing modal', function() {
    //     teamPage.closeVideoPlaylistModal();
    //   });
    // });
  });

  test.describe('#Section: Game Day Participation', function() {
    test.it('test setup', function() {
      teamPage.goToSection("gameDayParticipation");
    });

    test.describe('#filters', function() {
      test.it('adding filter - (Quarter: Second), shows correct stats', function() {
        filters.toggleSidebarFilter('Quarter:', 'Second', true);

        teamPage.getGameDayTableStatFor(1,'Total Plays').then(function(stat) {
          assert.equal(stat, 191, '11P Total Plays');
        });
      });

      test.it('adding filter - (Play Type: Pass), shows correct stats', function() {
        filters.toggleSidebarFilter('Play Type:', 'Pass', true);

        teamPage.getGameDayTableStatFor(2,'Total Passes').then(function(stat) {
          assert.equal(stat, 12, '12P Total Plays');
        });
      });      
    });

    test.describe('#positionClicking', function() {
      test.it('clicking into OL stat opens player list', function() {
        teamPage.clickGameDayTableStatFor(1,'OL');
        teamPage.getGameDayExpandedTableStat(1,2).then(function(player) {
          assert.equal(player, 'Zane Beadles', '1st row player name');
        })
      });
    });

    test.describe('#videoPlaylist', function() {
      test.it('clicking a table stat should open Pop up Play by Play modal', function() {
        teamPage.clickGameDayTableStatFor(1,'Total Plays');
        teamPage.getFlatViewPlayText(1,1).then(function(stat) {
          assert.equal(stat, '2016-09-12 (W1)');
        });
      });

      test.it('clicking video icon should open up video modal', function() {
        teamPage.clickByPossessionTab();
        teamPage.clickByPossessionPlayVideoIcon(12);
        teamPage.getVideoPlaylistText(1,1).then(function(text) {
          assert.equal(text, "1st & 10 SF 37");
        });
      }); 

      test.it('closing modals', function() {
        teamPage.closeVideoPlaylistModal();
        teamPage.closePlayByPlayModal();
      });
    });

    test.describe('#showPercentage', function() {
      test.it('toggling show percentage switch changes table to percentages', function() {
        teamPage.toggleGameDayShowPercentageBtn();
        teamPage.getGameDayTableStatFor(1,'Receptions').then(function(stat) {
          assert.equal(stat, '62%', '11P Receptions %');
        });
      });
    });
  });
});