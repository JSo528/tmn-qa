var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var PlayersPage = require('../../../pages/nfl_scouting/players/players_page.js');
var navbar, playersPage, filters;

// Tests
test.describe('#Page: Players', function() {
  test.before(function() {
    playersPage = new PlayersPage(driver);
    navbar = new Navbar(driver);
    filters = new Filters(driver);
  });

  test.it('navigate to players page', function() {
    navbar.goToPlayersPage();
    playersPage.waitForPageToLoad();
  });

  test.describe('#table', function() {
    test.describe('#sorting', function() {
      var columns = [
        { colNum: 2, colName: 'Jersey', sortType: 'number' },
        { colNum: 4, colName: 'First Name', sortType: 'stringInsensitive' },
        { colNum: 5, colName: 'Pos', placeholder: 'Select value' },
        { colNum: 6, colName: 'Team Code' },
        { colNum: 7, colName: 'Height', sortType: 'number' },
        { colNum: 8, colName: 'Weight', sortType: 'number' },
        { colNum: 9, colName: 'Speed', sortType: 'number' },
        { colNum: 10, colName: 'Agent', sortType: 'string' }
      ];

      test.it('adding filter for tier A', function() {
        playersPage.addPlayersFilter('For Tier');
        filters.setDropdownFilter('For Tier', ['A']);
      });

      test.it('players list should be sorted alphabetically by last name asc initially', function() {
        playersPage.getPlayersTableStatsForCol(3).then(function(stats) {
          stats = extensions.normalizeArray(stats, 'stringInsensitive');
          var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to last name header should reverse the sort', function() {
        playersPage.clickSortIcon(3);

        playersPage.getPlayersTableStatsForCol(3).then(function(stats) {
          stats = extensions.normalizeArray(stats, 'stringInsensitive');
          var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      var lastColNum = 3;
      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickPlayersRemoveSortIcon(lastColNum);
          lastColNum = column.colNum;
          playersPage.clickPlayersTableHeader(column.colNum);

          playersPage.getPlayersTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
          playersPage.clickPlayersSortIcon(column.colNum);

          playersPage.getPlayersTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });
      });
    });    
   
    test.describe('#updatingFields', function() {
      var attributes = [
        { field: 'Jersey', col: 2, type: 'input', updatedValue: 10 },
        { field: 'Pos', col: 5, type: 'dropdown', updatedValue: 'RB', placeholder: 'Select value' },
        { field: 'Height', col: 7, type: 'input', updatedValue: '6020i' },
        { field: 'Weight', col: 8, type: 'input', updatedValue: '220e' },
        { field: 'Speed', col: 9, type: 'input', updatedValue: '5.20e' }
      ];

      test.it('get original values', function() {
        browser.refresh();
        playersPage.waitForPageToLoad();
        attributes.forEach(function(attr, idx) {
          playersPage.getPlayersTableStat(2,attr.col, attr.placeholder).then(function(stat) {
            attributes[idx].originalValue = stat;
          });
        });
      });

      test.it('updating fields', function() {
        attributes.forEach(function(attr) {
          playersPage.changePlayersTableStatField(attr.type, 2, attr.col, attr.updatedValue );
        });
        browser.refresh();
        playersPage.waitForPageToLoad();
      });

      attributes.forEach(function(attr) {
        test.it('updating ' + attr.field + ' should persist on reload', function() {
          playersPage.getPlayersTableStat(2, attr.col, attr.placeholder).then(function(value) {
            assert.equal(value, attr.updatedValue, attr.field);
          });
        });
      });

      test.it('reverting fields', function() {
        attributes.forEach(function(attr) {
          playersPage.changePlayersTableStatField(attr.type, 2, attr.col, attr.originalValue );
        });
      });
    });

    test.describe('#controls', function() {
      test.it('changing # rows to 25 updates the table accordingly', function() {
        playersPage.changePlayersNumberOfRows(25);
        playersPage.getPlayersTableRowCount().then(function(stat) {
          assert.equal(stat, 25);
        });
      });

      test.it('pressing next button updates the table accordingly', function() {
        playersPage.getPlayersTableStat(25,3).then(function(stat) {
          lastPlayerFirstPage = stat;
        });

        playersPage.clickPlayersNextButton();
        playersPage.getPlayersTableStat(1,3).then(function(stat) {
          firstPlayerSecondPage = stat;
          assert.isAtLeast(firstPlayerSecondPage.toLowerCase(), lastPlayerFirstPage.toLowerCase(), 'last name of 1st row player on 2nd page > last name of 25th row player on 1st page');
        });
      });

      test.it('pressing previous button updates the table accordingly', function() {
        playersPage.clickPlayersPreviousButton();
        playersPage.getPlayersTableStat(25,3).then(function(stat) {
          assert.equal(stat, lastPlayerFirstPage, 'last name of bottom row player');
        });
      });
    });
  });

  test.describe('#filters', function() {
    var dropdownFilters = [
      { name: 'At Positions', values: ['QB'], columnName: 'Pos' },
      { name: 'For Draft Years', values: ['2018', '2019'], columnName: 'Draft Year' },
      { name: 'For Tier', values: ['A'], columnName: 'Tier' },
      { name: 'Draft Position', values: ['LEO'], columnName: 'Draft Position' },
      { name: 'Bowl Game', values: ['SR'], columnName: 'Bowl Game' },
      { name: 'Feb. Grade', values: ['7.5'], columnName: 'Feb. Grade', parsedValues: ['7.5'] },
      { name: 'Dec. Grade', values: ['8.0'], columnName: 'Dec. Grade', parsedValues: ['8.0'] },
      { name: 'Final. Grade', values: ['2.2'], columnName: 'Final. Grade', parsedValues: ['2.2'] },
    ];

    var checkboxFilters = [
      { name: 'Underclassman', value: false, columnName: 'Underclassman', displayValue: '' },
      { name: 'Jag Head', value: true, columnName: 'Jag Head' },
      { name: 'Skull/Crossbones', value: false, columnName: 'Skull/Crossbones', displayValue: '' },
      { name: 'T', value: true, columnName: 'T' },
      { name: 'SR', value: false, columnName: 'SR', displayValue: '' },
      { name: 'NIC', value: true, columnName: 'NIC' },
      { name: 'Red Dot', value: false, columnName: 'Red Dot', displayValue: '' },
      { name: 'Blk', value: true, columnName: 'Blk' },
      { name: 'Blk+', value: false, columnName: 'Blk+', displayValue: '' },
    ];

    var rangeFilters = [
      { name: 'Height', minValue: '6000', maxValue: '7000', columnName: 'Height' },
      { name: 'Weight', minValue: '200', maxValue: '250', columnName: 'Weight' },
      { name: 'Speed', minValue: '4.00', maxValue: '5.00', columnName: 'Speed' }
    ];

    var resourceSetFilters = [
      { name: 'On Teams', values: ['CALA', 'MSSO'], columnName: 'Team Code' }
    ];
    
    dropdownFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.togglePlayersColumn(filter.columnName, true);

        playersPage.addPlayersFilter(filter.name);
        filters.setDropdownFilter(filter.name, filter.values);
        playersPage.waitForPageToLoad();
        playersPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          var values = filter.parsedValues || filter.values;
          assert.sameMembers(values, uniqueStats);
        });
      });
    });

    checkboxFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.value}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.togglePlayersColumn(filter.columnName, true);

        playersPage.addPlayersFilter(filter.name);
        filters.changeCheckboxFilter(filter.name, filter.value);
        playersPage.waitForPageToLoad();

        playersPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          var value = filter.displayValue === undefined ? filter.value.toString() : filter.displayValue;
          assert.sameMembers([value], uniqueStats);
        });
      });
    });

    rangeFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.minValue} - ${filter.maxValue}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.togglePlayersColumn(filter.columnName, true);

        playersPage.addPlayersFilter(filter.name);
        filters.changeRangeFilter(filter.name, filter.minValue, filter.maxValue);
        playersPage.waitForPageToLoad();

        playersPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));

          uniqueStats.forEach(function(stat) {
            assert.isAtLeast(parseFloat(stat), filter.minValue);
            assert.isAtMost(parseFloat(stat), filter.maxValue);
          });
        });
      });
    });

    resourceSetFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.togglePlayersColumn(filter.columnName, true);

        playersPage.addPlayersFilter(filter.name);
        filters.setResourceSetFilter(filter.name, filter.values);
        playersPage.waitForPageToLoad();

        playersPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(filter.values, uniqueStats);
        });
      });      
    });

    test.it('adding filter: On Player Lists (TEST)', function() {
      browser.refresh();
      playersPage.addPlayersFilter('On Player Lists');
      filters.setResourceSetFilter('On Player Lists', ['TEST']);

      playersPage.waitForPageToLoad();

      playersPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['VICKERS', 'VULCANO'], stats);
      });
    });

    test.it('adding filter: Alerts (a)', function() {
      browser.refresh();
      playersPage.addPlayersFilter('Alerts');
      filters.setDropdownFilter('Alerts', ['u']);

      playersPage.waitForPageToLoad();

      playersPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['EVANS', 'VICKERS'], stats);
      });
    });


    test.it('adding filter: Is Deleted', function() {
      browser.refresh();
      playersPage.addPlayersFilter('Is Deleted');
      filters.changeCheckboxFilter('Is Deleted', true);

      playersPage.waitForPageToLoad();

      playersPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
        assert.includeMembers(stats, ['Young']);
      });
    });

    test.it('adding filter: Jersey', function() {
      browser.refresh();
      playersPage.addPlayersFilter('Jersey');
      // TODO - no way to set jersey == 33

      playersPage.waitForPageToLoad();
      playersPage.getPlayersTableStatsFor('Jersey').then(function(stats) {
        var uniqueStats = Array.from(new Set(stats));
        assert.sameMembers(['33'], uniqueStats);
      });
    })

    test.describe('#compoundFilterTest', function() {
      test.it('filters: Is Starter: true (AND),  For Class Years: FR (AND), At Positions: K  (AND)', function() {
        this.timeout(120000);
        browser.refresh();
        playersPage.togglePlayersColumn('Starter', true);
        playersPage.addPlayersFilter('Is Starter');
        filters.changeCheckboxFilter('Is Starter', true);

        playersPage.addPlayersFilter('For Class Years');
        filters.setDropdownFilter('For Class Years', ['FR']);

        playersPage.addPlayersFilter('At Positions');
        filters.setDropdownFilter('At Positions', ['PK']);

        playersPage.waitForPageToLoad();

        playersPage.getPlayersTableStatsFor('Starter').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['check_box'], uniqueStats);
        });

        playersPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
          assert.includeMembers(stats, ['Aguayo', 'Blankenship']);
        });
      });
      
      test.it('filters: Is Starter (OR), For Tier (OR)', function() {
        filters.removeFilter('For Class Years');
        playersPage.togglePlayersColumn('Tier', true);

        filters.changeFilterLogic('Is Starter', 'or');
        playersPage.addPlayersFilter('For Tier');
        filters.setDropdownFilter('For Tier', ['D']);
        filters.changeFilterLogic('For Tier', 'or');
        
        playersPage.waitForPageToLoad();

        playersPage.getPlayersTableStatsFor('Starter').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['check_box', 'check_box_outline_blank'], uniqueStats);
        });

        playersPage.getPlayersTableStatsFor('Tier').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['A', 'B', 'C', 'D', '?'], uniqueStats);
        });
      });
    });
  });

  // test.describe('#exportCsv', function() {
  //   test.it('clicking export csv exports csv file', function() {
  //     browser.refresh();
  //     playersPage.addPlayersFilter('On Player Lists');
  //     filters.setResourceSetFilter('On Player Lists', ['GI']);
      
  //     playersPage.addPlayersFilter('At Positions');
  //     filters.setDropdownFilter('At Positions', ['QB']);

  //     playersPage.waitForPageToLoad();
  //     playersPage.clickExportButton();
  //   });

  //   test.it('csv file should have the correct data', function() {
  //     var exportFileContents = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent,Day Phone/n10,APODACA,AUSTIN,QB,NMUN,6030,212,5.10e,,/n15,BAILEY,AARON,QB,IANO,6005v,230v,4.55e,,/n2,CONQUE,ZACHARY,QB,TXSF,6050v,235v,4.90e,,/n,EASTON,DALTON,QB,RIBT,6000,192,5.00e,,/n9,EVANS,DANE,QB,OKTU,6010,210,5.00e,,/n,FERGUSON,TYLER,QB,KYWE,6040,225,4.95e,,/n13,HOUSTON,BARTLETT,QB,WIUN,6031v,234v,4.95e,,/n7,JENKINS,ELIJAH,QB,ALJA,6007v,206v,4.85e,,/n19,NELSON,JACK,QB,MNWI,6036v,236v,4.87v,,/n14,NORVELL,TRENTON,QB,ILWE,6050,225,4.95e,,/n7,O\'CONNOR,TYLER,QB,MIST,6010e,220e,4.95e,,/n,SPOONER,QADR,QB,CNMG,6000,192,5.00e,,/n18,SWOOPES,TYRONE,QB,TXUN,6034e,230e,4.80e,,/n,WINDHAM,GREG,QB,OHUN,6010,215,5.00e,,/n';
  //     return playersPage.readAndDeleteExportCSV().then(function(data) {
  //       assert.equal(data, exportFileContents);
  //     });
  //   });
  // });
});