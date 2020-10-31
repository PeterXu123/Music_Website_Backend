const router = require('express').Router()
let request = require('request');
const convert = (content) => {
    return content.split("").map(e => e === " " ? "%20" : e).join("");
};

router.post("/artist", (req, res) => {
    console.log(convert(req.app.get('token')))
        let searchReq = {
            url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=artist`,
            headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
            json: true
        };

        request.get(searchReq, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(req.app.get('token'))
                res.send(body.artists.items)
            }
            else {

            }
        });
});

router.post("/song", (req, res) => {
    console.log(convert(req.app.get('token')))
    let searchReq = {
        url: `https://api.spotify.com/v1/search?q=${convert(req.body.content)}&type=album `,
        headers: { 'Authorization': 'Bearer  ' +   req.app.get('token')},
        json: true
    };

    request.get(searchReq, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(req.app.get('token'))
            console.log(body)
            res.send(body.albums.items)
        }
        else {

        }
    });
});





module.exports = router
