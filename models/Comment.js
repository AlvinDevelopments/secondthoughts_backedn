var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    content: String,
    author: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    mentions:{
        type: Array
    },
    hashtags: {
        type: Array
    },
    postDate: {
        type: Date,
    },
    replyTo:{
        type: Array
    },
    likeList: Array,
    repostLsit: Array,
    replyList: Array,
    
});


var Comment = mongoose.model("comments",commentSchema);

module.exports = Comment;