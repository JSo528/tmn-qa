var webdriver = require('selenium-webdriver');
var By = webdriver.By;

function MlbDetailedScorePage(driver) {
  this.driver = driver;

  this.filterSelect = By.id('s2id_addFilter');
  this.filterInput = By.id('s2id_autogen1_search');
  // this.awayTable = By.id('tableBaseballGamePlayerBattingStatsAwayTables');
  // this.homeTable = By.id('tableBaseballGamePlayerBattingStatsHomeTables');

  this.awayTable = By.xpath(".//div[@id='content']/div/div[2]/div/div[@class='row'][4]");
  this.homeTable = By.xpath(".//div[@id='content']/div/div[2]/div/div[@class='row'][5]");

  this.updateButton = By.className('update');
  // this.reportSelect = By.id('s2id_reportNavBaseballTeamStatBatting');
  this.reportSelect = By.className("select2-choice")
  this.reportInput = By.xpath(".//div[@id='select2-drop']/div/input");
};

// Section Tabs & Report Dropdown
MlbDetailedScorePage.prototype.goToSection = function(section) {
  var linkNum; 
  switch (section) {
    case "Batting":
      linkNum = 1;
      break;
    case "Pitching":
      linkNum = 2;
      break;
    case "Pitch By Pitch":
      linkNum = 3;
      break
    case "Pitching Splits":
      linkNum = 4;
      break      
    default: 
      linkNum = 1;
  }

  var section = By.xpath(`.//div[@class='navbar-header']/ul/li[${linkNum}]/a`);

  this.driver.wait(webdriver.until.elementLocated(section));
  var element = this.driver.findElement(section);
  return element.click();
}

MlbDetailedScorePage.prototype.changeReport = function(report) {
  // TODO - look into calling - waitForTablesToFinishLoading
  // this.waitForTablesToFinishLoading();
  this.driver.wait(webdriver.until.elementLocated(this.reportSelect));
  var selectElement = this.driver.findElement(this.reportSelect);
  selectElement.click();

  this.driver.wait(webdriver.until.elementLocated(this.reportInput));
  var inputElement = this.driver.findElement(this.reportInput);
  inputElement.sendKeys(report);

  return inputElement.sendKeys(webdriver.Key.ENTER);  
  // return this.waitForTablesToFinishLoading();
}

// Filters
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

MlbDetailedScorePage.prototype.toggleSidebarFilter = function(filterName, selection) {
  var selector = By.xpath(`.//div[@id='common']/div/div/div[@class='row'][div[@class='col-md-4 filter-modal-entry-label']/h5[contains(text()[1], '${filterName}')]]/div[@class='col-md-8']/div/div/label[${selection}]`)
  this.driver.wait(webdriver.until.elementLocated(selector));
  var element = this.driver.findElement(selector);
  element.click();
  return this.waitForTablesToFinishLoading();
};

MlbDetailedScorePage.prototype.closeDropdownFilter = function(filterNum) {
  var dropdownFilter = By.xpath(`.//div[@class='col-md-8 activated']/div[${filterNum}]/div[@class='filter-header text-left']/span[@class='closer fa fa-2x fa-times-circle pull-right']`);
  var element = this.driver.findElement(dropdownFilter);
  element.click();
  var updateElement = this.driver.findElement(this.updateButton);
  updateElement.click();
  return this.waitForTablesToFinishLoading();
};


// Get Stat
MlbDetailedScorePage.prototype.getBoxScoreTotalHits = function(homeOrAway) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//table[@class='table table-box-scores']/tbody/tr[${team}]/td[13]`)

  return this.getStat(element);
}

MlbDetailedScorePage.prototype.getTeamBattingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamBattingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);

  return this.getStat(element);
}

MlbDetailedScorePage.prototype.getPlayerBattingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerBattingStatsHomeContainer' : 'tableBaseballGamePlayerBattingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);

  return this.getStat(element);
};

MlbDetailedScorePage.prototype.getTeamPitchingStat = function(homeOrAway, col) {
  var team = homeOrAway == "home" ? 2 : 1
  var element = By.xpath(`.//div[@id='tableBaseballGameTeamPitchingStatsContainer']/table/tbody/tr[${team}]/td[${col}]`);

  return this.getStat(element);
}

MlbDetailedScorePage.prototype.getPlayerPitchingStat = function(homeOrAway, row, col) {
  var tableID = (homeOrAway == "home") ? 'tableBaseballGamePlayerPitchingStatsHomeContainer' : 'tableBaseballGamePlayerPitchingStatsAwayContainer';     
  var element = By.xpath(`.//div[@id='${tableID}']/table/tbody/tr[${row}]/td[${col}]`);

  return this.getStat(element);
};

// Helper
MlbDetailedScorePage.prototype.waitForTablesToFinishLoading = function() {
  // TODO - look into how the ordering of promises works
  // Do I need to chain thens instead of having a bunch of promises?
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.homeTable), "Loading"), 15000).catch(function(err) {
    console.log(err)
  })
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.awayTable), "Player"), 15000)
  this.driver.wait(webdriver.until.elementTextContains(this.driver.findElement(this.homeTable), "Player"), 15000)
  
  return webdriver.promise.fulfilled(true);
};

MlbDetailedScorePage.prototype.getStat = function(element) {
  var d = webdriver.promise.defer();

  this.driver.wait(webdriver.until.elementLocated(element));
  this.driver.findElement(element).getText().then(function(stat) {
    d.fulfill(stat);
  });
  return d.promise;
}

module.exports = MlbDetailedScorePage;