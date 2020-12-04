const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
    {
        content: String,
        musicId: String,
        userId: String
    },
    {collection: 'comments'});

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment;