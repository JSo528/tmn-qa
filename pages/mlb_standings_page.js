var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbStandingsPage(driver) {
  this.driver = driver;
  this.bodyTag = By.tagName('body');

  this.navbar = By.className('navbar-tmn');

  this.yearPageControl = By.id('s2id_pageControlBaseballYear');
  this.yearInput = By.id('s2id_autogen1_search');
  
  this.seasonLevelPageControl = By.id('s2id_pageControlBaseballSeasonLevelSingle');
  this.seasonLevelInput = By.id('s2id_autogen2_search');

  this.firstTeam = By.css("div[id='tableBaseballStandingsAL EastContainer']>table>tbody>tr:nth-child(2)>td:nth-child(1)>a")
};

// Methods
MlbStandingsPage.prototype.navbarDisplayed = function() {
  var d = webdriver.promise.defer();
  this.driver.findElement(this.navbar).isDisplayed().then(function(displayed) {
    d.fulfill(displayed);
  });
  return d.promise;
};

MlbStandingsPage.prototype.changeYear = function(year) {
  this.driver.wait(webdriver.until.elementLocated(this.yearPageControl), 10000);
  this.driver.findElement(this.yearPageControl).click();

  var input = this.driver.findElement(this.yearInput);
  input.sendKeys(year);
  return input.sendKeys(webdriver.Key.ENTER);
};

MlbStandingsPage.prototype.changeSeasonLevel = function(seasonLevel) {
  this.driver.wait(webdriver.until.elementLocated(this.seasonLevelPageControl), 10000);
  this.driver.findElement(this.seasonLevelPageControl).click();

  var input = this.driver.findElement(this.seasonLevelInput);
  input.sendKeys(seasonLevel);
  
  return input.sendKeys(webdriver.Key.ENTER);
};

MlbStandingsPage.prototype.getFirstTeamName = function() {
  var d = webdriver.promise.defer();
  this.driver.findElement(this.firstTeam).getText().then(function(text) {
    d.fulfill(text);
  })
  return d.promise;
};

module.exports = MlbStandingsPage;