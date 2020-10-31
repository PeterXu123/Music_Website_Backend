const router = require('express').Router();
const request = require('request');

// convert input string
const convert = (content) => {
    return content.split("").map(e => e === " " ? "%20" : e).join("");
};

router.post("/artist", (req, res) => {
        let searchReq = {
            url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=artist`,
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

router.post("/song", (req, res) => {
    let searchReq = {
        url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=album `,
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

module.exports = router;
