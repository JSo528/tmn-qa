'use strict';

var fs = require('fs');
var TestRun = require('../models/test_run.js');
var constants = require('../lib/constants.js');
var cmd;

module.exports = function(testRun, env) {
  // create directory to store screenshots
  fs.mkdirSync('public/data/'+testRun.id);

  // create system commmand
  cmd = 'env TEST_RUN_ID=' + testRun.id;
  if (testRun.portNumber) {
    cmd += ' PORT_NUMBER='+ testRun.portNumber;
  }
  cmd += ' mocha test/scripts/';
  cmd += (constants.tests[testRun.testNumber].fileName + '.js');

  // execute system command to start mocha test
  var exec = require('child_process').exec;
  exec(cmd, function(error, stdout, stderr) {
    console.log('** child_process callback START **');
    console.log('** child_process error: **');
    console.log(error);
    console.log('** child_process stderr: **');
    console.log(stderr);
    console.log('** child_process stdout: **');
    console.log(stdout);
    console.log('** child_process callback END **');
    // using stderr instead of error, bc error returns true for any failing test
    if (stderr) {
      testRun.update({status: 'error'}).exec();
    }
  });  
};