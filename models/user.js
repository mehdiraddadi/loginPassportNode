const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    firstname: String,
    lastname: String,
    image: String,
    salt: String,
    createdDate: { type: Date, default: Date.now }
});


//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

  var User = mongoose.model('User', UserSchema);
  module.exports = User;