const request = require("request");
const cache = {};
let isFetching = false;

const PLAYER_COUNT_UPDATE_INTERVAL = parseInt(process.env.PLAYER_COUNT_UPDATE_INTERVAL) * 1000;

exports = module.exports = function(req, res) {
    const resource = req.query.resource;
    if (cache[resource]) {
        if (isFetching || Date.now() - cache[resource].pollTime < PLAYER_COUNT_UPDATE_INTERVAL) {
            return res.send(cache[resource].count.toString());
        }
    }
    isFetching = true;
    request(process.env.LOBBY_API_URL + "/" + resource, function (error, response, body) {
        const data = JSON.parse(body);
        cache[resource] = {
            pollTime: Date.now(),
            count: data.length
        };
        isFetching = false;
        return res.send(cache[resource].count.toString());
    });
};
