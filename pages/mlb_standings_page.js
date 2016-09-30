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
  var d = webdriver.promise.defer();

  this.driver.wait(webdriver.until.elementLocated(this.yearPageControl), 10000);
  this.driver.findElement(this.yearPageControl).click();

  var input = this.driver.findElement(this.yearInput);
  input.sendKeys(year);
  input.sendKeys(webdriver.Key.ENTER);
  
  // Can I look for the body to change instead?
  this.driver.wait(webdriver.until.elementLocated(this.yearPageControl), 10000);
  this.driver.findElement(this.yearPageControl).isDisplayed().then(function(displayed) {
    d.fulfill(displayed);
  });
  
  return d.promise;
};

MlbStandingsPage.prototype.changeSeasonLevel = function(seasonLevel) {
  var d = webdriver.promise.defer();

  this.driver.wait(webdriver.until.elementLocated(this.seasonLevelPageControl), 10000);
  this.driver.findElement(this.seasonLevelPageControl).click();

  var input = this.driver.findElement(this.seasonLevelInput);
  input.sendKeys(seasonLevel);
  input.sendKeys(webdriver.Key.ENTER);
  
  this.driver.wait(webdriver.until.elementLocated(this.seasonLevelPageControl), 10000);
  this.driver.findElement(this.seasonLevelPageControl).isDisplayed().then(function(displayed) {
    d.fulfill(displayed);
  });

  return d.promise;
};

module.exports = MlbStandingsPage;