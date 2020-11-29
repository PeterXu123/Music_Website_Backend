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
    console.log("fuck")
    let respUser = {...req.session.user}
    delete respUser.hash
    delete respUser.salt
    res.json(respUser)
}

async function authenticate(name, pass, fn) {
    await User.findOne({'username': name}).exec((error, user) => {
            if (!user) {
                return new Error('cannot find user');
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

router.route('/:id').get((req, res) => {
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

router.route('/login').post((req, res) => {
    authenticate(req.body.username, req.body.password, (error, user) => {
        if (error) {
            res.send({status: error})
        }
        if (user) {
            req.session.regenerate(() => {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.json(user);

            })
        } else {
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
        }

    })
})

router.route("/users").post((req, res) => {
    let newUser = req.body
    let username = striptags(req.body.username)
    if (username !== req.body.username) {
        res.json({status: 'Invalid username'})
        return
    }
    hash({password: newUser.password}, (err, pass, salt, hash) => {
        delete newUser.password
        newUser.hash = hash
        newUser.salt = salt
        const new_user = new User({...newUser})
        new_user.save()
            .then(() => {
                let respUser = {...new_user}
                delete respUser.hash
                delete respUser.salt
                delete respUser.password
                res.json(respUser)
            })

    });
})


router.route('/:id').delete((req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(user => res.json('User deleted'))
        .catch(error => res.status(400).json('Error: ' + error))

})





module.exports = router
