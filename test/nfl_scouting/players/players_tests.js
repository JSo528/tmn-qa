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
        playersPage.addFilter('For Tier');
        filters.setDropdownFilter('For Tier', ['A']);
      });

      test.it('players list should be sorted alphabetically by last name asc initially', function() {
        playersPage.getTableStatsForCol(3).then(function(stats) {
          stats = extensions.normalizeArray(stats, 'stringInsensitive');
          var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'asc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      test.it('clicking arrow next to last name header should reverse the sort', function() {
        playersPage.clickSortIcon(3);

        playersPage.getTableStatsForCol(3).then(function(stats) {
          stats = extensions.normalizeArray(stats, 'stringInsensitive');
          var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'desc');
          assert.deepEqual(stats, sortedArray);
        });
      });

      var lastColNum = 3;
      columns.forEach(function(column) {
        test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
          playersPage.clickRemoveSortIcon(lastColNum);
          lastColNum = column.colNum;
          playersPage.clickTableHeader(column.colNum);

          playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
            stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
            var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
          playersPage.clickSortIcon(column.colNum);

          playersPage.getTableStatsForCol(column.colNum).then(function(stats) {
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
          assert.isAtLeast(firstPlayerSecondPage.toLowerCase(), lastPlayerFirstPage.toLowerCase(), 'last name of 1st row player on 2nd page > last name of 25th row player on 1st page');
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
      { name: 'Bowl Game', values: ['SR'], columnName: 'Bowl Game' },
      { name: 'Feb. Grade', values: ['7.5'], columnName: 'Feb. Grade' },
      { name: 'Dec. Grade', values: ['8.0'], columnName: 'Dec. Grade' },
      { name: 'Final. Grade', values: ['2.2'], columnName: 'Final. Grade' },
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

    test.it('adding filter: On Player Lists (TEST)', function() {
      browser.refresh();
      playersPage.addFilter('On Player Lists');
      filters.setResourceSetFilter('On Player Lists', ['TEST']);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['VICKERS', 'VULCANO'], stats);
      });
    });

    test.it('adding filter: Alerts (a)', function() {
      browser.refresh();
      playersPage.addFilter('Alerts');
      filters.setDropdownFilter('Alerts', ['u']);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.sameMembers(['DANIELS', 'EVANS', 'VICKERS'], stats);
      });
    });


    test.it('adding filter: Is Deleted', function() {
      browser.refresh();
      playersPage.addFilter('Is Deleted');
      filters.changeCheckboxFilter('Is Deleted', true);

      playersPage.waitForPageToLoad();

      playersPage.getTableStatsFor('Last Name').then(function(stats) {
        assert.includeMembers(stats, ['Young']);
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
      playersPage.addFilter('On Player Lists');
      filters.setResourceSetFilter('On Player Lists', ['GI']);

      playersPage.waitForPageToLoad();

      playersPage.clickExportButton();
    });

    test.it('csv file should have the correct data', function() {
      var exportFileContents = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent/n21,ANDREWS,DAN,oh,NYBP,5110v,198v,4.70v,/n15,ANTOINE,GLEN,dt,IDUN,6030e,320e,5.30e,/n10,APODACA,AUSTIN,qb,NMUN,6030,212,5.10e,/n8,ARMAH,ALEXANDER,de,GAWG,6003v,247v,4.80e,/n15,BAILEY,AARON,qb,IANO,6005v,230v,4.55e,/n,BAIN,ROB,dl,ILUN,6030,295,,/n5,BELLO,B.J.,lb,ILST,6030,225,,/n32,BERRY,KOURTNEY,mlb,ALST,5104e,210e,4.85e,/n71,BOLAND,MICHAEL,ol,MAUN,6060,318,5.45e,/n28,BOUAGNON,JOEL,oh,ILNO,6010v,226v,4.60e,/n10,BOWMAN,JORDAN,fs,PACS,5110v,205v,4.64v,/n36,BREIDA,MATTHEW,oh,GASO,5087v,180v,4.50e,/n57,BROOKS,CORIN,ol,TXPB,,,,/n9,BROWN,GARRY,wo,PACS,5112v,195v,4.50e,/n6,BUCHANAN,RAYMOND,dc,IANO,5101v,175v,4.55e,/n69,BUTLER,ADAM,dl,TNVA,6050,295,5.15e,/n76,CALLENDER,NICK,ol,COST,6060,325,5.25e,/n21,CASHER,CHRIS,de,ALFA,6040e,250e,4.80e,/n87,CELLA,CONNOR,te,TXRI,6030,255,5.00e,/n83,CHURCH,JAMES,wo,VANO,6000e,200e,4.80e,/n9,CHURCH,DEVIN,oh,ILEA,5071v,198v,4.55e,/n31,CIOFFI,ANTHONY,ss,NJRU,5113v,201v,4.75e,/n79,CLARK,JEMAR,ol,ARST,6060,306,5.30e,/n11,COATE,SETH,wo,INSF,6026v,205v,4.60v,/n29,COLLINS,JARED,db,ARUN,5110,173,4.55e,/n45,CONDIT,TYLER,lb,CTNH,,,,/n2,CONQUE,ZACHARY,qb,TXSF,6050v,235v,4.90e,/n57,COWARD,RASHAAD,dt,VAOD,6054v,310v,5.25e,/n27,CROSSAN,DALTON,rb,NHUN,5110,204,4.55e,/n9,CURTIS,AYRN,dc,MINW,6004e,195e,4.65e,/n40,DAVIS,P.J.,wb,GATC,5110,231,,/n1,DAWSON,SHELDON,db,TNMR,5110,180,4.55e,/n11,DELOATCH,ROMOND,te,PATE,6040,220,4.70e,/n94,DEMOSTHENE,RUBEN,lb,OKSN,,,,/n46,DERRICOTT,D\'VONTA,ob,ARTC,5112v,225v,4.75e,/n42,DICKERSON,ROBERT,dc,KSTH,5101v,172v,4.77v,/n5,DOBARD,STANDISH,te,FLMI,6040v,268v,4.95e,/n10,DUKE,AUSTIN,wo,NCCR,5087v,159v,4.75e,/n8,DVORAK,JUSTIN,qb,COMI,5110e,195e,5.00e,/n,EASTON,DALTON,qb,RIBT,6000,192,5.00e,/n83,ESTES,MICHAEL,te,NCGW,6041v,228v,4.83v,/n9,EVANS,DANE,qb,OKTU,6010,210,5.00e,/n,FERGUSON,TYLER,qb,KYWE,6040,225,4.95e,/n20,FLANDERS,JAMES,rb,OKTU,5100,203,4.70e,/n40,FLOWERS,DARION,dc,TXSH,5101v,183v,4.70e,/n75,FLYNN,JOHN,og,MTST,6056v,310v,5.35e,/n,FOLGER,CHARLES,dl,TNUN,6040,265,5.00e,/n9,FORD,DEMETRIS,de,ARTC,5110e,230e,5.00e,/n13,FOREMAN,TONY,dc,TNUN,5096v,189v,4.55e,/n22,FRAZIER,KING,oh,NDST,5111v,218v,4.70e,/n18,FREEMAN,AUSTIN,te,CASJ,6024v,235v,4.75e,/n47,GALAMBOS,MATTHEW,ib,PAPT,6012v,241v,4.85e,/n,GETER,CHAD,lb,NCGW,6020,253,4.97v,/n5,GIBSON,JOHN,db,MOUN,6000,195,4.50e,/n8,GRAHAM,TYSON,db,SDVE,6020,210,4.65e,/n88,GRANT,ZACH,wo,ILUN,5110e,190e,4.65e,/n40,GREGORY,THOMAS,pt,NCEA,6032v,207v,4.95e,/n14,HAINES,DYLAN,s,TXUN,6010,200,4.65e,/n5,HEIMAN,CODY,ib,KSWA,6013v,238v,4.75e,/n88,HOLLISTER,JACOB,te,WYUN,6030e,230e,4.80e,/n11,HOLLOMAN,THOMAS,ob,SCUN,6025v,233v,4.75e,/n7,HOLMAN,ALLEN,lb,PASH,,,,/n28,HOLMES,DAQUAN,fs,MAAI,5104v,180v,4.54v,/n42,HOLSHOE,NICK,ss,MICO,6000e,205e,4.65e,/n7,HORTON,JUSTIN,ob,FLJA,6015v,235v,4.58v,/n13,HOUSTON,BARTLETT,qb,WIUN,6031v,234v,4.95e,/n3,HUDSON,TERRELL,fs,OHAS,5113v,210v,4.70e,/n81,IRWIN,SEAN,te,COUN,6030,250,4.95e,/n93,JAMES,DREW,dt,NMST,6004v,304v,5.35e,/n88,JAMES,NICHOLAS,nt,MSST,6044v,316v,5.25e,/n7,JENKINS,ELIJAH,qb,ALJA,6007v,206v,4.85e,/n7,JETTE,ALEXANDER,wo,RIBR,6003v,187v,4.60e,/n2,JOHNSON,JORDAN,rb,NYBU,6010,220,4.60e,/n3,JONES,ADAM,s,LANW,6020,204,4.65e,/n4,JONES,RICKY,wr,INUN,5100,185,4.55e,/n12,JONES,JARNOR,dc,IAST,6031v,205v,4.70e,/n21,JUDD,AKEEM,oh,MSUN,5107v,228v,4.60e,/n72,KING,JASON,g,INPU,6040,310,5.35e,/n9,KOO,YOUNGHOE,pk,GASO,5091v,182v,5.00e,/n54,KUBLANOW,BRANDON,oc,GAUN,6017v,301v,5.30e,/n80,KUKWA,ANTHONY,te,OHLE,6021v,239v,4.72v,/n43,KUNTZ,CHRISTIAN,lb,PADU,6020,228,,/n61,LARRIEUX,VOGHENS,lt,SCCC,6050,300,5.40e,/n,LAUDERDALE,ANDREW,ol,NHUN,6060,291,5.40e,/n78,LECHLER,LANDON,ot,NDST,6075v,302v,5.25e,/n27,LOTT,TAVIAN,dc,TNEA,5090e,170e,4.70e,/n,LYONS,ALEX,lb,TXRI,6010,230,4.90e,/n97,MADUNEZIM,BRIAN,dl,TXEP,6030,275,5.10e,/n8,MAGEO,ROMMEL,mlb,MSUN,6020,233,4.75e,/n8,MANNS,NYME,wo,MDBO,6020v,205v,4.60e,/n83,MAULHARDT,JACOB,wo,WYUN,6053v,229v,4.55e,/n45,MCCLOSKEY,TYLER,te,TXHO,6020,245,4.95e,/n1,MCGILL,DAVON,ib,WVCO,6010e,210e,5.00e,/n75,MCGOWAN,BENNY,g,MIST,6030,333,5.40e,/n76,MELTON,RYAN,ot,TXSW,6050,329,5.40e,/n53,MIANO,PAULIN,de,VAVU,6042v,266v,4.95v,/n64,MILLER,MICHAEL,ot,KSWA,6043v,293v,5.25e,/n1,MITCHELL,BRADLEY,oh,OHMT,5046v,170v,4.60e,/n5,MIXSON,TWARN,wo,VAHI,5092v,166v,4.59v,/n5,MOORE,RONNIE,wo,OHBG,5090v,169v,4.50e,/n80,MORGAN,DREW,wo,ARUN,5114v,190v,4.55e,/n17,MORLEY,CHRISTOPHER,ss,TNMS,5104v,190v,4.60e,/n6,MULUMBA TSHIMANGA,CHRISTOPHE,ib,MEUN,6001v,237v,4.95e,/n92,MYERS,MIKAL,nt,CTUN,6002v,328v,5.30e,/n52,NEAL,TYRONE,ib,ALAU,6004e,235e,4.80e,/n19,NEAL,DAVONTE\',dc,AZUN,5091v,172v,4.60e,/n69,NELSON,DERRICK,ol,NJRU,6030,295,5.40e,/n19,NELSON,JACK,qb,MNWI,6036v,236v,4.87v,/n15,NORRIS,NICHOLAS,wo,KYWE,5067v,170v,4.55e,/n14,NORVELL,TRENTON,qb,ILWE,6050,225,4.95e,/n,OBAJIMI,EMMANUEL,wr,ALSM,6010,200,,/n95,O\'BRIEN,DANIEL,dt,TNUN,6016v,305v,5.20e,/n7,O\'CONNOR,TYLER,qb,MIST,6010e,220e,4.95e,/n93,ODOM,CHRIS,de,ARST,6020e,250e,5.00e,/n90,OGBONDA,SHALOM,dt,FLAT,6040,295,5.20e,/n24,O\'ROY,JAVANTE,dc,TXSW,6000e,180e,4.75e,/n92,OWINO,DESMOND,de,ALJA,6031v,270v,4.95e,/n1,PACE,DAQUAN,dc,MIEA,5085v,169v,4.65e,/n53,PINNIX-ODRICK,JULIAN,dl,NJRU,6050,274,5.15e,/n9,PIPKINS,ONDRE,nt,TXTC,6030,325,5.30e,/n90,PITTMAN,SE\'VON,de,OHAK,6031v,261v,4.90e,/n5,POOLE,CEDRIC,ss,ALMI,5096v,198v,4.77v,/n68,PULLINS,ANTHONY,oc,TXSF,6010v,290v,5.40e,/n17,PUYOL,BOBBY,pk,CTUN,5100,183,5.00e,/n48,REED,DEZMIN,ob,NCAP,6002v,225v,5.00e,/n9,REID,RYAN,cb,TXBA,5110,190,4.50e,/n9,RICHARDSON,HORACE,db,TXMU,6010,212,4.80e,/n31,RIVERS,DAVID,dc,OHYO,6007v,188v,4.50e,/n94,ROBERSON,WAYLON,nt,ARST,6010e,335e,5.40e,/n,ROBINSON,SPEARMAN,wr,NCWE,6040,215,,/n23,ROGERS,DEJUAN,ss,OHTO,5114v,189v,4.61v,/n91,RYDER,JAKE,pk,MDTO,5110e,175e,5.10e,/n9,SAINT FLEUR,JOBY,de,OKNW,6043v,245v,5.03v,/n4,SANDERS,KENDALL,wr,ARST,6000,187,,/n21,SANDERS,AARON,wo,VAMI,6005v,194v,4.68v,/n44,SAYLES,CASEY,dt,OHUN,6035v,286v,5.10e,/n79,SEATON,BRADLEY,ot,PAVI,6086v,314v,5.30e,/n25,SINGLETON,TERRENCE,dc,TXPV,5100e,185e,4.70e,/n32,SMITH,TYVIS,rb,IANO,6010,226,4.55e,/n92,SMITH,TIMOTHY,de,ILSF,6013v,228v,4.95v,/n25,SMITH,MARQUIS,olb,GASA,6030v,241v,5.03v,/n52,SOTO,SHAKIR,dt,PAPT,6025v,272v,5.20e,/n,SPELMAN,MARK,ol,ILST,6030,290,5.30e,/n69,SPOONER,QADR,og,CNMG,,,,/n73,STEYN,CALVIN,ot,UTWB,6033v,328v,5.40e,/n11,SUMMERS,JAMES,wr,NCEA,6030,218,4.55e,/n25,SUMMERS,CHRISTIAN,wo,MDTO,6023v,211v,4.60e,/n18,SWOOPES,TYRONE,qb,TXUN,6034e,230e,4.80e,/n17,TABBS,VICTOR,te,NCEC,,,,/n,TAGALOA,FREDDIE,ol,AZUN,6080,314,5.35e,/n21,TAYLOR,CHRIS,oh,LATU,5110v,198v,4.70v,/n50,VEREEN,COREY,de,TNUN,6020v,251v,4.85e,/n79,WARE,JYLAN,lt,ALST,6080,309,,/n82,WARRUM,ANTHONY,wo,ILST,6004v,185v,4.55e,/n22,WASHINGTON,DERON,fs,KSPS,6004x,211x,4.55x,/n23,WILLIAMS,SAM,ss,TXBP,6000e,185e,4.80e,/n4,WILLIAMS,MONDO,dc,NCAP,5090v,167v,4.60e,/n17,WILTZ,JOMAL,dc,IAST,5091v,175v,4.41v,/n,WINDHAM,GREG,qb,OHUN,6010,215,5.00e,/n82,WOLITARSKY,DREW,wr,MNUN,6030,220,4.50e,/n74,ZANDI,MASON,lt,SCUN,6090,315,5.35e,/n54,ZERBLIS,FREDERICK,og,COST,6020v,303v,5.30e,/n';
      return playersPage.readAndDeleteExportCSV().then(function(data) {
        assert.equal(data, exportFileContents);
      });
    });
  });
});