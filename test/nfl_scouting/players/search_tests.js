var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var SearchPage = require('../../../pages/nfl_scouting/players/search_page.js');
var navbar, searchPage, filters;

// Tests
test.describe('#Page: Search', function() {
  test.before(function() {
    searchPage = new SearchPage(driver);
    navbar = new Navbar(driver);
    filters = new Filters(driver);
  });

  test.it('navigate to search page', function() {
    navbar.goToPlayersSearchPage();
  });

  test.describe('#searchPlayers', function() {
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
          searchPage.addPlayersFilter('For Tier');
          filters.setDropdownFilter('For Tier', ['A']);
        });

        test.it('players list should be sorted alphabetically by last name asc initially', function() {
          searchPage.getPlayersTableStatsForCol(3).then(function(stats) {
            stats = extensions.normalizeArray(stats, 'stringInsensitive');
            var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'asc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        test.it('clicking arrow next to last name header should reverse the sort', function() {
          searchPage.clickPlayersSortIcon(3);

          searchPage.getPlayersTableStatsForCol(3).then(function(stats) {
            stats = extensions.normalizeArray(stats, 'stringInsensitive');
            var sortedArray = extensions.customSortByType('stringInsensitive', stats, 'desc');
            assert.deepEqual(stats, sortedArray);
          });
        });

        var lastColNum = 3;
        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            searchPage.clickPlayersRemoveSortIcon(lastColNum);
            lastColNum = column.colNum;
            searchPage.clickPlayersTableHeader(column.colNum);

            searchPage.getPlayersTableStatsForCol(column.colNum).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
              var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
              assert.deepEqual(stats, sortedArray);
            });
          });

          test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
            searchPage.clickPlayersSortIcon(column.colNum);

            searchPage.getPlayersTableStatsForCol(column.colNum).then(function(stats) {
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
          searchPage.waitForPageToLoad();
          attributes.forEach(function(attr, idx) {
            searchPage.getPlayersTableStat(2,attr.col, attr.placeholder).then(function(stat) {
              attributes[idx].originalValue = stat;
            });
          });
        });

        test.it('updating fields', function() {
          attributes.forEach(function(attr) {
            searchPage.changePlayersTableStatField(attr.type, 2, attr.col, attr.updatedValue );
          });
          browser.refresh();
          searchPage.waitForPageToLoad();
        });

        attributes.forEach(function(attr) {
          test.it('updating ' + attr.field + ' should persist on reload', function() {
            searchPage.getPlayersTableStat(2, attr.col, attr.placeholder).then(function(value) {
              assert.equal(value, attr.updatedValue, attr.field);
            });
          });
        });

        test.it('reverting fields', function() {
          attributes.forEach(function(attr) {
            searchPage.changePlayersTableStatField(attr.type, 2, attr.col, attr.originalValue );
          });
        });

        test.it('adding list to player should persist on reload', function() {
          searchPage.togglePlayerRow(1);
          searchPage.addListToPlayer(1, 'TEST');
          browser.refresh();
          searchPage.waitForPageToLoad();
          searchPage.togglePlayerRow(1);
          searchPage.getPlayerLists(1).then(function(lists) {
            assert.include(lists, 'TEST');
          });
        });

        test.it('removing list from player should persist on reload', function() {
          searchPage.removeListFromPlayer(1, 'TEST');
          browser.refresh();
          searchPage.waitForPageToLoad();
          searchPage.togglePlayerRow(1);
          searchPage.getPlayerLists(1).then(function(lists) {
            assert.notInclude(lists, 'TEST');
          });
        });
      });

      test.describe('#controls', function() {
        test.it('changing # rows to 25 updates the table accordingly', function() {
          searchPage.changePlayersNumberOfRows(25);
          searchPage.getPlayersTableRowCount().then(function(stat) {
            assert.equal(stat, 25);
          });
        });

        test.it('pressing next button updates the table accordingly', function() {
          searchPage.getPlayersTableStat(25,3).then(function(stat) {
            lastPlayerFirstPage = stat;
          });

          searchPage.clickPlayersNextButton();
          searchPage.getPlayersTableStat(1,3).then(function(stat) {
            firstPlayerSecondPage = stat;
            assert.isAtLeast(firstPlayerSecondPage.toLowerCase(), lastPlayerFirstPage.toLowerCase(), 'last name of 1st row player on 2nd page > last name of 25th row player on 1st page');
          });
        });

        test.it('pressing previous button updates the table accordingly', function() {
          searchPage.clickPlayersPreviousButton();
          searchPage.getPlayersTableStat(25,3).then(function(stat) {
            assert.equal(stat, lastPlayerFirstPage, 'last name of bottom row player');
          });
        });
      });
    });

    test.describe('#filters', function() {
      var dropdownFilters = [
        { name: 'At Positions', values: ['QB'], columnName: 'Pos', result: 'ADAMSON' },
        { name: 'For Draft Years', values: ['2018', '2019'], columnName: 'Draft Year', result: "'Unga" },
        { name: 'For Tier', values: ['A'], columnName: 'Tier', result: "Askew-Henry" },
        { name: 'Draft Position', values: ['TEY'], columnName: 'Draft Position', result: 'AUCLAIR' },
        { name: 'Bowl Game', values: ['SR'], columnName: 'Bowl Game', result: 'Kupp' },
        { name: 'Feb. Grade', values: ['7.5'], columnName: 'Feb. Grade', parsedValues: ['7.5'], result: 'ALLEN' },
        { name: 'Dec. Grade', values: ['8.0'], columnName: 'Dec. Grade', parsedValues: ['8.0'], result: 'Fournette' },
        { name: 'Final. Grade', values: ['2.2'], columnName: 'Final. Grade', parsedValues: ['2.2'], result: 'ANTOINE' },
        { name: 'Reported ST Grade', values: ['8 Excellent'], result: 'Hollins' },
        { name: 'Reported Overall Grade', values: ['7.5'], result: "ALI'IFUA" },
        { name: 'Report Type', values: ['Spring (Archived)'], result: 'ALLEN'},
        { name: 'Jags. Pos.', values: ['FB'], result: 'Atkins'},
        { name: 'Measurable Event', values: ['ALLSTAR'], result: 'ADEBOYEJO'},
        { name: 'Flex Position', values: ['SB'], result: 'BECKWITH'},
      ];

      var checkboxFilters = [
        { name: 'Underclassman', value: true, columnName: 'Underclassman', displayValue: '', result: 'Anzalone' },
        { name: 'Jag Head', value: true, columnName: 'Jag Head', result: 'BEATHARD' },
        { name: 'Skull/Crossbones', value: true, columnName: 'Skull/Crossbones', displayValue: '', result: 'BACCHUS' },
        { name: 'T', value: true, columnName: 'T', result: 'BOLDEN'},
        { name: 'SR', value: true, value: true, result: 'NO DATA' },
        { name: 'NIC', value: true, columnName: 'NIC', result: 'Hester' },
        { name: 'Red Dot', value: true, columnName: 'Red Dot', displayValue: '', result: 'AUGUSTA' },
        { name: 'Blk', value: true, columnName: 'Blk', result: 'BRANTLEY' },
        { name: 'Blk+', value: true, columnName: 'Blk+', result: 'ANDERSON' },
        { name: 'X Alert', value: true, columnName: 'X Alert', result: 'Allen' },
        { name: 'C Alert', value: true, columnName: 'C Alert', result: 'Allen' },
        { name: 'Practice Squad Eligible', value: true, result: 'NO DATA'},
      ];

      var rangeFilters = [
        { name: 'Height', minValue: '6090', maxValue: '6100', columnName: 'Height', result: 'Appolloni' },
        { name: 'Weight', minValue: '300', maxValue: '300', columnName: 'Weight', result: 'AH KIONG' },
        { name: 'Speed', minValue: '4.22', maxValue: '4.22', result: 'ROSS' },
        { name: 'Inside Run', minValue: '7', maxValue: '7', result: 'CHUBB' },
        { name: 'Draft Pick', minValue: '1', maxValue: '1', result: 'BROKEN' },
        { name: 'Draft Number', minValue: '1', maxValue: '1', result: 'BROKEN' },
        { name: 'Draft Round', minValue: '1', maxValue: '1', result: 'BROKEN' },
        { name: 'Entry Year', minValue: '2017', maxValue: '2017', result: 'Adeboyejo' },
        { name: 'NFL Experience', minValue: '1', maxValue: '2', result: 'Abdesmad' },
        { name: 'NFL Seasons', minValue: '5', maxValue: '5', result: 'Bademosi' },
        { name: 'Practice Squad Credits', minValue: '3', maxValue: '3', result: 'Aiken' },
        { name: 'Pension Credits', minValue: '12', maxValue: '12', result: 'Backus' },
        { name: 'Reported Height', minValue: '6090', maxValue: '7000', result: 'Banner' },
        { name: 'Reported Weight', minValue: '350', maxValue: '350', result: 'BOUTTE' },
        { name: 'Measured Height', minValue: '6090', maxValue: '7000', result: 'SKIPPER' },
        { name: 'Measured Weight', minValue: '375', maxValue: '400', result: 'DELGADO' },
        { name: 'Measured Hand', minValue: '980', maxValue: '1000', result: 'ATKINSON' },
        { name: 'Measured Wing', minValue: '850', maxValue: '1000', result: 'Agudosi' },
        { name: 'Measured 40 J1', minValue: '525', maxValue: '550', result: 'Averill' },
        { name: 'Measured 40 J2', minValue: '525', maxValue: '550', result: 'NO DATA' },
        { name: 'Measured 40 1', minValue: '440', maxValue: '445', result: 'AWUZIE' }, // TODO - 4.4 or 440? It seems like there's players that have it in each format
        { name: 'Measured 40 2', minValue: '420', maxValue: '430', result: 'Myrick' },
        { name: 'Measured 40 E', minValue: '525', maxValue: '550', result: 'NO DATA' },
        { name: 'Measured 10 J', minValue: '150', maxValue: '175', result: 'CLARK' },
        { name: 'Measured 10 1', minValue: '160', maxValue: '160', result: 'ADAIR' },
        { name: 'Measured 10 2', minValue: '155', maxValue: '155', result: 'BOARD' },
        { name: 'Measured 10 E', minValue: '155', maxValue: '155', result: 'NO DATA' },
        { name: 'Measured 20 J', minValue: '300', maxValue: '310', result: 'GOLTRY' },
        { name: 'Measured 20 1', minValue: '295', maxValue: '295', result: 'Bisnowaty' },
        { name: 'Measured 20 2', minValue: '290', maxValue: '290', result: 'ALFORD' },
        { name: 'Measured 20 E', minValue: '290', maxValue: '290', result: 'NO DATA' },
        { name: 'Measured VJ', minValue: '25', maxValue: '25', result: 'ANGEH' },
        { name: 'Measured BJ', minValue: '800', maxValue: '800', result: 'COLLINS' },
        { name: 'Measured BP', minValue: '30', maxValue: '30', result: 'COWARD' },
        { name: 'Measured Shuttles 20', minValue: '500', maxValue: '500', result: 'Bothwell' },
        { name: 'Measured Shuttles 60', minValue: '750', maxValue: '800', result: 'Colucci' },
        { name: 'Measured Three Cone', minValue: '850', maxValue: '860', result: 'ASH' },
        { name: 'Run Game', minValue: '8', maxValue: '9', result: 'Barkley' },
        { name: 'Pass Game', minValue: '8', maxValue: '9', result: 'Garrett' },
        { name: 'Football Character', minValue: '1', maxValue: '1', result: 'DERRICOTT' },
        { name: 'Personal Character', minValue: '2', maxValue: '2', result: 'Mauk' },
        { name: 'Work Ethic', minValue: '8', maxValue: '8', result: 'McCaffrey' },
        { name: 'Compete & Toughness', minValue: '1', maxValue: '2', result: 'ZUZO' },
        { name: 'Durability', minValue: '3', maxValue: '3', result: 'POPOVICH' },
        { name: 'Mental/Learning', minValue: '8', maxValue: '8', result: 'RAGNOW' },
        { name: 'Productivity', minValue: '9', maxValue: '9', result: 'PUMPHREY' },
        { name: 'Athletic Ability', minValue: '1', maxValue: '1', result: 'BOYD' },
        { name: 'Size', minValue: '1', maxValue: '1', result: 'DUKE' },
        { name: 'Speed', minValue: '8', maxValue: '9', result: 'Bolles', filterNum: 2 },
        { name: 'Instincts', minValue: '9', maxValue: '9', result: 'Jones' },
        { name: 'Play Strength', minValue: '9', maxValue: '9', result: 'GAMBLE' },
        { name: 'Explosion', minValue: '8', maxValue: '8', result: 'LANDRY' },
        { name: 'Hands', minValue: '8', maxValue: '8', result: 'ROGERS' },
        { name: 'ACC Short', minValue: '7', maxValue: '7', result: 'Rosen' },
        { name: 'ACC Long', minValue: '6', maxValue: '6', result: 'FALK' },
        { name: 'Arm Strength', minValue: '8', maxValue: '9', result: 'Allen' },
        { name: 'Leadership', minValue: '8', maxValue: '8', result: 'Trubisky' },
        { name: 'Dependability', minValue: '3', maxValue: '3', result: 'TOWLES' },
        { name: 'Awareness', minValue: '3', maxValue: '3', result: 'CONQUE' },
        { name: 'Security', minValue: '6', maxValue: '6', result: 'RUDOLPH' },
        { name: 'Pocket Str', minValue: '1', maxValue: '3', result: 'FUGATE' },
        { name: 'Drop Set', minValue: '1', maxValue: '3', result: 'GUSTAFSON' },
        { name: 'Mechanics', minValue: '1', maxValue: '3', result: 'ZIEMBA' },
        { name: 'Release', minValue: '3', maxValue: '3', result: 'Hills' },
        { name: 'Delivery', minValue: '8', maxValue: '9', result: 'Trubisky' },
        { name: 'Mobility', minValue: '8', maxValue: '9', result: 'Darnold' },
        { name: 'Throw on Move', minValue: '8', maxValue: '9', result: 'Darnold' },
        { name: 'Vision', minValue: '8', maxValue: '9', result: 'Perine' },
        { name: 'Start', minValue: '3', maxValue: '3', result: 'JUDD' },
        { name: 'Inside Run', minValue: '8', maxValue: '9', result: 'Scott' },
        { name: 'Elude', minValue: '8', maxValue: '9', result: 'Barkley' },
        { name: 'YAC', minValue: '8', maxValue: '9', result: 'HUNT' },
        { name: 'Balance', minValue: '8', maxValue: '9', result: 'Fournette' },
        { name: 'Pad Level', minValue: '7', maxValue: '7', result: 'Perine' },
        { name: 'Outside Run', minValue: '8', maxValue: '9', result: 'Mack' },
        { name: 'Ball Security', minValue: '8', maxValue: '9', result: 'BOUAGNON' },
        { name: 'Routes', minValue: '1', maxValue: '2', result: 'RAYFORD' },
        { name: 'Catching Skills', minValue: '3', maxValue: '3', result: 'HAMPTON' },
        { name: 'Initial Quickness', minValue: '7', maxValue: '9', result: 'Hyatt' },
        { name: 'Second Level', minValue: '7', maxValue: '9', result: 'ELFLEIN' },
        { name: 'Pull', minValue: '7', maxValue: '7', result: 'POCIC' },
        { name: 'Sustain', minValue: '8', maxValue: '9', result: 'Nelson' },
        { name: 'Pass Set', minValue: '8', maxValue: '9', result: 'Ramczyk' },
        { name: 'Pass Set vs Power', minValue: '8', maxValue: '9', result: 'Brown' },
        { name: 'Pass Set vs Speed', minValue: '7', maxValue: '9', result: 'Bolles' },
        { name: 'Pass Set vs Counter', minValue: '6', maxValue: '6', result: 'MADISON' },
        { name: 'Pass Set vs Blitz', minValue: '7', maxValue: '9', result: 'ELFLEIN' },
        { name: 'Second Position Value', minValue: '7', maxValue: '7', result: 'Ramczyk' },
        { name: 'Separation', minValue: '7', maxValue: '9', result: 'Ridley' },
        { name: 'Vertical Threat', minValue: '7', maxValue: '9', result: 'CHARK' },
        { name: 'RAC', minValue: '8', maxValue: '9', result: 'Jackson' },
        { name: 'Key Plays', minValue: '8', maxValue: '8', result: 'Kupp' },
        { name: 'Blocking', minValue: '8', maxValue: '9', result: 'Smith-Schuster' },
        { name: 'Adjust', minValue: '7', maxValue: '7', result: 'EVERETT' },
        { name: 'Blocking Run', minValue: '6', maxValue: '6', result: 'Kittle' },
        { name: 'Blocking Pass', minValue: '6', maxValue: '6', result: 'HERNDON' },
        { name: 'Separation Ability', minValue: '7', maxValue: '9', result: 'HOWARD' },
        { name: 'First Step Explosion', minValue: '8', maxValue: '9', result: 'LANDRY' },
        { name: '1 Gap Ability', minValue: '8', maxValue: '9', result: 'McDowell' },
        { name: '2 Gap Ability', minValue: '8', maxValue: '9', result: 'Vea' },
        { name: 'Lateral Leverage', minValue: '7', maxValue: '9', result: 'LOTULELEI' },
        { name: 'Disengage/UOH', minValue: '8', maxValue: '9', result: 'Gustin' },
        { name: 'Pursuit', minValue: '8', maxValue: '9', result: 'MCKINLEY' },
        { name: 'Tackling', minValue: '7', maxValue: '9', result: 'HAMILTON' },
        { name: 'Pass Rush Power', minValue: '8', maxValue: '9', result: 'WATKINS' },
        { name: 'Pass Rush Speed', minValue: '8', maxValue: '9', result: 'LANDRY' },
        { name: 'Pass Rush Moves', minValue: '8', maxValue: '9', result: 'BOWER' },
        { name: 'Stack Ability', minValue: '7', maxValue: '9', result: 'DAVIS' },
        { name: 'Lateral Ability', minValue: '8', maxValue: '9', result: 'Peppers' },
        { name: 'Coverage Man', minValue: '7', maxValue: '9', result: 'Anzalone' },
        { name: 'Coverage Zone', minValue: '8', maxValue: '9', result: 'Reynolds' },
        { name: 'Ball Skills', minValue: '8', maxValue: '9', result: 'Jackson' },
        { name: 'Blitz', minValue: '1', maxValue: '3', result: 'WHITENER' },
        { name: 'Concentration', minValue: '1', maxValue: '2', result: 'LESTON' },
        { name: 'Coverage Press Man', minValue: '1', maxValue: '2', result: 'TEXADA' },
        { name: 'Coverage Off Man', minValue: '1', maxValue: '2', result: 'Bailey-Smith' },
        { name: 'Close', minValue: '1', maxValue: '2', result: 'Rainey' },
        { name: 'Pedal', minValue: '1', maxValue: '3', result: 'MCTYER' },
        { name: 'Transition', minValue: '3', maxValue: '3', result: 'Hoffpauir' },
        { name: 'Range', minValue: '1', maxValue: '2', result: 'Mosely' },
        { name: 'Run Support', minValue: '1', maxValue: '2', result: 'SINGLETON' },
        { name: 'Right Left', minValue: '6', maxValue: '6', result: 'DAVIDSON' },
        { name: 'Leg Speed', minValue: '7', maxValue: '7', result: 'GONZALEZ' },
        { name: 'Leg Strength', minValue: '7', maxValue: '7', result: 'Townsend' },
        { name: 'Accuracy Short', minValue: '7', maxValue: '7', result: 'VAN WINKLE' },
        { name: 'Accuracy Long', minValue: '7', maxValue: '7', result: 'HAACK' },
        { name: 'Rise', minValue: '7', maxValue: '7', result: 'BUTKER' },
        { name: 'In Elements', minValue: '6', maxValue: '6', result: 'Delahoussaye' },
        { name: 'Pressure Kicks', minValue: '6', maxValue: '6', result: 'Ukropina' },
        { name: 'Kickoff', minValue: '7', maxValue: '9', result: 'ELLIOTT' },
        { name: 'Coverage', minValue: '1', maxValue: '3', result: 'WADMAN' },
        { name: 'Accuracy', minValue: '1', maxValue: '3', result: "D'Antuono" },
        { name: 'Velocity', minValue: '1', maxValue: '3', result: 'DALY' },
        { name: 'Coverage Ability', minValue: '6', maxValue: '9', result: 'HOLBA' },
        { name: 'Position Versatility', minValue: '6', maxValue: '9', result: 'KUNTZ' },
        { name: 'Run Skills', minValue: '6', maxValue: '6', result: 'NATSON' },
        { name: 'Courage', minValue: '6', maxValue: '6', result: 'McKenzie' },
        { name: 'Number of Steps', minValue: '6', maxValue: '6', result: 'DAVIDSON' },
        { name: 'Directional Ability', minValue: '5', maxValue: '5', result: 'DAVIDSON' },
      ];

      var resourceSetFilters = [
        { name: 'On Teams', values: ['CALA', 'MSSO'], columnName: 'Team Code', value: 'AWEDISEAN' },
        { name: 'On NFL Teams', values: ['DEN'], result: 'Atwater'},
        { name: 'Start Club', values: ['DEN'], result: 'Lowry'},
      ];

      var textFilters = [
        { name: 'Measured Arm', value: '10', result: 'BROKEN' }, // should be range filter?
        { name: 'League', value: 'NFL', result: 'BACH' },
        { name: 'Drafted By', value: 'DEN', result: 'BROKEN' },
        { name: 'End Club', value: 'DEN', result: 'BROKEN' },
        { name: 'Potential Club', value: 'DEN', result: 'BROKEN' },
        { name: 'Agent First Name', value: 'John', result: 'ALFORD' },
        { name: 'Agent Last Name', value: 'Oluyole', result: 'AWINI' },
        { name: 'Agent Company', value: 'CAA', result: 'NO DATA' },
        { name: 'Agent Phone', value: '555-555-5555', result: 'NO DATA' },
        { name: 'Agent Address 1', value: '123 Main Street', result: 'NO DATA'},
        { name: 'Agent Address 2', value: '123 Main Street', result: 'NO DATA'},
        { name: 'Agent City', value: 'Los Angeles', result: 'NO DATA'},
        { name: 'Agent State', value: 'Los Angeles', result: 'NO DATA'},
        { name: 'Run Comments', value: 'strength to hold the edge', result: 'CASHER' },
        { name: 'Pass Comments', value: 'good burst', result:  'Farris' },
        { name: 'Summary Comments', value: 'deep threat', result: 'Staggers' },
        { name: 'One Liner Comments', value: 'closing burst', result: 'Abraham' },
        { name: 'Help Team Comments', value: 'blockers', result: 'Nnadi' },
        { name: 'Production Comments', value: 'highlight reel catch', result: 'Kings Jr.' },
        { name: 'Football Character Comments', value: 'Alpha male', result: 'Tagaloa' },
        { name: 'Personal Character Comments', value: 'academic scholarship', result: 'Obasih' },
        { name: 'Durability Comments', value: 'different injuries', result: 'Friend' },
        { name: 'Teachability Comments', value: 'Academic All Big Ten', result: 'Bazata' },
        { name: 'Notes', value: 'Three-star recruit by Scout', result: 'Villamin' },
      ];

      test.beforeEach(function() {
        browser.refresh();
        searchPage.changeReportsNumberOfRows(50);
      });

      dropdownFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
          searchPage.addPlayersFilter(filter.name, filter.filterNum);
          filters.setDropdownFilter(filter.name, filter.values, 'players');
          
          searchPage.getPlayersTableStatsFor("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      checkboxFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.value}) updates the table accordingly`, function() {
          searchPage.addPlayersFilter(filter.name, filter.filterNum);
          filters.changeCheckboxFilter(filter.name, filter.value);

          searchPage.getPlayersTableStatsFor("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      rangeFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.minValue} - ${filter.maxValue}) updates the table accordingly`, function() {
          searchPage.addPlayersFilter(filter.name, filter.filterNum);
          filters.changeRangeFilter(filter.name, filter.minValue, filter.maxValue);
          searchPage.getPlayersTableStatsFor("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      textFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} - (${filter.value}) updates the table accordingly`, function() {
          searchPage.addPlayersFilter(filter.name, filter.filterNum);
          filters.changeTextFilter(filter.name, filter.value);
          searchPage.getPlayersTableStatsFor("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      resourceSetFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
          searchPage.addPlayersFilter(filter.name, filter.filterNum);
          filters.setResourceSetFilter(filter.name, filter.values);
          searchPage.getPlayersTableStatsFor("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });
      
      // dropdownFilters.forEach(function(filter) {
      //   test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
      //     browser.refresh();
      //     searchPage.togglePlayersColumn(filter.columnName, true);

      //     searchPage.addPlayersFilter(filter.name);
      //     filters.setDropdownFilter(filter.name, filter.values);
      //     searchPage.waitForPageToLoad();
      //     searchPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
      //       var uniqueStats = Array.from(new Set(stats));
      //       var values = filter.parsedValues || filter.values;
      //       assert.sameMembers(values, uniqueStats);
      //     });
      //   });
      // });

      // checkboxFilters.forEach(function(filter) {
      //   test.it(`adding filter: ${filter.name} (${filter.value}) updates the table accordingly`, function() {
      //     browser.refresh();
      //     searchPage.togglePlayersColumn(filter.columnName, true);

      //     searchPage.addPlayersFilter(filter.name);
      //     filters.changeCheckboxFilter(filter.name, filter.value);
      //     searchPage.waitForPageToLoad();

      //     searchPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
      //       var uniqueStats = Array.from(new Set(stats));
      //       var value = filter.displayValue === undefined ? filter.value.toString() : filter.displayValue;
      //       assert.sameMembers([value], uniqueStats);
      //     });
      //   });
      // });

      // rangeFilters.forEach(function(filter) {
      //   test.it(`adding filter: ${filter.name} (${filter.minValue} - ${filter.maxValue}) updates the table accordingly`, function() {
      //     browser.refresh();
      //     searchPage.togglePlayersColumn(filter.columnName, true);

      //     searchPage.addPlayersFilter(filter.name);
      //     filters.changeRangeFilter(filter.name, filter.minValue, filter.maxValue);
      //     searchPage.waitForPageToLoad();

      //     searchPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
      //       var uniqueStats = Array.from(new Set(stats));

      //       uniqueStats.forEach(function(stat) {
      //         assert.isAtLeast(parseFloat(stat), filter.minValue);
      //         assert.isAtMost(parseFloat(stat), filter.maxValue);
      //       });
      //     });
      //   });
      // });

      // resourceSetFilters.forEach(function(filter) {
      //   test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
      //     browser.refresh();
      //     searchPage.togglePlayersColumn(filter.columnName, true);

      //     searchPage.addPlayersFilter(filter.name);
      //     filters.setResourceSetFilter(filter.name, filter.values);
      //     searchPage.waitForPageToLoad();

      //     searchPage.getPlayersTableStatsFor(filter.columnName).then(function(stats) {
      //       var uniqueStats = Array.from(new Set(stats));
      //       assert.sameMembers(filter.values, uniqueStats);
      //     });
      //   });      
      // });

      test.it('adding filter: On Player Lists (TEST)', function() {
        browser.refresh();
        searchPage.addPlayersFilter('On Player Lists');
        filters.setResourceSetFilter('On Player Lists', ['TEST']);

        searchPage.waitForPageToLoad();

        searchPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
          assert.sameMembers(['VICKERS', 'VULCANO'], stats);
        });
      });

      test.it('adding filter: Alerts (a)', function() {
        browser.refresh();
        searchPage.addPlayersFilter('Alerts');
        filters.setDropdownFilter('Alerts', ['u']);

        searchPage.waitForPageToLoad();

        searchPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
          assert.sameMembers(['EVANS', 'VICKERS'], stats);
        });
      });


      test.it('adding filter: Is Deleted', function() {
        browser.refresh();
        searchPage.addPlayersFilter('Is Deleted');
        filters.changeCheckboxFilter('Is Deleted', true);

        searchPage.waitForPageToLoad();

        searchPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
          assert.includeMembers(stats, ['Young']);
        });
      });

      test.it('adding filter: Jersey', function() {
        browser.refresh();
        searchPage.addPlayersFilter('Jersey');
        // TODO - no way to set jersey == 33

        searchPage.waitForPageToLoad();
        searchPage.getPlayersTableStatsFor('Jersey').then(function(stats) {
          var uniqueStats = Array.from(new Set(stats));
          assert.sameMembers(['33'], uniqueStats);
        });
      })

      test.describe('#compoundFilterTest', function() {
        test.it('filters: Is Starter: true (AND),  For Class Years: FR (AND), At Positions: K  (AND)', function() {
          this.timeout(120000);
          browser.refresh();
          searchPage.togglePlayersColumn('Starter', true);
          searchPage.addPlayersFilter('Is Starter');
          filters.changeCheckboxFilter('Is Starter', true);

          searchPage.addPlayersFilter('For Class Years');
          filters.setDropdownFilter('For Class Years', ['FR']);

          searchPage.addPlayersFilter('At Positions');
          filters.setDropdownFilter('At Positions', ['PK']);

          searchPage.waitForPageToLoad();

          searchPage.getPlayersTableStatsFor('Starter').then(function(stats) {
            var uniqueStats = Array.from(new Set(stats));
            assert.sameMembers(['check_box'], uniqueStats);
          });

          searchPage.getPlayersTableStatsFor('Last Name').then(function(stats) {
            assert.includeMembers(stats, ['Aguayo', 'Blankenship']);
          });
        });
        
        test.it('filters: Is Starter (OR), For Tier (OR)', function() {
          filters.removeFilter('For Class Years');
          searchPage.togglePlayersColumn('Tier', true);

          filters.changeFilterLogic('Is Starter', 'or');
          searchPage.addPlayersFilter('For Tier');
          filters.setDropdownFilter('For Tier', ['D']);
          filters.changeFilterLogic('For Tier', 'or');
          
          searchPage.waitForPageToLoad();

          searchPage.getPlayersTableStatsFor('Starter').then(function(stats) {
            var uniqueStats = Array.from(new Set(stats));
            assert.sameMembers(['check_box', 'check_box_outline_blank'], uniqueStats);
          });

          searchPage.getPlayersTableStatsFor('Tier').then(function(stats) {
            var uniqueStats = Array.from(new Set(stats));
            assert.sameMembers(['A', 'B', 'C', 'D', '?'], uniqueStats);
          });
        });
      });
    });

    test.describe('#measurables', function() {
      test.it('editing measurable persists', function() {
        browser.refresh();
        searchPage.togglePlayerRow(1);
        searchPage.changeMeasurableInputField(1, 1, 9, 9.5);
        browser.refresh();
        searchPage.togglePlayerRow(1);
        searchPage.getMeasurableInputField(1, 1, 9).then(function(stat) {
          assert.equal(stat, 9.5, '1st player hand field')
        })
      });

      test.it('editing measurable persists', function() {
        browser.refresh();
        searchPage.togglePlayerRow(1);
        searchPage.changeMeasurableInputField(1, 1, 9, 3.5);
        browser.refresh();
        searchPage.togglePlayerRow(1);
        searchPage.getMeasurableInputField(1, 1, 9).then(function(stat) {
          assert.equal(stat, 3.5, '1st player hand field')
        })
      });

      test.it('creating batch measurable persists for all players with open measurables', function() {
        var pOneCount, pTwoCount;
        driver.sleep(2000);
        searchPage.getMeasurablesCount(1).then(function(count) {
          pOneCount = count;
        })

        searchPage.togglePlayerRow(2);
        driver.sleep(2000);
        searchPage.getMeasurablesCount(2).then(function(count) {
          pTwoCount = count;
        })
        searchPage.togglePlayerRow(2);
        searchPage.createBatchMeasurables('NFS');
        searchPage.waitForPageToLoad()

        searchPage.getMeasurablesCount(1).then(function(count) {
          assert.equal(count, pOneCount+1, 'player 1 measurable count')
        });

        searchPage.togglePlayerRow(1);
        searchPage.togglePlayerRow(2);
        searchPage.getMeasurablesCount(2).then(function(count) {
          assert.equal(count, pTwoCount, 'player 2 measurable count')
        });
      });
    });
  });  
});