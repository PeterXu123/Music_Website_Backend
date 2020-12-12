const striptags = require("striptags");
const router = require('express').Router()
let Comment = require('../models/comment.model')
let Music = require('../models/music.model')

router.route('/createComment').post((req, res) => {
    let musicId = req.body.musicId;
    let userId = req.body.userId;
    let content = req.body.content;
    Comment.create(
        {musicId: musicId,
            userId: userId,
            content: content})
        .then((comment) => {
            Music.findOne({musicId: musicId}).exec((error, music) => {
                if (error) {
                    res.statusCode(404).json(error)

                }
                else if(music != null) {
                    music.comments.push(comment);
                    music.save();
                    res.json(comment)
                }
            })
        })
        .catch((error) => res.json(error))
})






router.route('/findAllComments/:musicId').get((req, res) => {

    Music.findOne({musicId: req.params.musicId})
        .populate("comments")
        .then((comments) => res.json(comments))
    })
    // Music.findOne({musicId: musicId}).exec((error, music) => {
    //             if (error) {
    //                 res.statusCode(404).json(error)
    //
    //             }
    //             else if(music != null) {
    //                 music.comments.push(comment);
    //                 music.save();
    //                 res.json(comment)
    //             }
    //         })
    //     })
    //     .catch((error) => res.json(error))






module.exports = router;
