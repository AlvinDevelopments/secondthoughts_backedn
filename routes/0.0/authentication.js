var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../../models/User');
var passport = require('passport');


router.post('/register', function(req, res){
    console.log('signing up');
    var user = new User();
    console.log(req.body);
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.username = req.body.username;
    user.handle = req.body.handle;
  
    if(req.body.password!==req.body.passwordretype){
      res.status(401).json({message:'passwords do not match'});
      return;
    }
  
    user.setPassword(req.body.password);
  
    user.save(function(err) {
  
      if(err){
        res.status(500).json({
          "msg":err
        });
      }
      else{
        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
        "token" : token
      });
      }
      
    });
});


router.post('/signin',function(req, res) {
    console.log('signing in');
    console.log(req.body);
    passport.authenticate('local', function(err, user, info){
      console.log('in passport');
      // console.log(info);
      var token;
      // If Passport throws/catches an error
      if (err) {
        console.log('error');
        res.status(404).json(err);
        return;
      }
  
      // If a user is found
      if(user){
        console.log('user found');
        // console.log(user);
        token = user.generateJwt();
        res.status(200);
        res.send({
          "token" : token,
          "userId": user._id
        });
      } else {
        // If user is not found
        console.log('user not found');
        res.status(500).json(info);
      }
    })(req, res);
  
  });




module.exports = router;