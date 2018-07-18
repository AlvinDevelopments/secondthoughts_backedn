var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/User');

router.get('/',function(req,res){
  res.send('hello this is users.js');
});

router.get('/lookup',function(req,res){
  res.send('hello this is users.js');
  // list users
});

router.get('/lookup/:id',function(req,res){
  // res.send('hello this is users.js');
  // list user of id

  var query = User.findOne({"_id":req.params.id});
  query.select("handle _id bio firstname lastname");

  query.exec(function(err,item){
    if(err){
      res.send({
        msg:err
      });
    }
    else{
      console.log('sending');
      res.status(200).json(item);
    }
  });
});

router.get('/lookup_name/:name',function(req,res){
  // res.send('hello this is users.js');
  // list user of id
  var query = User.findOne({"handle":req.params.name});
  query.select("handle _id bio firstname lastname");

  query.exec(function(err,item){
    if(err){
      res.send({
        msg:error
      });
    }
    else if(item===null){
      console.log("CANNOT FIND");
      return res.status(404).json('cannot find');
    }
    else{
      return res.status(200).json(item);
    }
  });
});

router.patch('/lookup/:id',function(req,res){
  res.send('hello this is users.js');
  //  edit user of id
});

router.post('/lookup/:id',function(req,res){
  res.send('hello this is users.js');
  // delete user of id
});

router.get('/lookup/:id/followers/ids',function(req,res){
  res.send('hello this is users.js followers');
  // list followers ids of user id
});

router.get('/lookup/:id/followers/lists',function(req,res){
  res.send('hello this is users.js');
  // list followers objects of user id
});

router.get('/lookup/:id/followings/ids',function(req,res){
  res.send('hello this is users.js');
  // list following ids of user id
});

router.get('/lookup/:id/followings/lists',function(req,res){
  res.send('hello this is users.js');
  // list followings objects of user id
});

router.get('/lookup/:id/posts',function(req,res){
  res.send('hello this is users.js');
  // lists posts of user id
});

router.get('/search/:term',function(req,res){
  res.send('hello this is users.js');
  // list users who match the specified term
  
});

router.post('/',function(req,res){
  // create user
  // this has been implemented under the authentication route
});

// PATCH follow


// FOLLOW user
router.patch('/')



module.exports = router;
