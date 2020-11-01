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

router.post("/song", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=album&limit=50`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body.albums.items)
        }
        else {
        }
    });
});

router.post("/artist/songs", (req, res) => {
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
        url: `https://api.spotify.com/v1/albums/${req.body.id}`,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };
    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send(body)
        }
        else {
        }
    });
});





module.exports = router;
