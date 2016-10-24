var mongoose = require('mongoose'); 
var opts = { server: { socketOptions: { keepAlive: 1 } } }; 
var credentials = require('../lib/credentials.js');

exports.connect = function(env, callback) {
  console.log(env)
  mongoose.connection.on("error", function (err) {
    console.error("Mongoose Error", err);
    if(callback)
        callback(err);
  });

  switch (env) {
    case 'development':
      mongoose.connect(credentials.mongo.development.connectionString, opts);   
      break;
    case 'production':
      mongoose.connect(credentials.mongo.production.connectionString, opts);   
      break;
    default:
      throw new Error(' Unknown execution environment: ' + env); 
  }
}