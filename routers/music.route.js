const striptags = require("striptags");

const router = require('express').Router()
let Music = require('../models/music.model')

router.route('/music/:id').post((req, res) => {

        console.log(49)
        let title = req.body.title
        Music.findOne({musicId: req.params.id}).exec((error, music) => {
            if (error) {
                res.statusCode(404).json(error)

            }
            else if (music == null) {
                Music.create({title: title, musicId: req.params.id})
                    .then((music) => {
                        console.log("succeed create music")
                        console.log(music)
                        res.json(music)
                    })
            }
            else {
                console.log(music)
                console.log(music)
                res.json(music)
            }
        })

})

router.route('/getMusics').get((req, res) => {

    Music.find().exec((error, musics) => {
        if (error) {
            res.statusCode(404).json(error)

        }
        else if (musics == null) {
            res.json(musics)

        }
        else {
            console.log(musics)
            console.log(musics)
            res.json(musics)
        }
    })

})





module.exports = router;
