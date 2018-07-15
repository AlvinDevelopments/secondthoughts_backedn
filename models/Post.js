var mongoose = require('mongoose');


var postSchema = new mongoose.Schema({
    content: {
        type: String,
    },
    author: {
        type: String,
    },
    authorId:{
        type: String,
    },
    postDate: {
        type: Date,
    },
    commentList:{
        Type: Array,
    },
    likedList:{

    },
    repostList:{

    },
    mentions: {
        type: Array
    },
    hashtags:{
        type: Array,
    },
    media: {
        type: Array
    },
    likeCount: Number,
    repostCount: Number,
});


var Post = mongoose.model('posts',postSchema);

module.exports = Post; 