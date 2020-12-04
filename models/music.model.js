const mongoose = require('mongoose');
const musicSchema = mongoose.Schema(
    {
        title: String,
        musicId: String,
    },
    {collection: 'music'});

const Music = mongoose.model('Music', musicSchema)
module.exports = Music;