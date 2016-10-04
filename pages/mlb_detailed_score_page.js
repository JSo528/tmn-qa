var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbDetailedScorePage(driver) {
  this.driver = driver;

  this.filterSelect = By.id('s2id_addFilter');
  this.filterInput = By.id('s2id_autogen1_search');
  this.awayTable = By.id('tableBaseballGamePlayerBattingStatsAwayTables');
  this.homeTable = By.id('tableBaseballGamePlayerBattingStatsHomeTables');
  this.updateButton = By.className('update');
};

MlbDetailedScorePage.prototype.getBoxScoreTotalHits = function(homeOrAway) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  
  var element = By.xpath(`.//table[@class='table table-box-scores']/tbody/tr[${team}]/td[13]`)
  this.driver.findElement(element).getText().then(function(hits) {
    d.fulfill(hits);
  });
  return d.promise;
}

MlbDetailedScorePage.prototype.getTeamBattingStat = function(homeOrAway, col) {
  var d = webdriver.promise.defer();
  var team = homeOrAway == "home" ? 1 : 2
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;
}

MlbDetailedScorePage.prototype.getPlayerBattingStat = function(homeOrAway, row, col) {
  var d = webdriver.promise.defer();
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;
};


MlbDetailedScorePage.prototype.addDropdownFilter = function(filter) {
  this.driver.wait(webdriver.until.elementLocated(this.filterSelect));
  var selectElement = this.driver.findElement(this.filterSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.filterInput));
  var inputElement = this.driver.findElement(this.filterInput);
  inputElement.sendKeys(filter);

  inputElement.sendKeys(webdriver.Key.ENTER);  
  return this.waitForTablesToFinishLoading();
};

MlbDetailedScorePage.prototype.addSidebarFilter = function(filterName, selection) {
  var selector = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector);
  element.click();
  return this.waitForTablesToFinishLoading();
};

MlbDetailedScorePage.prototype.waitForTablesToFinishLoading = function() {
  // TODO - look into how the ordering of promises works
  // Do I need to chain thens instead of having a bunch of promises?
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.homeTable), "Loading"), 10000);
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.awayTable), "Player"), 10000);
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.homeTable), "Player"), 10000);
  
  return webdriver.promise.fulfilled(true);
};

MlbDetailedScorePage.prototype.closeDropdownFilter = function(filterNum) {
  var dropdownFilter = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  var element = this.driver.findElement(dropdownFilter);
  element.click();
  var updateElement = this.driver.findElement(this.updateButton);
  updateElement.click();
  return this.waitForTablesToFinishLoading();
};

module.exports = MlbDetailedScorePage;