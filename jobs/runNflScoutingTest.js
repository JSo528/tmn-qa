var JobTemplate = require('./jobTemplate.js')
var extend = require('node.extend');
var util = require('./../lib/util.js')

var jobMetadata = {
  functionName: 'runNflScoutingTest',
  cronFunction: function() {
    util.runTest(4);
  }
}

module.exports = extend(jobMetadata, JobTemplate);