const mongoose = require('mongoose');
const musicSchema = mongoose.Schema(
    {
        title: String,
        musicId: String,
    },
    {collection: 'musics'});

const Music = mongoose.model('Music', musicSchema)
module.exports = Music;
