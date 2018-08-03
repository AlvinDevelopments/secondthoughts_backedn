var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/User');
var Follower = require('../../models/Follower');
var cloudinary = require('cloudinary');
var ObjectID = require('mongodb').ObjectID;

const fs = require('fs');

let multer = require('multer');
let upload = multer({dest:'./public/temp/images'});



router.get('/settings',function(req,res){
    // TODO:

});

router.get('/verify_credentials',function(req,res){
    // TODO:
});

router.post('/remove_profile_banner',function(req,res){

    User.findOneAndUpdate(
        {_id:req.payload._id},
        {$set: {profileBannerURL:''}},
        function(err, item){
            if(err){
                console.log(err);
                return res.status(400);
            }
            else{
                console.log(item);
                res.status(200);
            }
        }
    )

    console.log(req.payload._id);
    cloudinary.v2.uploader.destroy(`banner_images/${req.payload._id}`,{
        invalidate:true
    },function(err, result){
        if(err){
            console.log(err, result);
            res.sendStatus(400);
        }
        else{
            console.log(result);
            res.sendStatus(200);
        }
    });

});

router.post('/settings',function(req,res){

});

router.post('/update_profile',function(req,res){

});


router.post('/update_profile_banner', upload.single('image'), function(req,res){

    let img = req.query.image;


    let base64Image = img.replace(/^data:image\/\w+;base64,/, "");

    var imageBuffer = new Buffer(base64Image, 'base64');

    fs.writeFile('image.jpeg', imageBuffer, function(err,item) {
        console.log('File created');
        res.send();
    });

    // console.log(`image URI is ${req.query.image}`);
    // console.log(req.file);
    // if(req.file===undefined){
    //     res.status(400).send('no image uploaded.');
    // }
    // else{
    //     const imgPath = req.file.path;
    //     cloudinary.v2.uploader.upload(imgPath, {
    //         public_id: req.payload._id,
    //         folder: 'banner_images',

    //     },function(err, result){
    //                 if(err){
    //                     console.log(result);
    //                     res.status(400).send(err);
    //                 }
    //                 else{
    //                     User.findOneAndUpdate(
    //                         {_id:req.payload._id},
    //                         {$set: {profileBannerURL:result.secure_url}},
    //                         function(err, item){

    //                             if(err){
    //                                 console.log('error');
    //                                 res.sendStatus(400);
    //                             }
    //                             else{
    //                                 console.log(`updated banner image for ${item.username} `);
    //                                 console.log('successfully updated!!');
    //                                 res.sendStatus(200);
    //                             }
    //                         }
                        
    //                     );

    //                 }
                
    //             }
    //         );

    //         fs.unlink(imgPath,function(err){
    //             if(err){
    //                 console.log(err);
    //                 console.log('err');
    //             }
    //         });
    // }

    
});

router.post('/update_profile_image', upload.single('image'), function(req,res){

    // console.log(`image URI is ${req.query.image}`);
    // console.log(req.file);
    if(req.file===undefined){
        res.status(400).send('no image uploaded.');
    }
    else{
        const imgPath = req.file.path;
        cloudinary.v2.uploader.upload(imgPath, {
            public_id: req.payload._id,
            folder: '/profile_images',

        },function(err, result){
                    if(err){
                        console.log(result);
                        res.status(400).send(err);
                    }
                    else{
                        User.findOneAndUpdate(
                            {_id:req.payload._id},
                            {$set: {profileImageURL:result.secure_url}},
                            function(err, item){

                                if(err){
                                    console.log('error');
                                    res.sendStatus(400);
                                }
                                else{
                                    console.log(`updated banner image for ${item.username} `);
                                    console.log('successfully updated!!');
                                    res.sendStatus(200);
                                }
                            }
                        
                        );

                    }
                
                }
            );

            fs.unlink(imgPath,function(err){
                if(err){
                    console.log(err);
                    console.log('err');
                }
            });

    }


});


module.exports = router;