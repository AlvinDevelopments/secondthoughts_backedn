var express = require('express');
var router = express.Router();
var request = require('request');
var Post = require('../../models/Post');
var jwt = require('express-jwt');
var User = require('../../models/User');

var auth = jwt({
    // MUST ATTEND TO ASAP
    secret: 'MY_SECRET',
    userProperty: 'payload',
  });



// GET posts
router.get('/', function(req,res){

    var query = Post.find();
    
    query.exec(function(err,item){
        if(err){
            res.send({msg:err})
        }
        else{
            res.status(200).json(item);
        }
    });
});

// GET /show/:id
router.get('/show', function(req,res){
    var query = Post.findOne({_id: req.query.id});

    query.exec(function(err,item){
        if(err){
            res.send({msg:err})
        }
        else{
            res.status(200).json(item);
        }
    });
});

// GET /home_timeline
router.get('/home_timeline', auth, function(req,res){

    //get following list
    var q = User.findOne({"_id":req.payload._id});

    q.exec(function(err,user){
        var query = Post.find({"authorId":{"$in":user.followingList}});
        query.exec(function(err,item){
            if(err){
                res.send({msg:err})
            }
            else{
                console.log(item);
                res.status(200).json(item);
            }
        });


    });


    
});

// GET /user_timeline
router.get('/user_timeline', function(req,res){
    var query = Post.find({authorId: req.query.id.toLowerCase()});
    query.select('_id');
    query.exec(function(err,item){
        if(err){
            res.send({msg:err})
        }
        else{
            res.status(200).json(item);
        }
    });
});

// POST /update
router.post('/update', auth, function(req,res){
    console.log("the payload: ");
    console.log(req.payload);
    const newPost = new Post({
        content: req.body.content,
        author: req.payload.username,
        authorId: req.payload._id,
        postDate: Date.now(),
        commentList: [],
        repostList: [],
        mentions: [],
        hashtags: [],
        media: [],
        likeCount: 0,
        repostCount: 0,
    });

    console.log(req.body);

    newPost.save().then(()=>console.log('posted up!!!!'));
    res.send({
        "status": 'success',
        "content": req.body.content
    });
});


// Create new post
router.post('/', auth, function(req, res){

    console.log("the payload: ");
    console.log(req.payload);
    const newPost = new Post({
        content: req.body.content,
        author: req.payload.username,
        authorId: req.payload._id,
        postDate: new Date(),
        commentList: [],
        repostList: [],
        mentions: [],
        hashtags: [],
        media: [],
        likeCount: 0,
        repostCount: 0,
      });

      console.log(req.body);

      newPost.save().then(()=>console.log('posted up!!!!'));
      res.send({
          "status": 'success',
          "content": req.body.content
        });
});

// POST /posts/destroy/:id

module.exports = router;
