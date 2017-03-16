var JobTemplate = require('./jobTemplate.js')
var extend = require('node.extend');
var util = require('./../lib/util.js')

var jobMetadata = {
  functionName: 'removeOldData',
  cronFunction: function() {
    util.removeOldTestRuns(7);
  }
}

module.exports = extend(jobMetadata, JobTemplate);