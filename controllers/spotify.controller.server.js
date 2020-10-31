const spotify = require("../services/spotify");

const convert = (content) => {
    return content.split("").map(e => e === " " ? "%20" : e).join("");
};

module.exports = {convert};