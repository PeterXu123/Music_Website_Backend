const striptags = require("striptags");
const router = require('express').Router()
let Comment = require('../models/comment.model')


router.route('/createComment').post((req, res) => {
    let musicId = req.body.musicId;
    let userId = req.body.userId;
    let content = req.body.content;
    Comment.create(
        {musicId: musicId,
            userId: userId,
            content: content})
        .then((comment) => {
            res.json(comment)
        })
        .catch((error) => res.json(error))
})


module.exports = router;
