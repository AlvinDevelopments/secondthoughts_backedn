var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = require('../models/User');


passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function(username, password, done) {
    console.log('finding username');
    console.log(username);
    User.findOne({ username: username }, function (err, user) {
      console.log('tryna find');
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));
