var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '8b1c0b8e7b9a4435a04ebd11cefc90c6'; // Your client id
var client_secret = '730db2f6a15747699bce5afeddf72cc8'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var refresh_token = 'AQChMNKeSQvHGuXCH4gdQgQcA2A1QTDJzwzZq4mrGQlu9xIynQEBNGcStkMmwzFKvESnDWDUi37i' +
    'yHNQPN7oSSR5zlBYGTLNT549YUchLqwBunOA4RdVo_i6ThojwLV0f3A'
var token = null;
let expiredTime = null;
Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const convert = (content) => {
    return content.split("").map(e => e == " " ? "%20" : e).join("");
}

const myInt = setInterval(() => {
    init();
}, 1000 * 60 * 55)

const init = function() {

    // requesting access token from refresh token
    console.log(123)
    var authOptions = {

        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            token = access_token
            expiredTime = new Date().addHours(1)



        }
    });
}

const update = function(req, res) {

    // requesting access token from refresh token
    console.log(123)
    var authOptions = {

        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            token = access_token
            expiredTime = new Date().addHours(1)
            console.log(token)
            res.send(token)


        }
    });
}


var stateKey = 'spotify_auth_state';

var app = express();


app.use(express.static(__dirname + '/index'))
    .use(cors())
    .use(cookieParser())
    .use(express.json())
    .use(express.urlencoded())

app.get('/refresh_token', (req, res) =>  update(req, res));

app.post('/search', function(req, res) {


    var searchReq = {
        // https://api.spotify.com/v1/search?q=jay%20chou&type=artist
        url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=artist`,
        headers: { 'Authorization': 'Bearer  ' +   token},
        json: true
    };
    console.log(convert(req.body.content))
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body.artists.items);
            // console.log(response)
            console.log(response.statusCode )
            console.log(222)
            console.log(body.artists.items)
            res.send(body.artists.items)



        }
        else {
            // console.log(333)
            // console.log(response)
            // res.send(body)
        }
    });






})







app.listen(8887, () =>  init());
