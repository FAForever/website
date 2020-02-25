const request = require("request");
const cache = {};
let isFetching = false;

const PLAYER_COUNT_UPDATE_INTERVAL = parseInt(process.env.PLAYER_COUNT_UPDATE_INTERVAL) * 1000;

exports = module.exports = function (req, res) {
  let resource = req.query.resource;
  if (cache[resource]) {
    if (isFetching || Date.now() - cache[resource].pollTime < PLAYER_COUNT_UPDATE_INTERVAL) {
      return res.send(cache[resource].data);
    }
  }
  isFetching = true;
  let queryResource = resource;
  if (resource === "countries") {
    queryResource = "players";
  }
  request(process.env.LOBBY_API_URL + "/" + queryResource, function (error, response, body) {
    let data = [];

    if (body) {
      data = JSON.parse(body);
    } else {
      console.error(
        "Error occured during parsing: ",
        process.env.LOBBY_API_URL + "/" + resource,
        "body: ", body,
        "error: ", error,
        "response", response
      );
    }

    cache[queryResource] = {
      pollTime: Date.now(),
      data: data.length.toString()
    };
    if (queryResource === "players") {
      data = data.map(player => player.country);
      const mapData = {};
      data.forEach(value => {
        if (mapData[value] !== undefined) {
          mapData[value] = mapData[value] + 1;
        } else {
          mapData[value] = 1;
        }
      });
      cache["countries"] = {
        pollTime: Date.now(),
        data: mapData
      };
    }
    isFetching = false;
    return res.send(cache[resource].data);
  });
};
