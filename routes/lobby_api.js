const request = require("request");
const cache = {};
let isFetching = false;

const PLAYER_COUNT_INTERVAL = process.env.PLAYER_COUNT_INTERVAL * 1000;

exports = module.exports = function (req, res) {
  let resource = req.query.resource;
  if (cache[resource]) {
    if (isFetching || Date.now() - cache[resource].pollTime < PLAYER_COUNT_INTERVAL) {
      return res.send(cache[resource].data);
    }
  }
  isFetching = true;
  let queryResource = resource;
  if (resource === "countries") {
    queryResource = "players";
  } else if (resource === "lobby") {
    queryResource = "games";
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


    if (resource === "lobby") {
      cache[resource] = {
        pollTime: Date.now(),
        data: body
      };
    } else if (resource === "countries") {
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
    } else {
      cache[queryResource] = {
        pollTime: Date.now(),
        data: data.length.toString()
      };
    }
    isFetching = false;
    return res.send(cache[resource].data);
  });
};
