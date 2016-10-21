var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');
var chai = require('chai');
var assert = chai.assert;
var credentials = require('../../lib/credentials.js');

test.describe('#Login Page', function() {
  test.before(function() {
    var LoginPage = require('../../pages/login_page.js');
    loginPage = new LoginPage(driver);
  });

  test.it('starts at login page', function() {
    loginPage.visit(url);
    
    driver.getCurrentUrl().then(function(url) {
      assert.match(url, /auth\/loginPage/, 'Correct URL');
    });
  });

  test.it('able to login', function() {
    loginPage.login(credentials.testUser.email, credentials.testUser.password);
    driver.getCurrentUrl().then(function(url) {
      assert.notMatch(url, /auth\/loginPage/, 'Correct URL');
    });
  });
});