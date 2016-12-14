var util = require('../test/util');
var scripts = require('../lib/scripts.js');

// get relevant script
var script = scripts[process.env.TEST_NUMBER]
var title = "["+script.name+"]";

// remove testFiles if necessary
var testFiles = script.testFiles;

if (process.env.FILE_WHITELIST) {
  var testWhitelist = process.env.FILE_WHITELIST.split(",");
  util.generateTests(title, testWhitelist, script.startUrl); 
} else {
  util.generateTests(title, testFiles, script.startUrl); 
}