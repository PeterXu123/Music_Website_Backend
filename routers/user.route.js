const striptags = require("striptags");

const router = require('express').Router()
let User = require('../models/user.model')
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
    }
}


const getUserProfile = (req, res) => {
    let t = new Date();
    let rest = new Date(req.session.user.expired) - t;
    console.log(rest);
    console.log(req.session.user.expired)
    res.json({username: req.session.user.username,
        email: req.session.user.email,
        expired: req.session.user.expired, rest: rest})
}

async function authenticate(email, pass, fn) {
    await User.findOne({'email': name}).exec((error, user) => {
            if (!user) {
                console.log(122)
                fn(null, null);

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
    console.log(49)
    if (!req.session.user) {
        User.find()
            .then(users => {
                req.session.user = users.find(u => u._id === req.params.id)
            })

        // req.session.user = User.find(u => u._id === req.params.id)
    }
    res.json(req.session.user)
})

router.route('/getUser').get((req, res) => {
    if (req.session.user) {
        let t = new Date();
        let rest = new Date(req.session.user.expired) - t;
        console.log(rest);
        console.log(req.session.user.expired)
        res.json({username: req.session.user.username,
                    email: req.session.user.email,
                     userId: req.session.user.userId,
                     expired: req.session.user.expired, rest: rest})
    } else {
        res.send(401);
    }
})




router.route('/login').post((req, res) => {
    authenticate(req.body.email, req.body.password, (error, user) => {
        if (error) {

            return res.status(400).send(error.toString());
        }
        if (user) {
            req.session.regenerate(() => {
                let start = new Date();
                let expired = new Date().addHours(1);
                let rest = expired - start;
                req.session.user = {username: user.username,
                    email: user.email,
                    userId: user._id, rest, expired};
                user = req.session.user
                res.json(user);


            })
        }
        else {
            req.session.error = 'Authentication failed, please check your '
                                + ' username and password.'

            res.status(400).send('Error: ' + req.session.error)

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


module.exports = router
