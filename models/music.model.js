const mongoose = require('mongoose');
const musicSchema = mongoose.Schema(
    {
        title: String,
        musicId: String,
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    {collection: 'music'});

const Music = mongoose.model('Music', musicSchema)
module.exports = Music;