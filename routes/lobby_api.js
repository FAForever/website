let cache = {};
let isFetching = false;

exports = module.exports = function(req, res) {
    const resource = req.query.resource;
    if (cache[resource]){
        if (isFetching || Date.now() - cache[resource].pollTime < parseInt(process.env.PLAYER_COUNT_UPDATE_INTERVAL) * 1000){
            return res.send(cache[resource].data);
        }
    }
    isFetching = true;
    const request = require('request');
    request(process.env.LOBBY_API_URL + '/' + resource, function (error, response, body) {
        const data = JSON.parse(body);
        cache[resource] = {
            pollTime: Date.now(),
            data: data
        };
        isFetching = false;
        return res.send(data);
    });
};
