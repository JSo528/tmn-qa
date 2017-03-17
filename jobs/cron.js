var express = require('express');
var app = express();
var dbConnect = require('./../models/db_connect.js');
dbConnect.connect(app.get('env'));
var cron = require('node-cron');

var Job = require('./../models/job.js');

var cronObjects = {
  'runNflScoutingTest': require('./runNflScoutingTest.js'),
  'removeOldData': require('./removeOldData.js'),
}

Job.find({
  enabled: true
}).exec(function(err, jobs) {
  jobs.map(function(job) {
    var cronObject = cronObjects[job.functionName];

    if (cronObject) {
      console.log(cronObject.run)
      var task = cron.schedule(job.cronPattern, cronObject.run.bind(cronObject));
      task.start();  
    }
  });
});