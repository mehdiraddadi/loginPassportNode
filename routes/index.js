var express = require('express');
const passport = require('passport');
var router = express.Router();
var User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  User.findOne({ username: 'mehdiraddadi' }, function (err, user) {
    console.log(req.user)
});
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
  res.render('login')
})

router.post('/check', function(req, res) {
  var username = req.body.username
  var password = req.body.password
  User.findOne({ username: username }, async function(err, user) {
      if(err) throw err;
      console.log(await user.comparePassword(password))
      if(!await user.comparePassword(password)) {
          res.send('user not found!')
      } else {
          req.session.user = user.username;
          res.redirect('/')
          //res.redirect(`/order/${req.cookies.odrderId}`)
      }
  })
})


router.get('/register', (req, res) => {
  res.render('register', { });
});

router.post('/register', (req, res, next) => {
  let data = {
    username : req.body.username,
    password : req.body.password,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    salt: ''

  }
  User.register(new User(data), req.body.password, (err, account) => {
      if (err) {
        return res.render('register', { error : {name: err.name, message: err.message} });
      }

      passport.authenticate('local')(req, res, () => {
          req.session.save((err) => {
              if (err) {
                  return next(err);
              }
              res.redirect('/');
          });
      });
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.send('lougout avec success!')
})


module.exports = router;
