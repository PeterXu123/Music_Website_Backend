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
    salt: String,
    hash: String
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User;
