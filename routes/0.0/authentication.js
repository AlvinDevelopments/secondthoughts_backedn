var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var passport = require('passport');

var User = require('../../models/User');
var Friend = require('../../models/Friend');
var Follower = require('../../models/Follower');
var Favorite = require('../../models/Favorite');
// var Timeline  = require('../../models/Timeline');


router.post('/register', function(req, res){
    console.log('signing up');
    var user = new User();
    console.log(req.body);
    user.username = req.body.username;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.bio = '';
    user.handle = req.body.username;
    user.email = req.body.email;
    user.joinDate = Date.now();
    user.location = '';
  
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

        // Create followers table
        var followTable = new Follower();
        followTable.userId = user._id;
        followTable.followList = [user._id];
        followTable.followerCount = 0;

        followTable.save(function(err){
          if(err){
            res.status(500).json({
              "msg":err
            });
          }
        });

        // Create friends table
        var friendTable = new Friend();
        friendTable.userId = user._id;
        friendTable.friendList = [user._id];
        friendTable.friendCount = 0;

        friendTable.save(function(err){
          if(err){
            res.status(500).json({
              "msg":err
            });
          }
        });

        // Create favorites table
        var favoriteTable = new Favorite();
        favoriteTable.userId = user._id;
        favoriteTable.favoriteList = [];

        favoriteTable.save(function(err){
          if(err){
            res.status(500).json({
              "msg":err
            });
          }
        });

        // // Create timeline for new user
        // var timelineTable = new Timeline();
        // timelineTable.userId = user._id;
        // timelineTable.timeline = [];

        // timelineTable.save(function(err){
        //   if(err){
        //     res.status(500).json({
        //       "msg":err
        //     });
        //   }
        // });



        var token;
        token = user.generateJwt();
        res.status(200);
        res.json({
        "token" : token,
        "userId": user._id,
        "userHandle":user.handle
      });
      }
      
    });
});


router.post('/signin',function(req, res) {

  // TODO: Handle signin post when user already signed in

  
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
        res.status(200).json({
          "token" : token,
          "userId": user._id,
          "userHandle":user.handle
        });
      } else {
        // If user is not found
        console.log('user not found');
        res.status(400,'gg');
        res.send({"msg":"FUCK"});
      }
    })(req, res);
  
  });



  // isSignedIn(req, res, next){
  //   if()
  // }




module.exports = router;