'use strict';

var fs = require('fs');
var TestRun = require('../models/test_run.js');
var constants = require('../lib/constants.js')
var cmd;

module.exports = function(testRun, env) {
  // create directory to store screenshots
  fs.mkdirSync('public/data/'+testRun.id);

  // create system commmand
  // have to set the display on ec2 instance
  cmd = (env == 'development') ? "" : "Xvfb :99 -screen 0 1024x768x24 -ac 2>&1 >/dev/null & export DISPLAY=:99;";
  cmd += "env TEST_RUN_ID=" + testRun.id;
  cmd += ' mocha test/scripts/'
  cmd += (constants.tests[testRun.testNumber].fileName + '.js')

  // execute system command to start mocha test
  var exec = require('child_process').exec;
  exec(cmd, function(error, stdout, stderr) {
    // TODO - if error fail the test
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  });  
};