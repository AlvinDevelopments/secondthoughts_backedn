var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


let followerSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    followerList: {
        type: Array
    },
    followerCount: {
        type: Number,
        required: true
    }
});

let Follower = mongoose.model('followers',followerSchema);
module.exports = Follower;