var test = require('selenium-webdriver/testing');
var util = require('../../test/util');

test.describe('Test Run', function() {
  util.importTestSetup(this);

  test.before(function() {    
    var Navbar = require('../../pages/mlb/navbar.js');
    navbar = new Navbar(driver);
    url = 'https://dodgers.trumedianetworks.com';
  });

  util.importTest("LoginPage", './mlb/login_page');
  util.importTest("TestPage", './mlb/test_page');
});
 