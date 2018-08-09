var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/User');

// list users
router.get('/lookup',function(req,res){
  res.send('hello this is users.js');
  
});

// get user by id
router.get('/lookup/:id',function(req,res){
  var query = User.findOne({"_id":req.params.id},'username firstname lastname bio handle email joinDate location postCount followerCount friendCount likeCount profileBannerURL profileImageURL',function(err,item){
    if(!err)
    {
      // console.log(item);
      item.updateCount();

      if(err){
        res.send({
          msg:err
        });
      }
      else{
        console.log('sending');
        res.status(200).json(item);
      }
    }
  });
});

// get user by handle name
router.get('/lookup_name/:name',function(req,res){
  
  var query = User.findOne({"handle":req.params.name},'username firstname lastname bio handle email joinDate location postCount followerCount friendCount likeCount profileBannerURL profileImageURL',function(err,item){
    if(!err && item)
    {
      console.log(item);
      item.updateCount();

      if(err){
        res.send({
          msg:err
        });
      }
      else{
        console.log('sending');
        res.status(200).json(item);
      }
    }
  });

});

// edit user of :id
router.patch('/lookup/:id',function(req,res){
  res.send('hello this is users.js');
  //  edit user of id
});

// delete user of id
router.delete('/lookup/:id',function(req,res){
  res.send('hello this is users.js');
  
});

// list followers ids of user id
router.get('/lookup/:id/followers/ids',function(req,res){
  res.send('hello this is users.js followers');
});

// list followers objects of user id
router.get('/lookup/:id/followers/list',function(req,res){
  res.send('hello this is users.js');
});

 // list following ids of user id 
router.get('/lookup/:id/followings/ids',function(req,res){
  res.send('hello this is users.js');
});

// list followings objects of user id
router.get('/lookup/:id/followings/lists',function(req,res){
  res.send('hello this is users.js');
});

// list users who match the specified term
router.get('/search/:term',function(req,res){
  res.send('hello this is users.js');
});

router.get('/profile_banner',function(req,res){
  // 
});

router.get('/profile_image',function(req,res){
  // 
});

module.exports = router;
