var webdriver = require('selenium-webdriver');
var By = webdriver.By;

MlbStandingsPage = function MlbStandingsPage(driver) {
  this.driver = driver;
  this.navbar = By.className('navbar-tmn');
};

MlbStandingsPage.prototype.navbarDisplayed = function() {
    var d = webdriver.promise.defer();
    this.driver.findElement(this.navbar).isDisplayed().then(function(displayed) {
      d.fulfill(displayed);
    });
    return d.promise;
};

module.exports = MlbStandingsPage;