var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbScoresPage(driver) {
  this.driver = driver;

  this.dateInput = By.id('pageControlBaseballGameDate');
  this.seasonLevelPageControl = By.id('s2id_pageControlBaseballSeasonLevelSingle');
  this.seasonLevelInput = By.id('s2id_autogen1_search');

  this.bodyTag = By.tagName('body');
  this.calendar = By.className('pika-single');
};

// boxScoreNum is the 1st, 2nd, 3rd, etc. box score on the page
// boxScoreNum=1 -> 1st box score on the page
MlbScoresPage.prototype.getBoxScoreDatetime = function(boxScoreNum) {
  var d = webdriver.promise.defer();
  var boxScore = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row box-score-header-final']/div[@class='col-md-6']/h5`)

  this.driver.findElement(boxScore).getText().then(function(datetimeText) {
    d.fulfill(datetimeText);
  });
  return d.promise;
}

// homeOrAway takes in "home" or "away" string. Anything other than "home" input will result in "away"
MlbScoresPage.prototype.getBoxScoreRunsForInning = function(boxScoreNum, homeOrAway, inning) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  inning += 1

  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table[@class='table table-box-scores']/tbody/tr[${team}]/td[${inning}]`)
  this.driver.findElement(element).getText().then(function(runs) {
    d.fulfill(runs);
  });
  return d.promise;
}

MlbScoresPage.prototype.getBoxScoreTotalRuns = function(boxScoreNum, homeOrAway) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table[@class='table table-box-scores']/tbody/tr[${team}]/td[12]`)
  this.driver.findElement(element).getText().then(function(runs) {
    d.fulfill(runs);
  });
  return d.promise;
}

MlbScoresPage.prototype.getBoxScoreRowColor = function(boxScoreNum, homeOrAway) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2

  
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][1]/table[@class='table table-box-scores']/tbody/tr[${team}]`)
  this.driver.findElement(element).getCssValue('background-color').then(function(color) {
    d.fulfill(color);
  });
  return d.promise;
}

MlbScoresPage.prototype.getBoxScorePitcher = function(boxScoreNum,type) {
  var linkNum; 
  switch (type) {
    case "win":
      linkNum = 1;
      break;
    case "lose":
      linkNum = 2;
      break;
    case "save":
      linkNum = 3;
      break
    default: 
      linkNum = 1;
  }

  var d = webdriver.promise.defer();
  var element = By.xpath(`.//div[@class='col-md-5 box-score'][${boxScoreNum}]/div[@class='row'][2]/div[@class='col-md-12']/a[${linkNum}]`)
  this.driver.findElement(element).getText().then(function(pitcher) {
    d.fulfill(pitcher);
  });
  return d.promise;  
}

MlbScoresPage.prototype.changeDate = function(date) {
  this.driver.wait(webdriver.until.elementLocated(this.dateInput));
  var input = this.driver.findElement(this.dateInput);
  input.click();
  this.driver.wait(webdriver.until.elementLocated(this.calendar));
  input.clear();
  input.sendKeys(date);
  return input.sendKeys(webdriver.Key.ENTER);
};

MlbScoresPage.prototype.changeSeasonLevel = function(seasonLevel) {
  this.driver.wait(webdriver.until.elementLocated(this.seasonLevelPageControl));
  this.driver.findElement(this.seasonLevelPageControl).click();

  var input = this.driver.findElement(this.seasonLevelInput);
  input.sendKeys(seasonLevel);
  
  return input.sendKeys(webdriver.Key.ENTER);
}

module.exports = MlbScoresPage;