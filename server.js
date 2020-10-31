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

const refreshToken = setInterval(() => {
    getToken();
}, 1000 * 60 * 55);


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
            console.log(token)
        }
    });
};


app.post('/search', function(req, res) {
        var searchReq = {
            url: `https://api.spotify.com/v1/search?q=${spotifyFun.convert(req.body.content)}&type=artist`,
            headers: { 'Authorization': 'Bearer  ' +   token},
            json: true
        };
        request.get(searchReq, function(error, response, body) {
            if (!error && response.statusCode === 200) {

                res.send(body.artists.items)
            }
            else {

            }
        });
    });


app.listen(8887, () =>  getToken());