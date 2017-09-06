var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');

// Page Objects
var Navbar = require('../../pages/nfl_scouting/navbar.js');
var Filters = require('../../pages/nfl_scouting/filters.js');
var ReportSearchPage = require('../../pages/nfl_scouting/reports/search_page.js');
var PlayerSearchPage = require('../../pages/nfl_scouting/players/search_page.js');
var navbar, filters, playerSearchPage, reportSearchPage;

test.describe('#Feature: CSV Exports', function() {
  test.before(function() {
    navbar = new Navbar(driver);
    filters = new Filters(driver);
    playerSearchPage = new PlayerSearchPage(driver);
    reportSearchPage = new ReportSearchPage(driver);
  });
  
  test.describe('#Section: PlayersSearch', function() {
     test.it('clicking export csv exports csv file', function() {
      navbar.goToPlayersSearchPage();
      playerSearchPage.addPlayersFilter('Balance');
      filters.changeRangeFilter('Balance', 7, 9);
      playerSearchPage.clickPlayersExportButton();
    });

    test.it('csv file should have the correct data', function() {
      var exportFileContents = 'Jersey,Last Name,First Name,Pos,Height,Weight,Speed/n27,CHUBB,NICHOLAS,oh,5105v,228v,4.5e/n4,Cook,Dalvin,rb,5103,210,4.48/n25,Duncan,Jela,rb,5100,215,4.65e/n7,Fournette,Leonard,rb,6004,240,4.5/n8,HICKS,JOSHUA,oh,5092v,205v,4.7e/n3,HUNT,KAREEM,oh,5104,216,4.55/n5,McCaffrey,Christian,rb,5112,202,4.46/n32,Perine,Samaje,rb,5105,233,4.61/n19,PUMPHREY,DONNEL,oh,5082,176,4.4/n';
      return playerSearchPage.readAndDeletePlayersExportCSV().then(function(data) {
        assert.equal(data, exportFileContents);
      });
    });
  });

  test.describe('#Section: ReportsSearch', function() {
    test.it('clicking export csv exports csv file', function() {
      navbar.goToReportsSearchPage();
      reportSearchPage.addReportsFilter('Run Game');
      filters.changeRangeFilter('Run Game', 8, 9);
      reportSearchPage.clickReportsExportButton();
    });

    test.it('csv file should have the correct data', function() {
      var exportFileContents = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent,Day Phone/n10,APODACA,AUSTIN,QB,NMUN,6030,212,5.10e,,/n15,BAILEY,AARON,QB,IANO,6005v,230v,4.55e,,/n2,CONQUE,ZACHARY,QB,TXSF,6050v,235v,4.90e,,/n,EASTON,DALTON,QB,RIBT,6000,192,5.00e,,/n9,EVANS,DANE,QB,OKTU,6010,210,5.00e,,/n,FERGUSON,TYLER,QB,KYWE,6040,225,4.95e,,/n13,HOUSTON,BARTLETT,QB,WIUN,6031v,234v,4.95e,,/n7,JENKINS,ELIJAH,QB,ALJA,6007v,206v,4.85e,,/n19,NELSON,JACK,QB,MNWI,6036v,236v,4.87v,,/n14,NORVELL,TRENTON,QB,ILWE,6050,225,4.95e,,/n7,O\'CONNOR,TYLER,QB,MIST,6010e,220e,4.95e,,/n,SPOONER,QADR,QB,CNMG,6000,192,5.00e,,/n18,SWOOPES,TYRONE,QB,TXUN,6034e,230e,4.80e,,/n,WINDHAM,GREG,QB,OHUN,6010,215,5.00e,,/n';
      return reportSearchPage.readAndDeleteReportsExportCSV().then(function(data) {
        assert.equal(data, exportFileContents);
      });
    });
  });

  test.describe('#Section: Teams', function() {
    test.it('clicking export csv exports csv file', function() {
      navbar.goToTeamsPage();
      teamsPage.clickExportButton();
    });

    test.it('csv file should have the correct headers', function() {
      var exportFileHeaders = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent,Day Phone';
      
      return reportSearchPage.readAndDeleteReportsExportCSV().then(function(data) {
        var dataHeaders = data.split(/\/n/)[0]
        assert.equal(dataHeaders, exportFileContents, 'headers are the same');
      });
    });
  });

  test.describe('#Section: Pro Teams', function() {
    test.it('clicking export csv exports csv file', function() {
      browser.visit(url+'team/1147');
      teamPage.clickExportButton();
    });

    test.it('csv file should have the correct headers', function() {
      var exportFileHeaders = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent,Day Phone';
      
      return reportSearchPage.readAndDeleteReportsExportCSV().then(function(data) {
        var dataHeaders = data.split(/\/n/)[0]
        assert.equal(dataHeaders, exportFileContents, 'headers are the same');
      });
    });
  });

  test.describe('#Section: College Teams', function() {
    test.it('clicking export csv exports csv file', function() {
      browser.visit(url+'team/41');
      teamPage.clickExportButton();
    });

    test.it('csv file should have the correct headers', function() {
      var exportFileHeaders = 'Jersey,Last Name,First Name,Pos,Team Code,Height,Weight,Speed,Agent,Day Phone';
      
      return reportSearchPage.readAndDeleteReportsExportCSV().then(function(data) {
        var dataHeaders = data.split(/\/n/)[0]
        assert.equal(dataHeaders, exportFileContents, 'headers are the same');
      });
    });
  });
});