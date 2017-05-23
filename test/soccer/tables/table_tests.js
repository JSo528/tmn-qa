var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var extensions = require('../../../lib/extensions.js');

// Page Objects
var Navbar = require('../../../pages/soccer/navbar.js');
var TablePage = require('../../../pages/soccer/tables/table_page.js');
var tablePage, navbar;
var SEASONS = [
  "WSL 2017 (England)",
  "WC Qualification South America 2018 Russia (South America)",
  "WC Qualification Europe 2018 Russia (Europe)",
  "WC Qualification CONCACAF 2018 Russia (N/C America)",
  "WC Qualification Asia 2018 Russia (Asia)",
  "W-League 2016/2017 (Australia)",
  "US Soccer Development Academy U17/18 2016/2017 (United States)",
  "US Open Cup 2017 (United States)",
  "Under 21 Friendlies 2017 (World)",
  "Under 21 Friendlies 2016 (World)",
  "Under 20 Friendlies 2016 (World)",
  "Under 19 Friendlies 2017 (World)",
  "Under 17 Friendlies 2017 (World)",
  "Under 17 Friendlies 2016 (World)",
  "UEFA Youth League 2016/2017 (Europe)",
  "UEFA Women's Championship 2017 Netherlands (Europe)",
  "UEFA U19 Championship 2017 Georgia (Europe)",
  "UEFA Europa League 2016/2017 (Europe)",
  "UEFA Europa League 2015/2016 (Europe)",
  "UEFA Champions League 2016/2017 (Europe)",
  "UEFA Champions League 2015/2016 (Europe)",
  "U17 World Cup 2015 Chile (World)",
  "Tweede Divisie 2016/2017 (Netherlands)",
  "Superliga 2016/2017 (Denmark)",
  "Süper Lig 2016/2017 (Turkey)",
  "Süper Lig 2015/2016 (Turkey)",
  "Süper Lig 2014/2015 (Turkey)",
  "Super Cup 2016/2017 (Italy)",
  "Super Cup 2016 (Chile)",
  "SheBelieves Cup 2017 (World)",
  "SheBelieves Cup 2016 (World)",
  "Serie A 2017 (Brazil)",
  "Serie A 2016/2017 (Italy)",
  "Serie A 2015/2016 (Italy)",
  "Serie A 2015 (Brazil)",
  "Segunda División 2016/2017 (Spain)",
  "Segunda División 2015/2016 (Spain)",
  "Pro League 2016/2017 (Saudi Arabia)",
  "Pro League 2015/2016 (Saudi Arabia)",
  "Primera División 2017 (Peru)",
  "Primera División 2016/2017 (Spain)",
  "Primera División 2016/2017 (Chile)",
  "Primera División 2016/2017 (Argentina)",
  "Primera División 2016 (Peru)",
  "Primera División 2015/2016 (Spain)",
  "Primera División 2015/2016 (Chile)",
  "Primera División 2015 (Argentina)",
  "Primera A 2017 (Colombia)",
  "Primera A 2016 (Colombia)",
  "Primera A 2015 (Colombia)",
  "Primeira Liga 2016/2017 (Portugal)",
  "Primeira Liga 2015/2016 (Portugal)",
  "Premier League 2016/2017 (Russia)",
  "Premier League 2016/2017 (England)",
  "Premier League 2015/2016 (Russia)",
  "Premier League 2015/2016 (England)",
  "Premier League 2 (Division 1) 2015/2016 (England)",
  "Play-offs 2/3 2015/2016 (Germany)",
  "Play-offs 1/2 2016/2017 (Netherlands)",
  "Play-offs 1/2 2015/2016 (Germany)",
  "Play-offs 1/2 2014/2015 (Netherlands)",
  "Paulista A1 2016 (Brazil)",
  "Olympics Women 2016 Rio de Janeiro (World)",
  "Olympics 2016 Rio de Janeiro (World)",
  "NWSL 2017 (United States)",
  "NWSL 2016 (United States)",
  "NASL 2017 (United States)",
  "NASL 2016 (United States)",
  "MLS 2017 (United States)",
  "MLS 2016 (United States)",
  "MLS 2015 (United States)",
  "MLS 2014 (United States)",
  "Ligue 2 2016/2017 (France)",
  "Ligue 2 2015/2016 (France)",
  "Ligue 1 2016/2017 (France)",
  "Ligue 1 2015/2016 (France)",
  "Liga MX 2016/2017 (Mexico)",
  "League Two 2016/2017 (England)",
  "League Two 2015/2016 (England)",
  "League One 2016/2017 (England)",
  "League One 2015/2016 (England)",
  "League Cup 2016/2017 (England)",
  "League Cup 2015/2016 (England)",
  "KNVB Beker 2016/2017 (Netherlands)",
  "King's Cup 2017 (Saudi Arabia)",
  "J1 League 2017 (Japan)",
  "J1 League 2016 (Japan)",
  "Indian Super League 2016 (India)",
  "Indian Super League 2015 (India)",
  "Friendlies Women 2017 (World)",
  "Friendlies Women 2016 (World)",
  "Friendlies 2017 (World)",
  "Friendlies 2016 (World)",
  "First Division A 2016/2017 (Belgium)",
  "FFA Cup 2016 (Australia)",
  "FFA Cup 2015 (Australia)",
  "FA Cup 2016/2017 (England)",
  "FA Cup 2015/2016 (England)",
  "European Championship 2016 France (Europe)",
  "Eredivisie 2016/2017 (Netherlands)",
  "Eredivisie 2015/2016 (Netherlands)",
  "Eliteserien 2017 (Norway)",
  "Eliteserien 2016 (Norway)",
  "Eliteserien 2015 (Norway)",
  "EC Qualification 2016 France (Europe)",
  "DFB Pokal 2016/2017 (Germany)",
  "DFB Pokal 2015/2016 (Germany)",
  "Cup 2016/2017 (Turkey)",
  "CSL 2017 (China PR)",
  "CSL 2015 (China PR)",
  "Coupe de la Ligue 2016/2017 (France)",
  "Coupe de France 2016/2017 (France)",
  "Coppa Italia 2016/2017 (Italy)",
  "Coppa Italia 2015/2016 (Italy)",
  "Copa Sudamericana 2017 (South America)",
  "Copa Sudamericana 2016 (South America)",
  "Copa Libertadores 2017 (South America)",
  "Copa Libertadores 2016 (South America)",
  "Copa do Brasil 2017 (Brazil)",
  "Copa do Brasil 2016 (Brazil)",
  "Copa del Rey 2016/2017 (Spain)",
  "Copa del Rey 2015/2016 (Spain)",
  "Copa Chile 2016/2017 (Chile)",
  "Copa America 2016 USA (South America)",
  "CONCACAF Champions League 2016/2017 (N/C America)",
  "Championship 2016/2017 (England)",
  "Championship 2015/2016 (England)",
  "Canadian Championship 2017 (Canada)",
  "CAF Super Cup 2017 (Africa)",
  "CAF Confederation Cup 2017 (Africa)",
  "CAF Confederation Cup 2016 (Africa)",
  "CAF Champions League 2017 (Africa)",
  "CAF Champions League 2016 (Africa)",
  "Bundesliga 2016/2017 (Germany)",
  "Bundesliga 2016/2017 (Austria)",
  "Bundesliga 2015/2016 (Germany)",
  "Bundesliga 2015/2016 (Austria)",
  "Allsvenskan 2017 (Sweden)",
  "Allsvenskan 2016 (Sweden)",
  "Africa Cup of Nations 2017 Gabon (Africa)",
  "AFF Championship 2016 Myanmar/Philippines (Asia)",
  "AFC Champions League 2016 (Asia)",
  "A-League 2015/2016 (Australia)",
  "3. Liga 2016/2017 (Germany)",
  "2017 Poland (Europe)",
  "2017 (United States)",
  "2017 (South America)",
  "2017 (N/C America)",
  "2017 (Colombia)",
  "2017 (Brazil)",
  "2017 (Brazil)",
  "2017 (Brazil)",
  "2017 (Asia)",
  "2016/2017 (Saudi Arabia)",
  "2016/2017 (Netherlands)",
  "2016/2017 (England)",
  "2016/2017 (England)",
  "2016/2017 (England)",
  "2016/2017 (England)",
  "2016/2017 (Australia)",
  "2016/2017 (Argentina)",
  "2016 (World)",
  "2016 (China PR)",
  "2016 (Brazil)",
  "2015/2016 (Netherlands)",
  "2. Bundesliga 2016/2017 (Germany)",
  "2. Bundesliga 2015/2016 (Germany)",
  "1. Liga 2016/2017 (Austria)",
  "1. Liga 2015/2016 (Austria)"
];

test.describe('#Section: Tables', function() {
  test.it('navigating to table page', function() {
    tablePage = new TablePage(driver);
    navbar  = new Navbar(driver);
    navbar.goToTablesPage();
  });

  test.describe('#sorting', function() {
    var columns = [
      { colName: 'pos', sortType: 'ferpNumber', defaultSort: 'asc', initialCol: true },
      { colName: 'GF', sortType: 'ferpNumber', defaultSort: 'desc' },
      { colName: 'L', sortType: 'ferpNumber', defaultSort: 'desc' },
    ]

    columns.forEach(function(column) {
      test.it('sorting by ' + column.colName + ' should sort table accordingly', function() {
        if (!column.initialCol) tablePage.clickTableHeaderFor(column.colName);
        tablePage.waitForTableToLoad();
        tablePage.getTableStatsFor(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortedArray = extensions.customSortByType(column.sortType, stats, column.defaultSort);
          assert.deepEqual(stats, sortedArray);
        })
      });

      test.it('reversing sort for ' + column.colName + ' should sort table accordingly', function() {
        tablePage.clickTableHeaderFor(column.colName);
        tablePage.waitForTableToLoad();
        tablePage.getTableStatsFor(column.colName).then(function(stats) {
          stats = extensions.normalizeArray(stats, column.sortType);
          var sortOrder = column.defaultSort == 'desc' ? 'asc' : 'desc';
          var sortedArray = extensions.customSortByType(column.sortType, stats, sortOrder);
          assert.deepEqual(stats, sortedArray);
        })
      });
    }); 
  });

  test.describe('#seasons', function() {
    SEASONS.forEach(function(season) {
      test.describe('#season: ' + season, function() {
        test.before('resetting page', function() {
          tablePage.isTableDisplayed().then(function(displayed) {
            if(!displayed) {
              navbar.goToTablesPage();
            };
          });
        });

        test.it('going to season: ' + season + ' works', function() {
          tablePage.changeSeason(season);
          tablePage.isTableDisplayed().then(function(displayed) {
            assert.equal(displayed, true);
          });
        });
      });
    });
    
    test.it('changing season to Championship 2015/2016 (England) updates the table correctly', function() {
      tablePage.changeSeason('Championship 2015/2016 (England)');
      tablePage.getTableStatFor(1, 'Team').then(function(stat) {
        assert.equal(stat, 'Burnley', 'row 1 team');
      });

      tablePage.getTableStatFor(1, 'P').then(function(stat) {
        assert.equal(stat, 46, 'row 1 pts');
      });
    });

    test.it('changing season to Primera División 2015/2016 (Spain) updates the table correctly', function() {
      tablePage.changeSeason('Primera División 2015/2016 (Spain)');
      tablePage.getTableStatFor(1, 'Team').then(function(stat) {
        assert.equal(stat, 'Barcelona', 'row 1 team');
      });

      tablePage.getTableStatFor(1, 'P').then(function(stat) {
        assert.equal(stat, 38, 'row 1 pts');
      });
    });
  });
});