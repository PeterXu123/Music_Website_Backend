const router = require('express').Router();
const request = require('request');

// convert input string
const convert = (content) => {
    return content.split("").map(e => e === " " ? "%20" : e).join("");
};

router.post("/artist", (req, res) => {
        let searchReq = {
            url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=artist&limit=50`,
            headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
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



router.post("/artist/id", (req, res) => {

    let searchReq = {
        url: `https://api.spotify.com/v1/artists/${req.body.id}`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(body)
            res.send(body)
        }
        else {
            // console.log(response.statusCode)
        }
    });
});


router.post("/album/songs", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/albums/${req.body.id}/tracks`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    console.log(req.body.id)
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(321)
            console.log(body)
            res.send(body)
        }
        else {
            console.log(123)
            console.log(error)
        }
    });
});

router.post("/song", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=track&limit=50`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body.tracks.items);
        }
        else {
            console.log("errr=================")
        }
    });
});

router.post("/artist/albums", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/artists/${req.body.id}/albums`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    console.log(req.body.id)
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // console.log(body)
            res.send(body.items)
        }
        else {
        }
    });
});



router.post("/song/id", (req, res) => {

    let searchReq = {
        url: `https://api.spotify.com/v1/tracks/${req.body.id}`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("!!!!!!!!!!!!!ß")
            console.log(body)
            res.send(body)
        }
        else {
        }
    });
});






router.post("/popular", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/recommendations?market=US&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_tracks=0c6xIDDpzE81m2q797ordA&min_energy=0.4&min_popularity=50`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token'),
            'Content-Type': "application/json",
            'Accept': 'application/json'

        },
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("----------------------------")
            res.send(body)
        }
        else {
            console.log(response.statusCode)

        }
    });
});





module.exports = router;
