var By = require('selenium-webdriver').By;
var Promise = require('selenium-webdriver').promise;
var Until = require('selenium-webdriver').until;

OccurrencesAndStreaks = {

  /****************************************************************************
  ** Locators
  *****************************************************************************/
  DROPDOWN_INPUT: By.xpath(".//div[@id='select2-drop']/div[@class='select2-search']/input"),
  STREAK_TYPE_SELECT: By.id('s2id_pageControlFootballStrkType'),
  CONSTRAINT_COMPARE_SELECT: By.id('s2id_pageControlFootballStrkConstraintCompare'),
  CONSTRAINT_VALUE_INPUT: By.id('pageControlFootballStrkConstraintValue'),
  DEFAULT_CONSTRAINT_STAT_SELECT: By.id('s2id_pageControlFootballStrkConstraintStatZebra'),
  DEFAULT_STREAK_GROUPING_SELECT: By.id('s2id_pageControlFootballStrkGrouping'),
  STREAK_SCOPE_SELECT: By.id('s2id_pageControlFootballStrkScope'),
  UPDATE_CONSTRAINTS_BUTTON: By.id('pageControlFootballStrkBtnUpdate'),
  
  /****************************************************************************
  ** Functions
  *****************************************************************************/
  changeMainConstraint: function(streakType, constraintCompare, constraintValue, constraintStat, streakGrouping, streakScope) {
    this.changeDropdown(this.STREAK_TYPE_SELECT, this.DROPDOWN_INPUT, streakType);
    this.changeDropdown(this.CONSTRAINT_COMPARE_SELECT, this.DROPDOWN_INPUT, constraintCompare);
    this.clear(this.CONSTRAINT_VALUE_INPUT)
    this.sendKeys(this.CONSTRAINT_VALUE_INPUT, constraintValue);
    this.changeDropdown(this.constraintStatSelect(), this.DROPDOWN_INPUT, constraintStat);
    this.changeDropdown(this.streakGroupingSelect(), this.DROPDOWN_INPUT, streakGrouping);
    this.changeDropdown(this.STREAK_SCOPE_SELECT, this.DROPDOWN_INPUT, streakScope);
    return this.click(this.UPDATE_CONSTRAINTS_BUTTON);
  },
  // override this in each module
  constraintStatSelect: function() {
    return this.DEFAULT_CONSTRAINT_STAT_SELECT;
  },
  streakGroupingSelect: function() {
    return this.DEFAULT_STREAK_GROUPING_SELECT;
  }
}

module.exports = OccurrencesAndStreaks;