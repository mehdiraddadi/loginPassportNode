const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    firstname: String,
    lastname: String,
    image: String,
    salt: String,
    createdDate: { type: Date, default: Date.now }
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    console.log('pre save', user)
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

  UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
 /*  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  }; */

  UserSchema.plugin(passportLocalMongoose);

  var User = mongoose.model('User', UserSchema);
  module.exports = User;