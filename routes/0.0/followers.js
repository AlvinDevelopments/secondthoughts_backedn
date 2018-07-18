var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../../models/User');
var Follower = require('../../models/Follower');


router.get('/ids',function(req,res){
    var query = Follower.findOne({'userId':req.params.screen_name});

    query.exec(function(err,item){
        if(err){
            res.status(500).json({
                msg: err
            })
        }
        else{
            res.status(200).json(item);
        }
    });
});

module.exports = router;