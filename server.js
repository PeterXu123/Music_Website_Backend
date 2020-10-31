var express = require('express');
var app = express();
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/index'))
    .use(cors())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded());


const spotify = require("./services/spotify");
const spotifyFun = require("./controllers/spotify.controller.server");

var token = null;

setInterval(() => {
    getToken();
}, 1000);


const getToken = function() {
    // requesting access token from refresh token
    var authOptions = {

        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(spotify.client_id + ':' + spotify.client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: spotify.refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            token = body.access_token;
            app.set('token', token)
            // console.log(token)
        }
    });
};

const searchRouter = require('./routes/search')
app.use('/search', searchRouter)




app.listen(8887, () =>  getToken());
