var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


let friendSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    friendList: {
        type: Array
    },
    friendCount: {
        type: Number,
        required: true
    }
});



let Friend = mongoose.model('friends',friendSchema);
module.exports = Friend;