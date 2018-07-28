var mongoose = require('mongoose');

let timelineSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true,
    },
    timeline: [{
        isRetweet: {
            type: boolean,
            required: true
        },
        post: {
            type: Object,
            required: true
        }
    }],
});

let Timeline = mongoose.model('timelines',timelineSchema);
module.exports = Timeline;