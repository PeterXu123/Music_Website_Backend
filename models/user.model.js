const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        favouriteMusic: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Music'
        }],
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 7,
        },
        salt: String,
        hash: String
    }, {
        timestamps: true
    }, {collection: 'users'})

userSchema.path('email').validate(function (email) {
    var emailCheck = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailCheck.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.')

const User = mongoose.model('User', userSchema)

module.exports = User;
