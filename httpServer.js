const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const log = require('logger').express;
const sassMiddleware = require('node-sass-middleware');
const config = require('config');
const sessionMW = require('storage/session').mw;
const passport = require('passport');
const path = require('path');

const staticDir = config.get('httpServer:staticDir');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(log);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: staticDir,
  dest: staticDir,
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.use(express.static(staticDir));
app.use(sessionMW);

//Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  //log.debug('!!!!', req.user);
  next();
});

const initRoutes = Promise.resolve().then(() => {
  app.use('/', indexRouter);
  app.use('/users', usersRouter);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = app;
module.exports.initRoutes = initRoutes;