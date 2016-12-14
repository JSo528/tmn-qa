'use strict';

var fs = require('fs');
var TestRun = require('../models/test_run.js');
var constants = require('../lib/constants.js');
var cmd;

module.exports = function(testRun, env) {
  // create directory to store screenshots
  fs.mkdirSync('public/data/'+testRun.id);

  // enable Xvfb for production
  if (env == 'production') {
    cmd = 'Xvfb :99 -screen 0 1920x3000x8 -ac 2>&1 >/dev/null & export DISPLAY=:99;';
    var exec = require('child_process').exec;

    exec(cmd, function(error, stdout, stderr) {
      console.log('** child_process callback START **');
      console.log(error);
      console.log(stderr);
      console.log(stdout);
      console.log('** child_process callback END **');
    })
  }

  testRun.update({status: 'ongoing', startedAt: new Date().getTime()}).exec();

  // spawn child process to run mocha
  var spawn = require('child_process').spawn;
  var args = [
    "-gc",
    'test/run_script'
  ]
  var envVars = Object.create( process.env );
  envVars.NODE_ENV = env;
  envVars.TEST_NUMBER = testRun.testNumber;
  envVars.PORT_NUMBER = testRun.portNumber;
  envVars.TEST_RUN_ID = testRun.id;
  envVars.FILE_WHITELIST = testRun.fileWhitelist;
  
  var cp = spawn('mocha', args, {env: envVars})

  // child process callbacks
  cp.stdout.on('data', (data) => {
    console.log(`${data}`)
  });

  cp.stderr.on('data', (data) => {
    console.log("*******")
    console.log("** STDERR **")
    console.log("*******")
    console.log(`*** stderr: ${data}`);
  });

  cp.on('close', (code) => {
    console.log(`child process closed with code ${code}`);
    TestRun.findById(testRun.id, function(err, testRunObject) {
      testRun = testRunObject;
      if (testRun.endedAt == undefined && testRun.status == "ongoing") {
        testRun.update({endedAt: new Date().getTime(), status: "error"}).exec();
      }
    })
  });

  cp.on('exit', (code, signal) => {
    console.log(`child process exited with code ${code} & signal ${signal}`);
  })
};