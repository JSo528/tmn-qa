var Job = require('./job.js');

var app = require('express')();
var dbConnect = require('./db_connect.js');
dbConnect.connect('production');

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
    console.log(err)
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
      console.log(err)
    } else {
      console.log("** successfully added removeOldData job");
    }
})
