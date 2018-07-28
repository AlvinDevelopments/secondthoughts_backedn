var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Follower = require('../../models/Follower');
var Friend = require('../../models/Friend');

router.post('/create', function(req,res){

    if(req.payload_id==req.query.user_id){
        return false;
    }
    // create friendship with param 'user_id'
    var userId = req.query.user_id;
    var followerId = req.payload._id;
    console.log('id is: '+userId);
    console.log('followerid is: '+followerId);

    Follower.findOneAndUpdate(
        {userId:userId},
        {$push: { followerList: followerId }},
        {upsert: true}
    )
    .then(
        console.log('updated follower table of followed user')
    )
    .catch((error)=>console.log(error));

    Friend.findOneAndUpdate(
        {userId:followerId},
        {$push: { friendList: userId }},
        {upsert: true}
    )
    .then(console.log('updated friends table'))
    .catch((error)=>console.log(error));


});

router.post('/destroy', function(req,res){
    // create friendship with param 'user_id'

    if(req.payload_id==req.query.user_id){
        return false;
    }

    var userId = req.query.user_id;
    var followerId = req.payload._id;
    console.log('id is: '+userId);
    console.log('followerid is: '+followerId);

    Follower.findOneAndUpdate(
        {userId:userId},
        {$pull: { followerList: followerId }},
        {upsert: true}
    )
    .then(console.log('updated follower table of unfollowed user'))
    .catch((error)=>console.log(error));

    Friend.findOneAndUpdate(
        {userId:followerId},
        {$pull: { friendList: userId }},
        {upsert: true}
    )
    .then(console.log('updated friends table'))
    .catch((error)=>console.log(error));

});


router.get('/check', function(req,res){
    Follower.findOne(
        {userId:req.query.user_id},
        function(err,obj){
            console.log(obj);
            console.log(req.query.user_id);


            if(obj!==null){
                if(obj.followerList.includes(req.payload._id)){
                    res.status(200).json({isFollowing:true});
                }
                else{
                    res.status(200).json({isFollowing:false});
                }
            }
            else{
                res.status(404);
            }

            
        }
    )
    .then(console.log('lol'))
    .catch((error)=>console.log(error));

});


module.exports = router;