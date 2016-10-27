var fs = require('fs-extra')
var express = require('express');
var app = express();
var dbConnect = require('./models/db_connect.js');
dbConnect.connect(app.get('env'));
var TestRun = require('./models/test_run.js');
var oneDay = 1000*60*60*24

module.exports = function removeOldTestRuns(days) {
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

