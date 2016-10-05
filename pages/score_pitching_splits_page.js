var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function ScorePitchingSplitsPage(driver) {
  this.driver = driver;

  this.filterSelect = By.id('s2id_filterBaseballPitcherForGame');
  this.filterInput = By.id('s2id_autogen48_search');
};

ScorePitchingSplitsPage.prototype.getPitchingSplitStat = function(playerNum, tableNum, row, col) {
  // row input starts from 'Total' Row
  var outerRow = (playerNum - 1) * 7  + tableNum + 4;
  var innerRow = row + 3
  var selector = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${outerRow}]/div/table/tbody/tr[${innerRow}]/td[${col}]`)
  
  var d = webdriver.promise.defer();

  this.driver.wait(webdriver.until.elementLocated(selector));
  this.driver.findElement(selector).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;  
}

ScorePitchingSplitsPage.prototype.getPitcherName = function(playerNum) {
  var row = (playerNum - 1) * 7 + 4;  
  var selector = By.xpath(`.//div[@id='pad-wrapper']/div[2]/div/div[@class='row'][${row}]/div/h1`)
  
  var d = webdriver.promise.defer();

  this.driver.wait(webdriver.until.elementLocated(selector));
  this.driver.findElement(selector).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;  
}


// specific method for pitcher dropdown filter
ScorePitchingSplitsPage.prototype.addPitcherFilter = function(pitcher) {
  var thiz = this;
  this.driver.wait(webdriver.until.elementLocated(this.filterSelect)).then(function() {
    var selectElement = thiz.driver.findElement(thiz.filterSelect);
    selectElement.click();

    thiz.driver.wait(webdriver.until.elementLocated(thiz.filterInput));
    var inputElement = thiz.driver.findElement(thiz.filterInput);
    inputElement.sendKeys(pitcher);

    return inputElement.sendKeys(webdriver.Key.ENTER);  
  })
}



module.exports = ScorePitchingSplitsPage;