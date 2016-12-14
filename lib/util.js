var fs = require('fs-extra')
var express = require('express');
var app = express();
var dbConnect = require('./../models/db_connect.js');
var TestRun = require('./../models/test_run.js');
var oneDay = 1000*60*60*24

exports.removeOldTestRuns = function(days) {
  days = days || 1;
  var currentTime = new Date().getTime();
  var timeThreshold = currentTime - (oneDay * days);

  TestRun.find({
    startedAt: {$lt: timeThreshold}
  }).exec(function(err, testRuns) {
    if (err) {
      console.log("** Error: " + err)
    } else {
      testRuns.forEach(function(testRun) {
        var id = testRun.id;
        console.log("removing: testRun#"+id);
        testRun.remove();

        fs.remove('./public/data/'+testRun.id, function (err) {
          if (err) return console.error(err);
        })
      })
    }
  })  
};

exports.killChromeInstances = function() {
  cmd = 'pkill -f chrome;'
  cmd += 'pkill -f node;'
  cmd += 'pm2 restart app;'
  var exec = require('child_process').exec;

  exec(cmd, function(error, stdout, stderr) {
    console.log('** child_process callback START **');
    console.log(error);
    console.log(stderr);
    console.log(stdout);
    console.log('** child_process callback END **');
  })
}