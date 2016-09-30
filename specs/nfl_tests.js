var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var constants = require('../lib/constants.js');

var LoginPage = require('../pages/login_page.js');
var driver, url, loginPage;

test.describe('NFL Site', function() {
  this.timeout(constants.timeOuts.mocha);
  
  test.before(function() {
    driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
    url = constants.urls.nfl.fortyNiners;
    loginPage = new LoginPage(driver, url);
  });

  test.it('starts at login page', function() {
    loginPage.visit();
    driver.getTitle().then(function(title) {
      assert.equal( title, "FERP", 'Correct Title' );
    });
  })

  test.it('able to login', function() {
    loginPage.login(constants.testUser.email, constants.testUser.password);
    driver.getTitle().then(function(title) {
      assert.equal( title, "Standings", 'Correct Title');
    });
  })

  test.afterEach(function() {
    driver.manage().deleteAllCookies();
  });
   
  test.after(function() {
    driver.quit();
  });
});
 
