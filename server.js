var express = require('express');
var app = express();
var request = require('request');
var cors = require('cors');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/index'))
    .use(cors())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded());


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
               'Content-Type, X-Requested-With, Origin');
    res.header('Access-Control-Allow-Methods',
               'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});




const spotifyData = require("./services/spotify");

var token = null;

setInterval(() => {
    getToken();
}, 1000);


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
            app.set('token', token)
        }
    });
};

const searchRouter = require('./routers/spotify.search.router');
app.use('/search', searchRouter);


app.listen(process.env.PORT || 8887, () =>  getToken());
