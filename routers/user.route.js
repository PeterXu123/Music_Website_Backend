const striptags = require("striptags");

const router = require('express').Router()
let User = require('../models/user.model')
let Music = require('../models/music.model')
let Comment = require('../models/comment.model')


var hash = require('pbkdf2-password')()
const restricted = (req, res, next) => {
    console.log("noooopo")
    if (req.session.user) {
        console.log(114)
        next();
    } else {
        console.log(116)
        req.session.error = 'Access denied!';
        res.send(403);
        // res.json("not login");
    }
}


const getUserProfile = (req, res) => {
    let t = new Date();
    let rest = new Date(req.session.user.expired) - t;
    console.log(rest);
    console.log(req.session.user.expired)
    res.json({username: req.session.user.username,
        email: req.session.user.email,
        phoneNumber: req.session.user.phoneNumber,
        userId: req.session.user.userId,
        expired: req.session.user.expired, rest: rest})
}

async function authenticate(email, pass, fn) {
    await User.findOne({'email': email}).exec((error, user) => {
            if (!user) {
                console.log(122)
                return fn(null, null);

            }
            // apply the same algorithm to the POSTed password, applying
            // the hash against the pass / salt, if there is a match we
            // found the user
            hash({password: pass, salt: user.salt}, function (err, pass, salt, hash) {
                if (err) {
                    fn(new Error(err))
                }
                console.log(hash)
                if (hash === user.hash) {
                    console.log('successful login')
                    console.log(user)
                    return fn(null, user)
                }
                console.log("line 47")
                fn(new Error('invalid password'));
            });
        }
    )

}



router.route('/users').get((req, res) => {
    console.log(34)
    User.find()
        .then(users => res.json(users))
        .catch(error => res.status(400).json('Error: ' + error))
});

// router.route('/add').post((req, res) => {
//     const username = req.body.username;
//     const newUser = new User({username});
//     newUser.save()
//         .then(() => res.json('User added!'))
//         .catch(error => res.status(400).json('Error: ' + error))
// })

router.route('/profile').get(restricted, getUserProfile)
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 59 * 1000));
    return this;
}



router.route('/find/:id').get((req, res) => {
   // if (req.session.user) {
       console.log(req.params.id)
        User.findById(req.params.id).populate("favouriteMusic", {musicId: 1, title: 1})
            .exec()
            .then(user => {
                res.json(user)

            })
   // }
})

router.route('/update/:id').put( async(req, res) => {
    console.log("update")
    if (req.session.user) {
        const product = await User.findById(req.params.id).exec();
        if (!product) return res.status(404).send('The product with the given ID was not found.');
        let query = {$set: {}};
        for (let key in req.body) {
            if (product[key] && product[key] !== req.body[key]) {
                console.log(req.body[key])
                query.$set[key] = req.body[key];
            }// if the field we have in req.body exists, we're gonna update it

            else {
                console.log("fuck")
                console.log(req.body[key])
                query.$set[key] = req.body[key];
            }

        }


        const updatedProduct = await User.updateOne({_id: req.params.id}, query).exec();
        console.log("fdsfdsfsd")
        console.log(updatedProduct)
        req.session.user =
        {username: req.body.username,
            email: req.session.user.email,
            phoneNumber: req.body.phoneNumber,
            userId: req.session.user.userId,
            expired: req.session.user.expired}
        res.send(req.session.user)

    }
    //     let query = {$set: {}}
    //     for (let key in req.body) {
    //         if (product[key] && product[key] !== req.body[key]) // if the field we have in req.body exists, we're gonna update it
    //             query.$set[key] = req.body[key];
    //
    // }



})






router.route('/login').post((req, res) => {
    authenticate(req.body.email, req.body.password, (error, user) => {
        if (error) {
            console.log("line 151")
            console.log(error)
            return res.status(400).send(error.toString());
        }
        if (user) {
            req.session.regenerate(() => {
                let start = new Date();
                let expired = new Date().addHours(1);
                let rest = expired - start;
                req.session.user = {username: user.username,
                    email: user.email,
                    userId: user._id, rest, expired, phoneNumber: user.phoneNumber};
                user = req.session.user
                res.json(user);


            })
        }
        else {
            // req.session.error = 'Authentication failed, please check your '
            //                     + ' username and password.'
            console.log("line 172")
            console.log(user);
            console.log(error)
            res.send(400);

        }

    })
})

router.route("/logout").get((req, res) => {
    req.session.destroy((error) => {
        if (error) {
            res.json(error);
        }
        res.sendStatus(200);

    })

})

router.route("/register").post((req, res) => {
    let newUser = req.body
    let username = striptags(req.body.username)
    let email = striptags(req.body.email)
    if (username !== req.body.username) {
        return res.json({status: 'Invalid username'})
    }
    if (email !== req.body.email) {
        return res.json({status: 'Invalid email'})
    }
    User.findOne({ email: email }).exec()
        .then(users => {
            if(users !== null) {
                return res.status(409).send("User exist");
            }
            else {
                console.log("user doesn't exist")
                hash({password: newUser.password}, (err, pass, salt, hash) => {
                    delete newUser.password
                    newUser.hash = hash
                    newUser.salt = salt
                    const new_user = new User({...newUser})
                    new_user.save()
                        .then((user) => {
                            console.log(user);
                            req.session.regenerate(() => {

                                let start = new Date();
                                let expired = new Date().addHours(1);
                                let rest = expired - start;
                                let respUser = {username: newUser.username, userId: user._id,
                                    email:  user.email,
                                    rest, expired}
                                req.session.user = respUser;
                                res.json(respUser)

                            })



                        })

                });
            }
        })


})


router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json('User deleted'))
        .catch(error => res.status(400).json('Error: ' + error))

})





router.route('/addToFav').post((req, res) => {
    let musicId = req.body.songId;
    let userId = req.body.userId;

    User.findOne({_id: userId}).exec((error, user) => {
        if (error) {
            res.statusCode(404).json(error)
        }
        else if(user != null) {
            Music.findOne({musicId: musicId}).then((music) => {
                user.favouriteMusic.push(music);
                user.save();
                res.json(user)
            })
        }
    })
})




router.route('/removeFav').put( async (req, res) => {
    console.log("enter remove Fave ----------")
    let musicId = req.body.songId;
    let userId = req.body.userId;
    console.log(musicId)
    console.log(userId)


    User.findOne({_id: userId}).exec(async(error, user) => {
        console.log(userId)
        if (error) {
            res.statusCode(404).json(error)
        }
        else if(user != null) {

            let mid = await Music.findOne({'musicId': musicId}).exec();

            let favourite  = user.favouriteMusic.filter(i => {

                return i.toString() != mid._id})
            User.update({_id: userId}, {$set : {favouriteMusic: favourite}})
                .then((succeed) => {
                    User.findOne({_id: userId}).exec().then((us) => {
                        res.json(us);
                    })
                });

        }
    })
})


router.route('/findAllUser').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(error => res.status(400).json('Error: ' + error))
});


router.route('/removeUser/:uid').delete( async(req, res) => {
    let userId = req.params.uid;
    let commentList = await Comment.find({userId: userId}).exec();
    for(let i of commentList) {
        let m = await Music.findOne({musicId : i.musicId}).populate("comments").exec();
        let cl =  m.comments;
        let comments = cl.filter(coms => coms.userId != userId);
        await Music.update({musicId: i.musicId}, {$set :  {comments: comments}}).exec()
    }
    console.log("319")
    Comment.remove({userId: userId})
        .then((comment) =>
                  User.remove({_id: userId})
                      .then((r) => res.json(r))
        )

    console.log(commentList);



});



module.exports = router
