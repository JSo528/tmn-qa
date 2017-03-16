var Job = require('./job.js');

var express = require('express');
var app = express();
var dbConnect = require('./db_connect.js');
dbConnect.connect(app.get('env'));

// 9AM GMT every day
var job = new Job({
  name: 'Run NFL Scouting',
  enabled: true,
  cronPattern: '0 9 * * *',
  functionName: 'runNflScoutingTest'
});

job.save(function(err, job) {
  if (err) {
    console.log("** error adding runNflScoutingTest job");
  } else {
    console.log("** successfully added runNflScoutingTest job");
  }
})

// 9AM GMT every sunday
var job = new Job({
  name: 'Remove Old Data',
  enabled: true,
  cronPattern: '0 9 * * 0',
  functionName: 'removeOldData'
});

job.save(function(err, job) {
    if (err) {
      console.log("** error adding removeOldData job");
    } else {
      console.log("** successfully added removeOldData job");
    }
})
