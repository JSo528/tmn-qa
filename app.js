'use strict';

var express = require('express');
var app = express();
app.set('view engine', 'pug');

var dbConnect = require('./models/db_connect.js');
dbConnect.connect(app.get('env'));

if (app.get('env') == 'development') {
  var port = 3001;
} else {
  var port = process.env.PORT || 3000;  
}

// Modules
var credentials = require('./lib/credentials.js');

// Middleware
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser').urlencoded({ extended: true }));

switch(app.get('env')) {
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({ path: __dirname + '/log/requests.log' }));
    break;
}

app.use(function(req, res, next) {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

require('./routes.js')(app);

app.use(function(req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(req, res) {
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(port);
console.log("App listening on port " + port);


