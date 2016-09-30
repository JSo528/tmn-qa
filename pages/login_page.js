var webdriver = require('selenium-webdriver');
var By = webdriver.By;

LoginPage = function LoginPage(driver, url) {
  this.driver = driver;
  this.url = url;
  this.usernameField = By.id('username');
  this.passwordField = By.id('password');
  this.loginButton = By.id('login');
  this.bodyTag = By.tagName('body');
};

LoginPage.prototype.visit = function() {
    this.driver.get(this.url);
    return webdriver.promise.fulfilled(true);
};

LoginPage.prototype.submitCredentials = function(email, password) {
  this.driver.findElement(this.usernameField).sendKeys(email);
  this.driver.findElement(this.passwordField).sendKeys(password);
  this.driver.findElement(this.loginButton).click();
  this.driver.wait(webdriver.until.stalenessOf(this.driver.findElement(this.bodyTag)), 60000);

  return webdriver.promise.fulfilled(true);
};

module.exports = LoginPage;