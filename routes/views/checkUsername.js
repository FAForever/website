const request = require("request");

exports = module.exports = function (req, res) {
  const name = req.query.name;

  request(process.env.API_URL + "/data/player?filter=login==" + encodeURI(name), function (error, response, body) {
    if (error) {
      console.error(error);
      return res.status(500).send(error);
    }

    try {
      return res.send(JSON.parse(body).data.length === 0);
    } catch (e) {
      return res.status(500).send(e);
    }
  });
};
