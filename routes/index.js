var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res){
  res.render('login')
})

router.post('/check', function(req, res) {
  res.send('logged')
})

router.get('/register', (req, res) => {
  res.render('register', { });
});

router.post('/register', (req, res, next) => {
  let data = {
    username : req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    salt: '',
    createdDate: { type: Date, default: Date.now }

  }
  Account.register(new User(data), req.body.password, (err, account) => {
      if (err) {
        return res.render('register', { error : err.message });
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

module.exports = router;
