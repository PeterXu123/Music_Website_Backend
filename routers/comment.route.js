const striptags = require("striptags");
const router = require('express').Router()
let Comment = require('../models/comment.model')
let Music = require('../models/music.model')

router.route('/createComment').post((req, res) => {
    let musicId = req.body.musicId;
    let userId = req.body.userId;
    let content = req.body.content;
    let username = req.body.username;
    console.log(username)
    Comment.create(
        {musicId: musicId,
            userId: userId,
            content: content,
            userName: username})
        .then((comment) => {
            Music.findOne({musicId: musicId}).exec((error, music) => {
                if (error) {
                    res.statusCode(404).json(error)

                }
                else if(music != null) {
                    console.log(comment)
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

module.exports = router;



router.route('/deleteComment/:comId').delete((req, res) => {
    console.log("--------------")
    console.log(req.params.comId)
    Comment.remove({_id: req.params.comId})
        .then((comments) => {
            console.log(comments)
            res.json(comments)
        })
})

module.exports = router;

