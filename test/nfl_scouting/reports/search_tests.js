var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;

var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/nfl_scouting/navbar.js');
var Filters = require('../../../pages/nfl_scouting/filters.js');
var SearchPage = require('../../../pages/nfl_scouting/reports/search_page.js');
var navbar, searchPage, filters;

// Tests
test.describe('#Page: ReportsSearch', function() {
  test.before(function() {
    searchPage = new SearchPage(driver);
    navbar = new Navbar(driver);
    filters = new Filters(driver);
  });

  test.it('navigate to reports search page', function() {
    navbar.goToReportsSearchPage();
  });

  // SEARCH REPORTS
  test.describe('#searchReports', function() {
    test.describe('#table', function() {
      test.describe('#sorting', function() {
        var columns = [
          { colName: 'Code', sortType: 'string' },
          { colName: 'Pos', sortType: 'string' },
          { colName: 'First Name', sortType: 'stringInsensitive' },
          { colName: 'Last Name', placeholder: 'Select value' },
          { colName: 'Final Grade', sortType: 'string' },
          { colName: 'Author', sortType: 'string' },
        ];

        var lastColName;
        columns.forEach(function(column) {
          test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
            if (lastColName) searchPage.clickReportsRemoveSortIcon(lastColName);
            lastColName = column.colName;
            searchPage.clickReportsTableHeader(column.colNum);

            searchPage.getReportsTableStats(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
              var sortedArray = extensions.customSortByType(column.sortType, stats, 'asc', column.sortEnumeration);
              assert.deepEqual(stats, sortedArray);
            });
          });

          test.it('clicking arrow next to ' + column.colName + ' should reverse the sort', function() {
            searchPage.clickReportsSortIcon(column.colName);

            searchPage.getReportsTableStats(column.colName).then(function(stats) {
              stats = extensions.normalizeArray(stats, column.sortType, column.placeholder);
              var sortedArray = extensions.customSortByType(column.sortType, stats, 'desc', column.sortEnumeration);
              assert.deepEqual(stats, sortedArray);
            });
          });
        });
      });

      test.describe('#controls', function() {
        test.it('changing # rows to 25 updates the table accordingly', function() {
          browser.refresh();
          searchPage.clickReportsTableHeader('Last Name');
          searchPage.changeReportsNumberOfRows(25);
          searchPage.waitForPageToLoad();
          searchPage.getReportsTableRowCount().then(function(stat) {
            assert.equal(stat, 25);
          });
        });

        test.it('pressing next button updates the table accordingly', function() {
          searchPage.getReportsTableStat("'last()'",'Last Name').then(function(stat) {
            lastPlayerFirstPage = stat;
          });

          searchPage.clickReportsNextButton();
          searchPage.getReportsTableStat("'first()'",'Last Name').then(function(stat) {
            firstPlayerSecondPage = stat;
            assert.isAtLeast(firstPlayerSecondPage.toLowerCase(), lastPlayerFirstPage.toLowerCase(), 'last name of 1st row player on 2nd page > last name of 25th row player on 1st page');
          });
        });

        test.it('pressing previous button updates the table accordingly', function() {
          searchPage.clickReportsPreviousButton();
          searchPage.getReportsTableStat("'last()'",'Last Name').then(function(stat) {
            assert.equal(stat, lastPlayerFirstPage, 'last name of bottom row player');
          });
        });
      });
    });

    test.describe('#filters', function() {
      var dropdownFilters = [
        { name: 'Reported ST Grade', values: ['2 Poor'], result: "D'Antuono" },
        { name: 'Reported Overall Grade', values: ['8.0'], result: 'Darnold' },
        { name: 'Report Type', values: ['All Star (Locked)'], result: 'MELIFONWU' },
        { name: 'Jags. Pos.', values: ['P'], result: 'GLEESON' },
        { name: 'Acquire', values: ['Y'], result: 'Sinclair' },
        { name: 'Trend', values: ['↑'], result: 'Sinclair' }
      ];

      var rangeFilters = [
        { name: 'Reported Height', minValue: '5000', maxValue: '5060', result: 'Calhoun' },
        { name: 'Reported Weight', minValue: '100', maxValue: '150', result: 'NATSON' },
        { name: 'Reported Speed', minValue: '4', maxValue: '5', result: 'ATKINSON' },
        { name: 'Second Position Value', minValue: '7', maxValue: '7', result: 'Ramczyk' },
        { name: 'Run Game', minValue: '8', maxValue: '8', result: 'Fournette' },
        { name: 'Pass Game', minValue: '8', maxValue: '10', result: 'Mixon' },
        { name: 'Football Character', minValue: '1', maxValue: '1', result: 'DERRICOTT' },
        { name: 'Personal Character', minValue: '2', maxValue: '2', result: 'Mauk' },
        { name: 'Work Ethic', minValue: '8', maxValue: '8', result: 'McCaffrey' },
        { name: 'Compete & Toughness', minValue: '1', maxValue: '2', result: 'ZUZO' },
        { name: 'Durability', minValue: '3', maxValue: '3', result: 'POPOVICH' },
        { name: 'Mental/Learning', minValue: '8', maxValue: '8', result: 'RAGNOW' },
        { name: 'Productivity', minValue: '9', maxValue: '9', result: 'PUMPHREY' },
        { name: 'Athletic Ability', minValue: '1', maxValue: '1', result: 'BOYD' },
        { name: 'Size', minValue: '1', maxValue: '1', result: 'DUKE' },
        { name: 'Speed', minValue: '8', maxValue: '9', result: 'Bolles' },
        { name: 'Instincts', minValue: '9', maxValue: '9', result: 'Jones' },
        { name: 'Play Strength', minValue: '9', maxValue: '9', result: 'GAMBLE' },
        { name: 'Explosion', minValue: '8', maxValue: '8', result: 'LANDRY' },
        { name: 'Hands', minValue: '8', maxValue: '8', result: 'ROGERS' },
        { name: 'ACC Short', minValue: '7', maxValue: '7', result: 'Rosen' },
        { name: 'ACC Long', minValue: '6', maxValue: '6', result: 'FALK' },
        { name: 'Arm Strength', minValue: '8', maxValue: '9', result: 'ALLEN' },
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
        { name: 'Elude', minValue: '8', maxValue: '9', result: 'BARKLEY' },
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
        { name: 'Pass Set vs Speed', minValue: '8', maxValue: '9', result: 'Rankin' },
        { name: 'Pass Set vs Counter', minValue: '6', maxValue: '6', result: 'MADISON' },
        { name: 'Pass Set vs Blitz', minValue: '7', maxValue: '9', result: 'ELFLEIN' },
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
        { name: 'Leg Strength', minValue: '7', maxValue: '7', result: 'TOWNSEND' },
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

      var textFilters = [
        { name: 'Run Comments', value: 'strength to hold the edge', result: 'CASHER' },
        { name: 'Pass Comments', value: 'good burst', result:  'FARRIS' },
        { name: 'Summary Comments', value: 'deep threat', result: 'STAGGERS' },
        { name: 'One Liner Comments', value: 'closing burst', result: 'ABRAHAM' },
        { name: 'Help Team Comments', value: 'blockers', result: 'NNADI' },
        { name: 'Production Comments', value: 'highlight reel catch', result: 'Kings Jr.' },
        { name: 'Football Character Comments', value: 'Alpha male', result: 'Tagaloa' },
        { name: 'Personal Character Comments', value: 'academic scholarship', result: 'OBASIH' },
        { name: 'Durability Comments', value: 'different injuries', result: 'FRIEND' },
        { name: 'Teachability Comments', value: 'Academic All Big Ten', result: 'BAZATA' },
        { name: 'Notes', value: 'Three-star recruit by Scout', result: 'VILLAMIN' },
      ];
      
      test.beforeEach(function() {
        browser.refresh();
        searchPage.changeReportsNumberOfRows(50);
      });

      dropdownFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.values}) updates the table accordingly`, function() {
          searchPage.addReportsFilter(filter.name);
          filters.setDropdownFilter(filter.name, filter.values, 'reports');
          
          searchPage.getReportsTableStats("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      rangeFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} (${filter.minValue} - ${filter.maxValue}) updates the table accordingly`, function() {
          searchPage.addReportsFilter(filter.name);
          filters.changeRangeFilter(filter.name, filter.minValue, filter.maxValue);
          searchPage.getReportsTableStats("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });

      textFilters.forEach(function(filter) {
        test.it(`adding filter: ${filter.name} - (${filter.value}) updates the table accordingly`, function() {
          searchPage.addReportsFilter(filter.name);
          filters.changeTextFilter(filter.name, filter.value);
          searchPage.getReportsTableStats("Last Name").then(function(stats) {
            assert.include(stats, filter.result);
          });
        });
      });
    });

    test.describe('#compoundFilterTest', function() {

    });
  });
});