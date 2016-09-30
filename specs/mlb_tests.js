var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../lib/constants.js');

var LoginPage = require('../pages/login_page.js');
var MlbStandingsPage = require('../pages/mlb_standings_page.js');
var driver, url, loginPage, standingsPage;

test.describe('MLB Site', function() {
  this.timeout(constants.timeOuts.mocha);  

  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
  });

  // Login Page
  test.describe('#Login Page', function() {
    test.before(function() {
      url = constants.urls.mlb.dodgers;
      loginPage = new LoginPage(driver, url);
    });

    test.it('starts at login page', function() {
      loginPage.visit();
      driver.getTitle().then(function(title) {
        assert.equal( title, "FERP", 'Correct Title' );
      });
      driver.getCurrentUrl().then(function(url) {
        assert.match(url, /auth\/loginPage/, 'Correct URL')
      });
    })

    test.it('able to login', function() {
      loginPage.submitCredentials(constants.testUser.email, constants.testUser.password);
      driver.getCurrentUrl().then(function(url) {
        assert.notMatch(url, /auth\/loginPage/, 'Correct URL')
      })
    })
  })

  // Home/Standings Page
  test.describe('#Standings Page', function() {
    test.before(function() {
      standingsPage = new MlbStandingsPage(driver);
    });

    test.it('at standings page', function() {
      driver.getTitle().then(function(title) {
        assert.equal( title, "Standings", 'Correct Title' );
      });
    })

    test.it('navbar is displayed', function() {
      standingsPage.navbarDisplayed().then(function(displayed) {
        assert.equal( displayed, true, 'Navbar Displayed');
      });
    });
  }); 
  
  test.afterEach(function() {
      driver.manage().deleteAllCookies();
  });
   
  test.after(function() {
      driver.quit();
  });  
});
 
