var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var Filters = require('../../../pages/nfl/filters.js');
var GroupsPage = require('../../../pages/nfl/groups/groups_page.js');
var navbar, filters, groupsPage;

test.describe('#Page: Groups', function() {
  test.it('navigating to groups page', function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    groupsPage = new GroupsPage(driver);
  });

  test.it('clicking the groups link goes to the correct page', function() {
    navbar.goToGroupsPage();

    driver.getTitle().then(function(title) {
      assert.equal( title, 'Group Stats', 'Correct title');
    });
  });

  // Sorting
  test.describe("#sorting", function() {
    var columns = [
      { colName: 'Win%', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
      { colName: 'OpYds', sortType: 'ferpNumber', defaultSort: 'asc' },
      { colName: 'PS', sortType: 'ferpNumber', defaultSort: 'desc' },
    ]

    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        if (!column.initialCol) groupsPage.clickTableHeaderFor(column.colName);
        groupsPage.waitForTableToLoad();
        groupsPage.getTableStatsFor(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
          assert.deepEqual(stats, sortedArray);
        })
      });

      test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
        groupsPage.clickTableHeaderFor(column.colName);
        groupsPage.waitForTableToLoad();
        groupsPage.getTableStatsFor(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
          var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
          assert.deepEqual(stats, sortedArray);
        })
      });
    }); 
  });  

  test.describe("#filters", function() {
    test.it('sort by wins', function() {
      groupsPage.clickTableHeaderFor('W');
    });

    test.it('changing filter - (Season/Week: 2016 W1 to 2016 W17), shows correct stats', function() {
      filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W17', true);
      groupsPage.waitForTableToLoad();
      groupsPage.getTableStatFor(1,'Division').then(function(stat) {
        assert.equal(stat, 'NFC East', '1st row - Group');
      });

      groupsPage.getTableStatFor(1,'W').then(function(stat) {
        assert.equal(stat, 39, '1st row - Wins');
      });
    });

    test.it('adding filter - (Final Opp Pass Yards: 0 to 200), shows correct stats ', function() {
      filters.changeFilterGroupDropdown('Game')
      filters.changeValuesForRangeSidebarFilter('Final Opp Pass Yards:', 0, 200);
      groupsPage.waitForTableToLoad();
      groupsPage.getTableStatFor(1,'Division').then(function(stat) {
        assert.equal(stat, 'AFC East', '1st row - Group');
      });

      groupsPage.getTableStatFor(1,'PA').then(function(stat) {
        assert.equal(stat, 297, '1st row - PA');
      });
    });

    test.it('adding filter - (Final Opp Rush Yards: 0 to 100), shows correct stats ', function() {
      filters.changeValuesForRangeSidebarFilter('Final Opp Rush Yards:', 0, 100);
      groupsPage.waitForTableToLoad();
      groupsPage.getTableStatFor(1,'Division').then(function(stat) {
        assert.equal(stat, 'NFC West', '1st row - Group');
      });

      groupsPage.getTableStatFor(1,'Yds').then(function(stat) {
        assert.equal(stat, 4588, '1st row - Yds');
      });
    });

    test.it('adding filter - (Final Opp Score: 0 to 10), shows correct stats ', function() {
      filters.changeValuesForRangeSidebarFilter('Final Opp Score:', 0, 10);
      groupsPage.waitForTableToLoad();
      groupsPage.getTableStatFor(1,'Division').then(function(stat) {
        assert.equal(stat, 'NFC West', '1st row - Group');
      });

      groupsPage.getTableStatFor(1,'TOMgn').then(function(stat) {
        assert.equal(stat, 2, '1st row - TOMgn');
      });
    });
  });

  test.describe("#groupBy", function() {
    test.it('sort by TOP', function() {
      groupsPage.clickTableHeaderFor('TOP');
    });

    test.it('selecting "By Conference" shows the correct headers', function() {
      groupsPage.changeGroupBy("By Conference");
      groupsPage.getTableHeader(1).then(function(header) {
        assert.equal(header, "Conference");
      });

      groupsPage.getTableStatFor(1,'TOP').then(function(stat) {
        assert.equal(stat, '35:23', 'Conference 1 - TOP');
      });
    });

    test.it('selecting "By Division" shows the correct headers', function() {
      groupsPage.changeGroupBy("By Division");
      groupsPage.getTableHeader(1).then(function(header) {
        assert.equal(header, "Division");
      });

      groupsPage.getTableStatFor(1,'Division').then(function(stat) {
        assert.equal(stat, 'NFC North');
      });

      groupsPage.getTableStatFor(1,'TOP').then(function(stat) {
        assert.equal(stat, '39:36', 'Division 1 - TOP');
      });
    });

    test.it('selecting "By Season" shows the correct headers', function() {
      groupsPage.changeGroupBy("By Season");
      groupsPage.getTableHeader(1).then(function(header) {
        assert.equal(header, "Year");
      });

      groupsPage.getTableStatFor(1,'Year').then(function(stat) {
        assert.equal(stat, '2016');
      });

      groupsPage.getTableStatFor(1,'TOP').then(function(stat) {
        assert.equal(stat, '34:22');
      });
    });

    test.it('selecting "By Week" shows the correct headers', function() {
      groupsPage.changeGroupBy("By Week");
      groupsPage.getTableHeader(1).then(function(header) {
        assert.equal(header, "Week");
      });          

      groupsPage.getTableStatFor(1,'Week').then(function(stat) {
        assert.equal(stat, 9);
      });

      groupsPage.getTableStatFor(1,'TOP').then(function(stat) {
        assert.equal(stat, '39:39');
      });
    });        

    test.it('selecting "By Venue" shows the correct headers', function() {
      groupsPage.changeGroupBy("By Venue");
      groupsPage.getTableHeader(1).then(function(header) {
        assert.equal(header, "Venue");
      });          

      groupsPage.getTableStatFor(1,'Venue').then(function(stat) {
        assert.equal(stat, 'Lambeau Field');
      });

      groupsPage.getTableStatFor(1,'TOP').then(function(stat) {
        assert.equal(stat, '39:36');
      });
    });        

    test.it('selecting "By Division"', function() {
      groupsPage.changeGroupBy("By Division");
    });      
  });

  test.describe("#statsView", function() {
    var statViews = [
      { type: 'Per Game', statType: 'Yds', topStat: 406 },            
      { type: 'Per Team Game', statType: 'OpYds', topStat: 189 },
      { type: 'Stats', statType: 'PM', topStat: 16 },
      
    ];
    statViews.forEach(function(statView) {
      test.it("selecting (stats view: " + statView.type + ") shows the correct stat value for PsrRt", function() {
        groupsPage.changeStatsView(statView.type);  
        groupsPage.getTableStatFor(1,statView.statType).then(function(stat) {
          assert.equal(stat, statView.topStat);
        });
      });
    });
  });

  test.describe("#reports", function() {
    var reports = [
      { type: 'Team Offense', stat: 307.3, statType: "Yd/G" },  
      { type: 'Team Defense', stat: 254.7, statType: "Yd/G" },  
      { type: 'Team Turnovers', stat: 7, statType: "TOMgn" },  
      { type: 'Team Drives', stat: 333, statType: "OpPly" },  
      { type: 'Team Drive Rates', stat: 2.6, statType: "Pts/D" },  
      { type: 'Opponent Drive Rates', stat: 0.33, statType: "Pts/D" },  
      { type: 'Team Offensive Rates', stat: 5.48, statType: "Yd/Ply" },  
      { type: 'Defensive Rates', stat: 3.62, statType: "Yd/Ply" },
      { type: 'Team Offensive Conversions', stat: '56.3%', statType: "3rdCv%" },  
      { type: 'Defensive Conversions', stat: '20.0%', statType: "3rdCv%" },  
      { type: 'Team Special Teams Summary', stat: '100.0%', statType: "FG%" },  
      { type: 'Team Penalties', stat: 9, statType: "Pen" },  
      { type: 'Offensive Plays', stat: 20, statType: "OffTD" },  
      { type: 'Defensive Plays', stat: 0, statType: "OffTD" },  
      { type: 'QB Stats', stat: '69.6%', statType: "Comp%" },  
      { type: 'Opponent QB Stats', stat: '38.5%', statType: "Comp%" },  
      { type: 'Passing Rates', stat: 102.2, statType: "PsrRt" },  
      { type: 'Opponent Passing Rates', stat: 22.9, statType: "PsrRt" },  
      { type: 'Rushing', stat: 829, statType: "RnYds" },  
      { type: 'Opponent Rushing', stat: 69, statType: "RnYds" },  
      { type: 'Receptions', stat: 1460, statType: "RecYds" },  
      { type: 'Opponent Receptions', stat: 130, statType: "RecYds" },  
      { type: 'From Scrimmage', stat: 20, statType: "ScrTD" },  
      { type: 'Rushing Receiving', stat: 2245, statType: "Yds" },  
      { type: 'Opponent Rushing Receiving', stat: 189, statType: "Yds" },  
      { type: 'Touchdowns', stat: 21, statType: "TD" },  
      { type: 'Opponent Touchdowns', stat: 1, statType: "TD" },  
      { type: 'Defensive Stats', stat: 296, statType: "DfTkl" },  
      { type: 'FG / XP / 2Pt', stat: 12, statType: "FG" },  
      { type: 'Two Point Conversions', stat: '100.0%', statType: "2PtCv%" }, 
      { type: 'Third Down Conversions', stat: 9, statType: "3rdCv" }, 
      { type: 'Red Zone Drives', stat: '70.0%', statType: "RZTD%" }, 
      { type: 'Team Differentials', stat: 147, statType: "PtsMgn" }, 
      { type: 'Kickoffs', stat: 13, statType: "KO" }, 
      { type: 'Punts', stat: 26, statType: "P" }, 
      { type: 'Returns', stat: 126, statType: "K-RYd" }, 
      { type: 'Opponent Returns', stat: 28, statType: "K-RYd" }, 
      { type: 'Team Offense Rank', stat: 307.3, statType: "Yd/G" }, 
      { type: 'Receptions (Adv)', stat: 454, statType: "Routes" }, 
      { type: 'Defensive Stats (Adv)', stat: 147, statType: "Prsrs" }, 
      { type: 'Team Record', stat: 4, statType: "W" },  
    ];    

    reports.forEach(function(report) {
      test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
        groupsPage.changeReport(report.type);  
        groupsPage.getTableStatFor(1,report.statType).then(function(stat) {
          assert.equal(stat, report.stat);
        });
      });
    });
  });
});