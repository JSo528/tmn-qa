var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../../lib/constants.js');
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl/navbar.js');
var PerformancePage = require('../../../pages/nfl/performance/performance_page.js');
var Filters = require('../../../pages/nfl/filters.js');
var performancePage, navbar, filters;

test.describe('#Page: Performance', function() {
  test.before(function() {
    performancePage = new PerformancePage(driver);
    filters = new Filters(driver);
    navbar  = new Navbar(driver);
  });

  test.it('clicking the performance link goes to the correct page', function() {
    navbar.goToPerformancePage();

    driver.getTitle().then(function(title) {
      assert.equal( title, "Practices and Games", 'Correct Title' );
    });
  });

  test.describe('#Section: Practice and Games', function() {
    test.describe("#filters", function() {
      test.it('changing filter - (Season / Week: W1 2016 to W16 2016) shows correct stats', function() {
        filters.addDropdownFilter('Season / Week');
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W16', true);
        

        performancePage.getTableStatFor(2,'Week').then(function(stat) {
          assert.equal(stat, 'W16');
        });

        performancePage.getTableStatFor(2,'Desc').then(function(stat) {
          assert.equal(stat, 'Intensity: low');
        });

        performancePage.getTableStatFor(2,'seasonContents').then(function(stat) {
          assert.equal(stat, 'Practice');
        });

        performancePage.getTableStatFor(2,'trackedDuration').then(function(stat) {
          assert.equal(stat, '1:04:10');
        });
      });

      test.it('changing filter - (season: 2016) shows correct stats', function() {
        filters.changeFilterGroupDropdown('Game');
        filters.addSelectionToDropdownSidebarFilter('Game Result:', 'Loss');

        performancePage.getTableStatFor(1,'Week').then(function(stat) {
          assert.equal(stat, 'W15');
        });

        performancePage.getTableStatFor(1,'result').then(function(stat) {
          assert.equal(stat, 'L 13 - 41');
        });

        performancePage.getTableStatFor(1,'seasonContents').then(function(stat) {
          assert.equal(stat, 'Game');
        });
      });
    });
  });

  test.describe('#Section: Performance Stats', function() {
    test.it('clicking Performance Stats link goes to correct page', function() {

      performancePage.goToSection('Performance Stats');
      performancePage.setSection('performanceStats');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /performance\-players/);
      });
    });

    test.describe("#sorting", function() {
      var columns = [
        { colName: 'DistTotal', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'RelWalkTime', sortType: 'ferpTime', defaultSort: 'desc' },
        { colName: 'RelTargetMPH', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) performancePage.clickStatsTableHeaderFor(column.colName);
          performancePage.waitForTableToLoad();
          performancePage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          performancePage.clickStatsTableHeaderFor(column.colName);
          performancePage.waitForTableToLoad();
          performancePage.getStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });

    test.describe("#filters", function() {
      test.it('changing filter - (Season/Week: 2016 W1 to 2016 W16), shows correct stats', function() {
        filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W16', true);
        performancePage.clickStatsTableHeaderFor('TimeMoving');

        performancePage.getStatsTableStatFor(1,'Player').then(function(stat) {
          assert.equal(stat, 'Quinton Patton (WR-SF)', '1st row - Player');
        });

        performancePage.getStatsTableStatFor(1,'TimeMoving').then(function(stat) {
          assert.equal(stat, '1d 09:20', '1st row - TimeMoving');
        });
      }); 

      test.it('changing filter - (Practice Intensity: High), shows correct stats', function() {
        filters.changeFilterGroupDropdown('Practice')
        filters.addSelectionToDropdownSidebarFilter('Practice Intensity:', 'High');

        performancePage.getStatsTableStatFor(1,'Player').then(function(stat) {
          assert.equal(stat, 'Blake Bell (TE-SF)', '1st row - Player');
        });

        performancePage.getStatsTableStatFor(1,'TimeMoving').then(function(stat) {
          assert.equal(stat, '11:25:11', '1st row - TimeMoving');
        });
      });  

      test.it('changing filter - (Session Duration: 1000-5000), shows correct stats', function() {
        filters.changeValuesForRangeSidebarFilter('Session Duration:', 1000, 5000);

        performancePage.getStatsTableStatFor(1,'Player').then(function(stat) {
          assert.equal(stat, 'Prince Charles Iworah (CB-SF)', '1st row - Player');
        });

        performancePage.getStatsTableStatFor(1,'TimeMoving').then(function(stat) {
          assert.equal(stat, '8:24:18', '1st row - TimeMoving');
        });
      }); 

      test.it('changing filter - (Session Name: Kickoff), shows correct stats', function() {
        filters.addSelectionToDropdownSidebarFilter('Session Name:', 'Kickoff');

        performancePage.getStatsTableStatFor(1,'Player').then(function(stat) {
          assert.equal(stat, 'JaCorey Shepherd (CB-SF)', '1st row - Player');
        });

        performancePage.getStatsTableStatFor(1,'TimeMoving').then(function(stat) {
          assert.equal(stat, '0:04:14', '1st row - TimeMoving');
        });
      });          
    });

    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the Jacoby Sheppard should add him to the pinned table', function() {
        performancePage.clickTablePin(1);

        performancePage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, 'JaCorey Shepherd (CB-SF)');
        });
      });

      test.it('selecting Rashard Robinson from search should add player to table', function() {
        performancePage.clickIsoBtn("on");
        performancePage.addToIsoTable('Rashard Robinson', 1)

        performancePage.getStatsTableStatFor(2,'Player').then(function(stat) {
          assert.equal(stat, 'Rashard Robinson (CB-SF)', '2nd row player name');
        })
      });

      test.it('pinned total should show the correct sum', function() {
        performancePage.getPinnedTotalTableStat(8).then(function(stat) {
          assert.equal(stat, 1000, 'pinned total - DistTotal');
        });
      });

      test.it('hovering over bar chart should show correct stats', function() {
        performancePage.hoverOverBarChartStack(1,'walk')
        performancePage.getBarChartTooltipText().then(function(text) {
          assert.equal(text, 'JaCorey Shepherd\nRelWalkYds: 121');
        });

        performancePage.hoverOverBarChartStack(1,'jog')
        performancePage.getBarChartTooltipText().then(function(text) {
          assert.equal(text, 'JaCorey Shepherd\nRelJogYds: 341');
        });
      });

      test.it('toggling show time instead of distance', function() {
        performancePage.toggleBarChartType('Time');
      });

      test.it('hovering over time bars should show correct stats', function() {
        performancePage.hoverOverBarChartStack(1,'walk')
        performancePage.getBarChartTooltipText().then(function(text) {
          assert.equal(text, 'JaCorey Shepherd\nRelWalkTime: 0:01:42');
        });

        performancePage.hoverOverBarChartStack(1,'jog')
        performancePage.getBarChartTooltipText().then(function(text) {
          assert.equal(text, 'JaCorey Shepherd\nRelJogTime: 0:02:24');
        });
      });      

      test.it('turning off isolation mode should show teams in iso table', function() {
        performancePage.clickIsoBtn("off");
        performancePage.getIsoTableStat(1,3).then(function(stat) {
          assert.equal(stat, 'JaCorey Shepherd (CB-SF)');
        });
      });
    });

    test.describe("#chart/edit columns", function() {
      // histograms
      test.it('clicking show histogram link should open histogram modal', function() {
        performancePage.clickChartColumnsBtn();
        performancePage.openHistogram(7); 
        performancePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('hovering over bar should show stats for teams', function() {
        performancePage.hoverOverHistogramStack(1)
        performancePage.getTooltipText().then(function(text) {
          assert.equal(text, 'Eli Harold: 0:31 (49ers-LB)\nChris Jones: 0:26 (49ers-DL)\nAntoine Bethea: 0:25 (49ers-DB)\nTony Jerod-Eddie: 0:19 (49ers-DL)\nDeForest Buckner: 0:17 (49ers-DL)\nAhmad Brooks: 0:14 (49ers-LB)\nTramaine Brock: 0:12 (49ers-DB)\nCarlos Hyde: 0:09 (49ers-RB)\nGlenn Dorsey: 0:04 (49ers-DL)\nQuinton Dial: 0:02 (49ers-DL)\n+ 2 more', 'tooltip for 1st bar');
        });
      });

      test.it('pinned teams should be represented by circles', function() {
        performancePage.getHistogramCircleCount().then(function(count) {
          assert.equal(count, 2, '# of circles on histogram')
        })
      })

      test.it("selecting 'Display pins as bars' should add team to the histogram", function() {
        performancePage.toggleHistogramDisplayPinsAsBars();
        performancePage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 14, '# of bars on histogram');
        });
      });

      test.it("changing Bin Count should update the histogram", function() {
        performancePage.changeHistogramBinCount(3);
        performancePage.getHistogramBarCount().then(function(count) {
          assert.equal(count, 6, '# of bars on histogram');
        });
      })     

      test.it('clicking close histogram button should close histogram modal', function() {
        performancePage.closeModal();
        performancePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      })                 

      // scatter plots          
      test.it('clicking add scatter plot link for 2 different categories should open up scatter chart modal', function() {
        performancePage.openScatterChart(15,16);

        performancePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, true);
        }); 
      });

      test.it('clicking close button should close scatter chart modal', function() {
        performancePage.closeModal();
        performancePage.isModalDisplayed().then(function(isDisplayed) {
          assert.equal(isDisplayed, false);
        }); 
      });

      test.it('clearing pins', function() {
        performancePage.clearTablePins();
      });   
    });

    test.describe("#groupBy", function() {
      test.it('selecting "By Season" shows the correct headers', function() {
        performancePage.changeGroupBy("By Season");
        performancePage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Season");
        });

        performancePage.getStatsTableStatFor(1,'DistTotal').then(function(stat) {
          assert.equal(stat, 512, 'Team 1 - DistTotal');
        });
      });

      test.it('selecting "By Game/Practice" shows the correct headers', function() {
        performancePage.changeGroupBy("By Game/Practice");
        performancePage.getStatsTableHeader(4).then(function(header) {
          assert.equal(header, "Desc");
        });          

        performancePage.getStatsTableStatFor(1,'Desc').then(function(stat) {
          assert.equal(stat, 'Intensity: high', 'Row 1 - Desc');
        });
      });        

      test.it('selecting "By Game Result" shows the correct headers', function() {
        performancePage.changeGroupBy("By Session");
        performancePage.getStatsTableHeader(5).then(function(header) {
          assert.equal(header, "Drill Name");
        });    

        performancePage.getStatsTableStatFor(1,'Drill Name').then(function(stat) {
          assert.equal(stat, 'Kickoff', 'Row 1 - Drill Name');
        });                
      });  

      test.it('selecting "Total"', function() {
        performancePage.changeGroupBy("Totals");
      });      
    });

    test.describe("#statsView", function() {
      var statViews = [
        { type: 'Rank', topStat: 1 },            
        { type: 'Percentile', topStat: "100.0%" },
        { type: 'Z-Score', topStat: 1.676 },
        { type: 'Stat (Rank)', topStat: "512 (1)" },
        { type: 'Stat (Percentile)', topStat: "512 (100%)" },
        { type: 'Stat (Z-Score)', topStat: "512 (1.68)" },
        { type: 'Per Game', topStat: 512 },
        { type: 'Stats', topStat: 512 }
      ];
      
      test.it('sorting by yds desc', function() {
        performancePage.clickStatsTableHeaderFor('DistTotal');  
      })

      statViews.forEach(function(statView) {
        test.it("selecting (stats view: " + statView.type + ") shows the correct stat value", function() {
          performancePage.changeStatsView(statView.type);  
          performancePage.getStatsTableStatFor(1,'DistTotal').then(function(stat) {
            assert.equal(stat, statView.topStat);
          });
        });
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Zebra Team Summary', topStat: 512, statType: "DistTotal" },  
        { type: 'Zebra Relative Summary', topStat: 512, statType: "DistTotal" },  
        { type: 'Rates and Peaks', topStat: 9.3, statType: "MaxStndYPS" },  
        { type: 'Accel/Decel/CoD', topStat: 8, statType: "TotalAccels" },  
        { type: 'Dist/Time/Sprints By Team Zone', topStat: 512, statType: "DistTotal" },   
        { type: 'Dist/Time/Sprints By Player Relative Zone', topStat: 512, statType: "DistTotal" },   
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          performancePage.changeReport(report.type);  
          performancePage.getStatsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Live Practice Dashboard', function() {
    test.it('clicking Live Practice Dashboard link goes to correct page', function() {
      performancePage.goToSection('Live Practice Dashboard');
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /performance\-dashboard/);
      });
    });

    test.describe('#positions', function() {
      test.it('changing positions to QB updates the list correctly', function() {
        performancePage.changeDashboardDropdown('Positions', 'QB');
        performancePage.getDashboardPlayerPositions().then(function(positions){
          assert.deepEqual(positions, ['QB']);
        });
      });

      test.it('changing positions to Special Teams updates the list correctly', function() {
        performancePage.changeDashboardDropdown('Positions', 'Special teams');
        performancePage.getDashboardPlayerPositions().then(function(positions){
          assert.includeMembers(['P', 'K', 'SPEC'], positions);
        });
      });

      test.it('changing positions to RB updates the list correctly', function() {
        performancePage.changeDashboardDropdown('Positions', 'RB');
        performancePage.getDashboardPlayerPositions().then(function(positions){
          assert.deepEqual(positions, ['RB']);
        });
      });
    });

    test.describe('#metricsMode', function() {
      test.it('changing mode to Position updates the view correctly', function() {
        var initialWidth;
        return performancePage.getDashboardBarWidth(1, 'walking').then(function(width) {
          initialWidth = width;
        }).then(function() {
          return performancePage.changeDashboardDropdown('Metrics mode', 'Position');
        }).then(function() {
          return performancePage.getDashboardBarWidth(1, 'walking').then(function(width) {
            assert.notEqual(width, initialWidth);
          });
        })
        
      });
    });

    test.describe('#speedZones', function() {
      test.it('changing zone to all but walking hides walking bar', function() {
        performancePage.changeDashboardDropdown('Speed zones', 'All but walking');
        performancePage.dashboardBarExists(1, 'walking').then(function(exists) {
          assert.equal(exists, false);
        });

        performancePage.dashboardBarExists(1, 'jogging').then(function(exists) {
          assert.equal(exists, true);
        });
      });      

      test.it('changing zone to all but walking hides jogging bar', function() {
        performancePage.changeDashboardDropdown('Speed zones', 'Running only');
        performancePage.dashboardBarExists(1, 'jogging').then(function(exists) {
          assert.equal(exists, false);
        });

        performancePage.dashboardBarExists(1, 'lightRunning').then(function(exists) {
          assert.equal(exists, true);
        });
      });      

      test.it('changing zone to top running zone hides all but highSpeed bar', function() {
        performancePage.changeDashboardDropdown('Speed zones', 'Top running zone');
        performancePage.dashboardBarExists(1, 'mediumSpeed').then(function(exists) {
          assert.equal(exists, false);
        });

        performancePage.dashboardBarExists(1, 'highSpeed').then(function(exists) {
          assert.equal(exists, true);
        });
      });      
    });

    test.describe('#compareTo', function() {
      test.it('only last 4 weeks of practices appear on bar chart initally', function() {
        var dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate()-28);

        performancePage.getEarliestDashboardBarDate(1).then(function(date) {
          assert.isAtLeast(date, dateThreshold);
        });
      });

      test.it('changing time period to 2 weeks updates the view correctly', function() {
        performancePage.changeDashboardDropdown('Compare to', 'Last 2 weeks');
        var dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate()-14);

        performancePage.getEarliestDashboardBarDate(1).then(function(date) {
          assert.isAtLeast(date, dateThreshold);
        });
      });

      test.it('changing time period to 7 days updates the view correctly', function() {
        performancePage.changeDashboardDropdown('Compare to', 'Last 7 days');
        var dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate()-7);

        performancePage.getEarliestDashboardBarDate(1).then(function(date) {
          assert.isAtLeast(date, dateThreshold);
        });
      });
    });
  });

  test.describe('#Section: Ind Practice Performance Stats', function() {
    test.it("clicking individual practice link goes to correct page", function() {
      performancePage.goToSection('Practices and Games');
      filters.addDropdownFilter('Season / Week');
      filters.changeValuesForSeasonWeekDropdownFilter(2016, 'W1', 2016, 'W16', true);
      performancePage.clickTableStatFor(2,'result');
      performancePage.setSection('practice');

      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /football\/practice/);
      });
    });

    test.it("practice date and intensity are listed in the title", function() {
      performancePage.getPracticeStatsDateTitle().then(function(stat) {
        assert.equal(stat, '16 FRIDAY (12/23/2016)');
      });

      performancePage.getPracticeStatsIntensityTitle().then(function(stat) {
        assert.equal(stat, 'Low Intensity');
      });
    });

    test.describe("#sorting", function() {
      var columns = [
        { colName: 'DistTotal', sortType: 'ferpNumber', defaultSort: 'desc', initialCol: true },
        { colName: 'RelJogTime', sortType: 'ferpTime', defaultSort: 'desc' },
        { colName: 'RelHardEffortDist', sortType: 'ferpNumber', defaultSort: 'desc' },
      ]

      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          if (!column.initialCol) performancePage.clickPracticeStatsTableHeaderFor(column.colName);
          performancePage.waitForTableToLoad();
          performancePage.getPracticeStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
            assert.deepEqual(stats, sortedArray);
          })
        });

        test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
          performancePage.clickPracticeStatsTableHeaderFor(column.colName);
          performancePage.waitForTableToLoad();
          performancePage.getPracticeStatsTableStatsFor(column.colName).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType);
            var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
            var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
            assert.deepEqual(stats, sortedArray);
          })
        });
      });  
    });  

    test.describe("#pinning/isoMode", function() {
      test.it('clicking the pin icon for the Garrett Celek should add him to the pinned table', function() {
        performancePage.clickTablePin(2);

        performancePage.getIsoTableStat(1,2).then(function(stat) {
          assert.equal(stat, 'Garrett Celek (TE-SF)');
        });
      });

      test.it('session data should show in the session table', function() {
        performancePage.toggleShowPinnedPlayerSessions();
        performancePage.getPracticeSessionTableStatFor(1,'drillName').then(function(stat) {
          assert.equal(stat, 'Team');
        });

        performancePage.getPracticeSessionTableStatFor(2,'TimeMoving').then(function(stat) {
          assert.equal(stat, '0:09:06');
        });

        performancePage.getPracticeSessionTableStatFor(3,'DistTotal').then(function(stat) {
          assert.equal(stat, 320);
        });
      });
    });

    test.describe("#reports", function() {
      var reports = [
        { type: 'Zebra Team Summary', topStat: 2490, statType: "DistTotal" },  
        { type: 'Zebra Relative Summary', topStat: 2490, statType: "DistTotal" },  
        { type: 'Rates and Peaks', topStat: 7.3, statType: "MaxStndYPS" },  
        { type: 'Accel/Decel/CoD', topStat: 41, statType: "TotalAccels" },  
        { type: 'Dist/Time/Sprints By Team Zone', topStat: 2490, statType: "DistTotal" },   
        { type: 'Dist/Time/Sprints By Player Relative Zone', topStat: 2490, statType: "DistTotal" },   
      ];

      reports.forEach(function(report) {
        test.it("selecting (report: " + report.type + ") shows the correct stat value for " + report.statType, function() {
          performancePage.changeReport(report.type);  
          performancePage.getPracticeStatsTableStatFor(1,report.statType).then(function(stat) {
            assert.equal(stat, report.topStat);
          });
        });
      });
    });
  });

  test.describe('#Section: Ind Practice Report', function() {
     test.it("clicking report link goes to correct page", function() {
      performancePage.goToSection('Report');
      
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /performance\-report/);
      });
    });

    test.describe('#sections', function() {
      test.it('all sections initially show', function() {
        performancePage.reportSectionDisplayed('team').then(function(displayed) {
          assert.equal(displayed, true);
        });

        performancePage.reportSectionDisplayed('positions').then(function(displayed) {
          assert.equal(displayed, true);
        });

        performancePage.reportSectionDisplayed('players').then(function(displayed) {
          assert.equal(displayed, true);
        });
      });

      test.it('removing team section hides team table', function() {
        performancePage.changeReportDropdown('Sections', 'Team');
        performancePage.reportSectionDisplayed('team').then(function(displayed) {
          assert.equal(displayed, false);
        });
      });
    }); 

    test.describe('#positions', function() {
      test.it('removing QB from positions section hides QB table', function() {
        performancePage.changeReportDropdown('Positions', 'QB');
        performancePage.reportPositionDisplayed('QB').then(function(displayed) {
          assert.equal(displayed, false);
        });

        performancePage.reportPositionDisplayed('RB').then(function(displayed) {
          assert.equal(displayed, true);
        });
      });    
    }); 

    test.describe('#players', function() {
      test.it('removing #1 Nick Rose from players hides him from table', function() {
        performancePage.changeReportPlayersDropdown('Players', '#63 Norman Price');
        performancePage.reportPlayerDisplayed('Norman Price').then(function(displayed) {
          assert.equal(displayed, false);
        });

        performancePage.reportPlayerDisplayed('Garrett Celek').then(function(displayed) {
          assert.equal(displayed, true);
        });
      });
    }); 

    test.describe('#compareTo', function() {
      test.it('changing compareTo prior 14 days of practice updates data', function() {
        performancePage.changeReportDropdown('Compare to', 'Prior 14 days practices');
        
        performancePage.getReportPlayerStat('Garrett Celek', 'Total distance').then(function(stat) {
          assert.equal(stat, 2489.8);
        });

        performancePage.getReportPlayerStatChange('Garrett Celek', 'Total distance').then(function(stat) {
          assert.equal(stat, '-25.9%');
        });
      });    
    }); 
  });
});