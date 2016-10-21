var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../../lib/constants.js');
  
test.describe('#Staging Data', function() {
  test.before(function() {
    prodDriver = new webdriver.Builder().withCapabilities({'browserName': 'chrome'}).build();
    prodUrl = constants.urls.mlb.dodgers;
    
    var LoginPage = require('../../pages/login_page.js');
    prodLoginPage = new LoginPage(prodDriver);

    prodLoginPage.visit(prodUrl);
    prodLoginPage.login(constants.testUser.email, constants.testUser.password);


    var StandingsPage = require('../../pages/mlb/standings_page.js');
    standingsPage = new StandingsPage(driver);
    navbar.goToStandingsPage();

    prodStandingsPage = new StandingsPage(prodDriver);
  });

  test.it('standings page shows the same team in 1st place', function() {
    var stagData, prodData;
    Promise.all([
      standingsPage.getTeamName(constants.divisions.al_east, 1).then(function(teamName) {
        stagData = teamName;
      }),
      prodStandingsPage.getTeamName(constants.divisions.al_east, 1).then(function(teamName) {
        prodData = teamName;
      })
    ]).then(function() {
      assert.equal( stagData, prodData );
    });
  });

  test.it('standings page shows the same # of puthW for 1st place team', function() {
    var stagData, prodData;
    Promise.all([
      standingsPage.getPythWins(constants.divisions.al_east, 1).then(function(teamName) {
        stagData = teamName;
      }),
      prodStandingsPage.getPythWins(constants.divisions.al_east, 1).then(function(teamName) {
        prodData = teamName;
      })
    ]).then(function() {
      assert.equal( stagData, prodData );
    });
  });  

  test.after(function() {
    prodDriver.quit();
  });
});