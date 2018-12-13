const createError = require('http-errors'),
      express = require('express'),
      path = require('path'),
      cookieParser = require('cookie-parser'),
      logger = require('morgan');

const indexRouter = require('./routes/index'),
      usersRouter = require('./routes/users'),
      endpointsRouter = require('./routes/endpoints'),
      aaRouter = require('./routes/aa'),
      sensorRouter = require('./routes/sensor'),
      diaryRouter = require('./routes/diary'),
      app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/endpoints', endpointsRouter);
app.use('/users', usersRouter);
app.use('/aa', aaRouter);
app.use('/sensor', sensorRouter);
app.use('/diary', diaryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
