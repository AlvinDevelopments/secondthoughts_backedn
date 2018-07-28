var express = require('express');
var router = express.Router();
var Post = require('../../models/Post');
var jwt = require('express-jwt');
var User = require('../../models/User');
var Friend = require('../../models/Friend');
var Favorite = require('../../models/Favorite');
var Post = require('../../models/Post');

router.post('/create/:id', function(req,res){

    Favorite.findOneAndUpdate(
        {userId: req.payload._id},
        {$push : {favoriteList: req.params.id}},
        {upsert:true}
    )
    .then(console.log('success'));

    Post.findOneAndUpdate(
        {_id: req.params.id},
        {$push : {favoriteList: req.payload._id}, $inc: {likeCount: 1}},

        {upsert:true})
        .then(res.json(1));

});


router.post('/destroy/:id', function(req,res){
   console.log("DESTROY");

   Favorite.findOneAndUpdate(
    {userId: req.payload._id},
    {$pull : {favoriteList: req.params.id}},
    {upsert:true}
)
.then(console.log('success'))
.catch((err)=>console.log(err));

Post.findOneAndUpdate(
    {_id: req.params.id},
    {$pull : {favoriteList: req.payload._id}, $inc: {likeCount: -1}},
    {upsert:true})
.then(res.json(-1))
.catch((err)=>console.log(err));


});

router.get('/check/:id',function(req,res){
    console.log('lolollol');
    Post.findOne(
        {_id:req.params.id},
        function(err,item){

            if(!item || !item.favoriteList){
                return res.send(false);
            }
            else{
            // add err catches
            console.log('lolollol');
            console.log(item.favoriteList.includes(req.payload._id));
            res.send(item.favoriteList.includes(req.payload._id));
            }

            
        }
    );
});


module.exports = router;