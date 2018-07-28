var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


let favoriteSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    favoriteList: {
        type: Array
    },
});



let Favorite = mongoose.model('favorites',favoriteSchema);
module.exports = Favorite;