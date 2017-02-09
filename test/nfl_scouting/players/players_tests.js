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
      test.it('table should be sorted alphabetically by last name asc initially', function() {
        playersPage.getTableStats(3).then(function(lastNames) {
          var sortedArray = extensions.customSort(lastNames, 'asc');
          assert.deepEqual(lastNames, sortedArray);
        });
      });

      test.it('reversing the sort should sort the table by last name desc', function() {
        playersPage.clickTableHeader(3);
        playersPage.getTableStats(3).then(function(lastNames) {
          var sortedArray = extensions.customSort(lastNames, 'desc');
          assert.deepEqual(lastNames, sortedArray);
        });
      });

      test.it('selecting jersey sort should sort list by jersey asc', function() {
        playersPage.clickRemoveSortIcon(3);
        playersPage.clickTableHeader(2);
        playersPage.getTableStats(2).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });  

      test.it('reversing the sort should sort list by jersey desc', function() {
        playersPage.clickTableHeader(2);
        playersPage.getTableStats(2).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });  

      test.it('selecting height sort should sort list by height asc', function() {
        playersPage.clickRemoveSortIcon(2);
        playersPage.clickTableHeader(7);
        playersPage.getTableStats(7).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });  

      test.it('reversing the sort should sort list by height desc', function() {
        playersPage.clickTableHeader(7);
        playersPage.getTableStats(7).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });  

      test.it('selecting speed sort should sort list by speed asc', function() {
        playersPage.clickRemoveSortIcon(7);
        playersPage.clickTableHeader(9);
        playersPage.getTableStats(9).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });  

      test.it('reversing the sort should sort list by speed desc', function() {
        playersPage.clickTableHeader(9);
        playersPage.getTableStats(9).then(function(stats) {
          var sortedArray = extensions.customSort(stats, 'desc');
          assert.deepEqual(stats, sortedArray);
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
        playersPage.clickTableHeader(4)
        attributes.forEach(function(attr, idx) {
          playersPage.getTableStat(2,attr.col, attr.placeholder).then(function(stat) {
            attributes[idx].originalValue = stat;
          });
        });
      });

      test.it('updating fields', function() {
        attributes.forEach(function(attr) {
          playersPage.changeTableStatField(attr.type, 2, attr.col, attr.updatedValue );
        });
        browser.refresh();
        playersPage.waitForPageToLoad();
        playersPage.clickTableHeader(4)
      });

      attributes.forEach(function(attr) {
        test.it('updating ' + attr.field + ' should persist on reload', function() {
          playersPage.getTableStat(2, attr.col, attr.placeholder).then(function(value) {
            assert.equal(value, attr.updatedValue, attr.field);
          });
        });
      });

      test.it('reverting fields', function() {
        attributes.forEach(function(attr) {
          playersPage.changeTableStatField(attr.type, 2, attr.col, attr.originalValue );
        });
      });
    });

    test.describe('#controls', function() {
      test.it('changing # rows to 25 updates the table accordingly', function() {
        playersPage.changeNumberOfRows(25);
        playersPage.getTableRowCount().then(function(stat) {
          assert.equal(stat, 25);
        });
      });

      test.it('pressing next button updates the table accordingly', function() {
        playersPage.getTableStat(25,3).then(function(stat) {
          lastPlayerFirstPage = stat;
        });

        playersPage.clickNextButton();
        playersPage.getTableStat(1,3).then(function(stat) {
          firstPlayerSecondPage = stat;
          assert.isAtLeast(firstPlayerSecondPage, lastPlayerFirstPage, 'last name of 1st row player on 2nd page > last name of 25th row player on 1st page');
        });
      });

      test.it('pressing previous button updates the table accordingly', function() {
        playersPage.clickPreviousButton();
        playersPage.getTableStat(25,3).then(function(stat) {
          assert.equal(stat, lastPlayerFirstPage, 'last name of bottom row player');
        });
      });
    });
  });

  test.describe('#filters', function() {
    var dropdownFilters = [
      { name: 'At Positions', values: ['QB'], columnName: 'Pos' },
      { name: 'For Draft Years', values: ['2018', '2020'], columnName: 'Draft Year' },
      { name: 'For Tier', values: ['A'], columnName: 'Tier' },
      { name: 'Draft Position', values: ['LEO'], columnName: 'Draft Position' },
      { name: 'Bowl Game', values: ['EW'], columnName: 'Bowl Game' },
      { name: 'Feb. Grade', values: ['8.0'], columnName: 'Feb. Grade' },
      { name: 'Dec. Grade', values: ['7.0'], columnName: 'Dec. Grade' },
      { name: 'Final. Grade', values: ['7.5'], columnName: 'Final. Grade' },
    ];

    var checkboxFilters = [
      { name: 'Underclassman', value: false, columnName: 'Underclassman' },
      { name: 'Jag Head', value: true, columnName: 'Jag Head' },
      { name: 'Skull/Crossbones', value: false, columnName: 'Skull/Crossbones' },
      { name: 'T', value: true, columnName: 'T' },
      { name: 'SR', value: false, columnName: 'SR' },
      { name: 'NIC', value: true, columnName: 'NIC' },
      { name: 'Red Dot', value: false, columnName: 'Red Dot' },
      { name: 'Blk', value: true, columnName: 'Blk' },
      { name: 'Blk+', value: false, columnName: 'Blk+' },
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
        playersPage.toggleColumn(filter.columnName, true);

        playersPage.addFilter(filter.name);
        filters.setDropdownFilter(filter.name, filter.values);
        playersPage.waitForPageToLoad();
        playersPage.getTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));

          assert.sameMembers(filter.values, uniqueStats);
        });
      });
    });

    checkboxFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.value}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.toggleColumn(filter.columnName, true);

        playersPage.addFilter(filter.name);
        filters.changeCheckboxFilter(filter.name, filter.value);
        playersPage.waitForPageToLoad();

        playersPage.getTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));

          assert.sameMembers([filter.value.toString()], uniqueStats);
        });
      });
    });

    rangeFilters.forEach(function(filter) {
      test.it(`adding filter: ${filter.name} (${filter.minValue} - ${filter.maxValue}) updates the table accordingly`, function() {
        browser.refresh();
        playersPage.toggleColumn(filter.columnName, true);

        playersPage.addFilter(filter.name);
        filters.changeRangeFilter(filter.name, filter.minValue, filter.maxValue);
        playersPage.waitForPageToLoad();

        playersPage.getTableStatsFor(filter.columnName).then(function(stats) {
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
        playersPage.toggleColumn(filter.columnName, true);

        playersPage.addFilter(filter.name);
        filters.setResourceSetFilter(filter.name, filter.values);
        playersPage.waitForPageToLoad();

        playersPage.getTableStatsFor(filter.columnName).then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(filter.values, uniqueStats);
        });
      });      
    });

    test.it('adding filter: On Player Lists (NFLPA)', function() {
      browser.refresh();
      playersPage.addFilter('On Player Lists');
      filters.setResourceSetFilter('On Player Lists', ['NFLPA']);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['ADAMS', 'ANDERSON'], stats);
      });
    });

    test.it('adding filter: Alerts (a)', function() {
      browser.refresh();
      playersPage.addFilter('Alerts');
      filters.setDropdownFilter('Alerts', ['a']);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['Barnes', 'ANDERSON'], stats);
      });
    });


    test.it('adding filter: Is Deleted', function() {
      browser.refresh();
      playersPage.addFilter('Is Deleted');
      filters.changeCheckboxFilter('Is Deleted', true);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.includeMembers(stats, ['Barton', 'Borrayo']);
      });
    });

    test.describe('#compoundFilterTest', function() {
      test.it('adding filter: Is Starter', function() {
        browser.refresh();
        playersPage.toggleColumn('Starter', true);
        playersPage.addFilter('Is Starter');
        filters.changeCheckboxFilter('Is Starter', true);

        playersPage.waitForPageToLoad();

        playersPage.getTableStatsFor('Starter').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['check_box'], uniqueStats);
        });
      });

      test.it('adding filter: For Class Years', function() {
        playersPage.addFilter('For Class Years');
        filters.setDropdownFilter('For Class Years', ['SO']);
        playersPage.waitForPageToLoad();

        playersPage.getTableStatsFor('Last Name').then(function(stats) {
          assert.includeMembers(stats, ['Adams', 'Butler']);
        });
      });

      test.it('adding filter: Jersey', function() {
        playersPage.addFilter('Jersey');
        // TODO - no way to set jersey == 33

        playersPage.waitForPageToLoad();
        playersPage.getTableStatsFor('Jersey').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['33'], uniqueStats);
        });
      });
    });
  });

  test.describe('#exportCsv', function() {
    test.it('clicking export csv exports csv file', function() {
      browser.refresh();
      playersPage.waitForPageToLoad();
      playersPage.clickExportButton();
    });

    test.it('csv file should have the correct data', function() {
      var exportFileContents = ',,,qb,HIUN,,,/n,Aaron,Jarell,wr,MSSO,6050,203,/n,Aaron,Montel,qb,CASJ,6052i,201,/n,Aaron,Austin,wr,CAUN,6040,210,/n56,AARON,DMITRE,dt,OHAS,6024e,400e,5.20e/n65,AARON,EVAN,ot,SDNO,6050e,290e,5.30e/n23,AARON,DWAYNE,oh,OHMT,5070e,185e,4.60e/n12,AARON,JARELL,wo,MSSO,6040e,195e,4.60e/n82,AASEN,GRANT,pt,GATC,6000e,200e,5.15e/n1,ABAD,MANUEL,dc,FLTC,5112v,182v,4.49v/n32,Abanikanda,Michael,rb,NYBU,5080,185,/n34,ABARE,GREG,te,NYRE,6030e,215e,5.10e/n96,ABBAS,BRANDON,pk,IACO,6010e,215e,5.05e/n,Abbington,Chase,rb,MOSE,6020,215,/n39,Abbington,Chase,rb,MOUN,6020,215,/n,Abbott,Aaron,db,MIEA,6010,206,/n,Abbott,Marcus,de,TXLA,6030,271,/n,Abbott,Britton,qb,OKST,6020,246,/n,Abbott,Cody,ol,IDST,6030,276,/n47,Abbott,Blake,fb,OKTU,5110,227,/n69,ABBOTT,CODY,og,IDST,6020e,270e,5.40e/n,Abby,Jerimiah,ol,LASO,6040,328,/n3,ABDELMOTY,SAMER,fs,PACA,5110e,180e,4.80e/n45,Abdesmad,Mehdi,dl,MABC,6070,286,/n29,Abdul-Akbar,Tariq,db,VARI,5090,158,/n,Abdul-Aziz,Jamil,ol,LAST,6020,270,/n,Abdul-Aziz,Jibrail,ol,LAST,6020,289,/n,Abdullah,Naji,de,VAUN,6050,235,/n,Abdullah,Khalid,rb,VAJM,5100,220,/n32,ABDULLAH,KHALID,oh,VAJM,5096v,214v,4.80v/n44,ABDUL-RAZZAY,AKHMAD,de,KSWA,6017v,237v,4.85e/n7,Abdul-Saboor,Mikal,rb,VAWM,5100,210,/n46,Abdur-Rahman,Jihad,dl,DEST,6040,270,/n4,ABDUR-RAHMAN,SHAWAHL,oh,NYIT,5030e,160e,5.00e/n34,Abdur-Ra\'oof,Talib,db,NJRU,6000,205,/n,Abee,David,rb,ALSM,6020,176,/n,Abel,Hunter,dt,CAUN,6010,265,/n,Abelite,Alexander,lb,CTYA,6020,220,/n,Abell,Porter,wr,VARI,6010,190,/n,Abeln,Alec,ol,MOUN,6030,305,/n57,Abeln,Alec,ol,MOUN,6030,290,/n71,Abera,Nehemia,dl,CALA,6020,230,/n,Abercrombie,Christion,lb,ILUN,6010,220,/n,Abercrombie,Osharmar,rb,SCCC,5090,205,/n92,ABERCROMBIE,BENJI,de,PAME,6020e,230e,5.10e/n,Abercrumbia,Zach,dt,TXRI,6020,290,/n19,Abernathy,Ralph,rb,TNUN,5070,160,/n,Abernathy,Micah,db,TNUN,6000,195,/n37,Abernathy,Eric,db,TNMS,5090,180,/n,Abey,Zach,qb,MDNA,6020,218,/n';
      return playersPage.readAndDeleteExportCSV().then(function(data) {
        assert.equal(data, exportFileContents);
      });
    });
  });
});