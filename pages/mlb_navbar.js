var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbNavbar(driver) {
  this.driver = driver;

  this.standingsLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][0]/a`);
  this.scoresLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][1]/a`);
  this.teamsLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][2]/a`);
  this.playersLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][3]/a`);
  this.umpiresLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][4]/a`);
  this.groupsLink = By.xpath(`.//div[@class='navbar-item-fancy-pants navbar-item-border-right'][5]/a`);
};

MlbNavbar.prototype.goToStandingsPage = function() {
  this.driver.wait(webdriver.until.elementLocated(this.standingsLink));
  return this.driver.findElement(this.standingsLink).click();
};

MlbNavbar.prototype.goToScoresPage = function() {
  this.driver.wait(webdriver.until.elementLocated(this.scoresLink));
  return this.driver.findElement(this.scoresLink).click();
};

MlbNavbar.prototype.goToTeamsPage = function() {
  this.driver.wait(webdriver.until.elementLocated(this.teamsLink));
  return this.driver.findElement(this.teamsLink).click();
};

module.exports = MlbNavbar;