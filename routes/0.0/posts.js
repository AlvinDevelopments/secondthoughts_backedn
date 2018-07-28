var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');
var jwt = require('express-jwt');
var User = require('../../models/User');
var Friend = require('../../models/Friend');

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
        if(!item || err){
            res.send({msg:err})
        }
        else{
            User.findOne({_id:item.authorId},(err,handle)=>{
                // console.log(handle.handle);
                item.author = handle.handle;
                // console.log(item);
                console.log('sending post');
                res.status(200).json(item);
            })
            
        }
    });
});

// GET /home_timeline
router.get('/home_timeline', auth, function(req,res){

    //get following list
    var q = Friend.findOne({"userId":req.payload._id});

    q.exec(function(err,user){
        var query = Post.find({"authorId":{"$in":user.friendList}});
        query.select('_id');
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
    // var query = Post.find({authorId: req.query.id.toLowerCase()});
    var query = Post.find(
        {$or:[
            {authorId: req.query.id.toLowerCase()},
            {repostList: req.query.id},
        ]});
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
        type:"POST",
        authorId: req.payload._id,
        postDate: Date.now(),
        commentList: [],
        repostList: [],
        mentions: [],
        hashtags: [],
        media: [],
        likeCount: 0,
        repostCount: 0,
        commentCount: 0,
    });

    // console.log(req.body);

    newPost.save().then(()=>console.log('posted up!!!!'));
    res.send({
        "status": 'success',
        "content": req.body.content
    });


    // TODO: add new post to timeline????

});


// POST repost
router.post('/repost/:id', auth, function(req,res){
    console.log("the payload: ");
    console.log(req.payload);
    let reply = req.body.reply;
    let newPost = '';

    if(reply){
        console.log('create new post');
        // create as new post
        newPost = new Post({
            content: req.body.content,
            originalPostId: req.params.id,
            type: "SHARE",
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
            commentCount: 0,
        });

        newPost.save().then(()=>console.log('posted up!!!!'));
        res.send({
            "status": 'success',
            "content": req.body.content
        });

    }
    else{
        console.log('reposting');
        // do not create as new post, it is a repost
        Post.findOneAndUpdate(
            {_id:req.params.id},
            {$addToSet: {repostList:req.payload._id},$inc:{repostCount:-1}},function(err,item){
                console.log('success');
            }
        );
        res.status(200).send('success');
    }
});

// POST unrepost
router.post('/unrepost/:id', auth, function(req,res){
    console.log('in the unrepost route');
    console.log("the payload: ");
    console.log(req.payload);

    Post.findOneAndUpdate(
        {_id:req.params.id},
        {
            $pull:{repostList:req.payload._id},
            $inc: {repostCount:-1}
        },
        function(err,item){
            console.log('success');
        }
    );

});

// POST destroy
router.post('/destroy/:id', auth, function(req,res){
    console.log('in the unrepost route');
    console.log("the payload: ");
    console.log(req.payload);

    var query = Post.findOne({_id:req.params.id});

    query.exec(function(err,item){
        if(err){
            console.log('err: ');
            console.log(err);
        }
        else{
            if(item.authorid!==req.payload._id){
                return res.sendStatus(400);
            }
        }
    });

    Post.findOneAndDelete(
        {_id:req.params.id},
        function(err,item){
            console.log('successfully deleted!');
        }
    );

});



// POST reply
router.post('/reply/:id', auth, function(req,res){

    // 1. Create new post of type 'REPLY'
    

    console.log('reply to post');

    let newPost = new Post({
        content: req.body.content,
        originalPostId: req.params.id,
        type: "REPLY",
        parent: req.params.id,
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
        commentCount: 0,
    });

    console.log(newPost);

    newPost.save(function(err){
        console.log('saving ');
        if(err){
            console.log(err);
            // res.sendStatus(500);
        }else{
            // res.sendStatus(200);
        }
    });


    Post.findOneAndUpdate(
        {_id:req.params.id},
        {
            // 2. Add new reply id to replyList array in parent comment
            $push:{commentList:newPost._id},
            // 3. Increment reply count of original post
            $inc:{commentCount:1},
        },
        {upsert:true},
        function(err,result){
            if(err){
                console.log(err);
                res.sendStatus(400);
            }
            else{
                res.status(200).send(newPost._id);
            }
        }
    );
   
    // 4. notify parties involved

});





// get reposts

// POST /posts/destroy/:id
router.post('/destroy/:id',function(req,res){
    Post.findOneAndRemove(
        {_id:req.params.id},
        function(err,result){
            if(err){
                res.status(400).send({msg:'could not delete...'});
            }
            else{
                res.status(200).send(result);
            }
        }
    )
});

module.exports = router;
