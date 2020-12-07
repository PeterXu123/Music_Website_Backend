var express = require('express');
var app = express();
var request = require('request');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var session = require('express-session')
const mongoose = require('mongoose')
require('dotenv').config()
app.use(express.static(__dirname + '/index'))
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded());
app.use(cors({
    origin: ['http://localhost:3000', 'https://webdev-music-website-client.herokuapp.com/'],
    credentials: true,
}))


app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'EML8MnuXDvts02hPFNvuBijBDBCxmbu2ld'
}));

const uri = process.env.ATLAS_URI;
console.log(uri);
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology:
        true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
})




const spotifyData = require("./services/spotify");

var token = null;

setInterval(() => {
    getToken();
}, 1000 * 3500);


const getToken = function() {
    // requesting access token from refresh token

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(spotifyData.client_id + ':' + spotifyData.client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: spotifyData.refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            token = body.access_token;
            // console.log(token)
            app.set('token', token)
        }
    });
};

const searchRouter = require('./routers/spotify.search.route');
const usersRouter = require('./routers/user.route')
app.use('/search', searchRouter);
app.use('/users', usersRouter)

app.listen(process.env.PORT || 8887, () =>  getToken());
