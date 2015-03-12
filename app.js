var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); 
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('mongodb://jedtan:cs247@ds053251.mongolab.com:53251/cs247');
var db = monk('localhost:27017/cs247');/*
if(process.env.PROD_MONGODB){
  db = monk(process.env.PROD_MONGODB);
}*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser("secret string"));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.cookieParser());
app.use(expressSession());


app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
