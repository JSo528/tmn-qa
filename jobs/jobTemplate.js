var Job = require('./../models/job.js');

module.exports = {
  updateLastRunAt: function() {
    var query = Job.where({functionName: this.functionName})
    query.findOne(function(err, job) {
      job.update({lastRunAt: Date.now()}).exec(function(err, job) {
        if (err) {
          console.log("** ERROR SAVING LAST RUN AT **");
          console.log(err);
        }
      })
    })
  },
  run: function() {
    this.cronFunction();
    this.updateLastRunAt();
  }
}