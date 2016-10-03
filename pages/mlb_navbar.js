var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbNavbar(driver) {
  this.driver = driver;
};

MlbNavbar.prototype.goToStandingsPage = function() {
  var standingsPage = By.css('div.navbar-item-border-left>a')


  return this.driver.findElement(standingsPage).click();
};

MlbNavbar.prototype.goToScoresPage = function() {
  var scoresPage = By.css('header.navbar-tmn>div:nth-child(1)>div:nth-child(4)>a')

  return this.driver.findElement(scoresPage).click();
};

module.exports = MlbNavbar;