var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbNavbar(driver) {
  this.driver = driver;

  this.standingsLink = By.css('div.navbar-item-border-left>a');
  this.scoresLink = By.css('header.navbar-tmn>div:nth-child(1)>div:nth-child(4)>a');
};

MlbNavbar.prototype.goToStandingsPage = function() {
  this.driver.wait(webdriver.until.elementLocated(this.standingsLink));
  return this.driver.findElement(this.standingsLink).click();
};

MlbNavbar.prototype.goToScoresPage = function() {
  this.driver.wait(webdriver.until.elementLocated(this.scoresLink));
  return this.driver.findElement(this.scoresLink).click();
};

module.exports = MlbNavbar;