var express = require('express')
var bodyParser = require('body-parser')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var User = require('./models/user');
var mongoose = require('mongoose');
var app = express();


app.use(express.static('public'))
app.use(cookieParser());
app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
  
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.use(bodyParser.json())
app.use(methodOverride());


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.validPassword(password)) { return done(null, false); }
            return done(null, user);
        });
    }
)); 
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
// mongoose
mongoose.connect('mongodb://localhost:27017/db_ebook', { useNewUrlParser: true });

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

// debug router
/* console.log(app._router.stack)
console.log(router.stack) */
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

module.exports = app;