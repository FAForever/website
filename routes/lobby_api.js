exports = module.exports = function(req, res) {
    const request = require('request');
    request(process.env.LOBBY_API_URL + '/'+req.query.resource, function (error, response, body) {
        res.send(JSON.parse(body));
    });
};
