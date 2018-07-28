var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['POST','REPLY','REPOST','SHARE'],
        default: 'POST',
        required: true
    },
    parent: {
        type: String,
    },
    author:{
        type: String,
        required: true
    },
    authorId: {
        type: String,
    },
    postDate: {
        type: Date,
    },
    favoriteList:{
        type: Array,
    },
    repostList:{
        type:[String]
    },
    commentList:{
        type:[String]
    },
    mentions: {
        type: Array
    },
    hashtags:{
        type: Array,
    },
    likeCount: Number,
    repostCount: Number,
    commentCount: Number,
});

var Post = mongoose.model('posts',postSchema);

module.exports = Post; 