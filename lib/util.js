var fs = require('fs-extra')
var express = require('express');
var app = express();
var dbConnect = require('./models/db_connect.js');
dbConnect.connect(app.get('env'));
var TestRun = require('./models/test_run.js');
var oneDay = 1000*60*60*24

exports.removeOldTestRuns = function(days) {
  days = days || 1;
  var currentTime = new Date().getTime()
  var timeThreshold = currentTime - oneDay

  TestRun.find({
    startedAt: {$lt: timeThreshold}
  }).exec(function(err, testRuns) {
    testRuns.forEach(function(testRun) {
      var id = testRun.id;
      console.log(id)
      testRun.remove();

      fs.remove('/public/data/'+testRun.id, function (err) {
        if (err) return console.error(err)

        console.log('success!')
      })
    })
  })  
}

exports.killChromeInstances = function() {
  cmd = 'pkill -f chrome;'
  cmd += 'pkill Xvfb;'
  cmd += 'pkill -f node;'
  cmd += 'Xvfb :99 -screen 0 1920x3000x8 -ac 2>&1 >/dev/null & export DISPLAY=:99;';
  cmd += 'pm2 restart app.js;'
  var exec = require('child_process').exec;

  exec(cmd, function(error, stdout, stderr) {
    console.log('** child_process callback START **');
    console.log(error);
    console.log(stderr);
    console.log(stdout);
    console.log('** child_process callback END **');
  })
}