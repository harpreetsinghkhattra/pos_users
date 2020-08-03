var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { INTERNAL_SERVER_ERROR } = require('./constants/common.constants')
var { connection } = require("./db/connection.db");
var indexRouter = require('./routes/index.route');
var { validate_header } = require("./middlewares/auth.middleware");

var app = express();

//Connect with mongodb
connection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ping', (req, res) => {
  res
    .status(200)
    .json({
      message: "Server Ping Successfully"
    });
});

app.use('/dev/api/v0', validate_header, indexRouter);

app.get('/', (req, res) => res.render('index', { title: "POS APIs" }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log("error ===> app", error);
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    data: err._response || null,
    message: err._message || INTERNAL_SERVER_ERROR,
    error_stack: err._error_stack || err.statck || null,
    error: err._error || true
  });
});

module.exports = app;
