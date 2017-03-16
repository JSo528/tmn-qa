var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
  name: {type: String, unique: true, required: true},
  cronPattern: {type: String, required: true},
  enabled: {type: Boolean, default: false},
  functionName: String,
  lastRunAt: Date
});

var Job = mongoose.model('Job', jobSchema);
module.exports = Job;