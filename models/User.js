var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    username: {
      type: String,
      unique: true,
      required: true,
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true,
    },
    bio:{
      type: String
    },
    handle: {
        type: String,
        unique: true,
        required: true,
    },
    followingList:{
      type: Array
    },
    email:{
      type: String,
      unique: true,
      required: true,
    },
    favList:{
      type:Array,
    },
    timeline:{
        type: Array,
    },
    hash: String, // the encrypted password
    salt: String,
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    firstname: this.name,
    lastname:this.name,
    favList:this.favList,
    exp: parseInt(expiry.getTime() / 1000),
  }, 'MY_SECRET'); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var User = mongoose.model('users', userSchema);
module.exports = User;
