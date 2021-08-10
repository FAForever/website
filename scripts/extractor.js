require("dotenv").config();

let jsonapi = require("json-api-models");
let request = require("request");
let fs = require('fs');


function saveLeaderboardRatingsToFile(ratings, filename) {
  ratings.sort((ratingA, ratingB) => {
    if (ratingA.rating > ratingB.rating) {
      return 1;
    } else if (ratingA.rating < ratingB.rating) {
      return -1;
    } else {
      return 0;
    }
  });

  let csvArray = [];

  for (let i = 0; i < ratings.length; i++) {
    let entry = ratings[i];

    let data = {
      label: entry.player.login,
      value: {id: entry.player.id, page: Math.ceil((i + 1) / 100)}
    };

    csvArray.push(data);
  }

  fs.writeFile(filename, JSON.stringify(csvArray), function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - User file created successfully for global.');
    }
  });
}

module.exports.run = function run() {
  console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + " - Updating leaderboards...");
  try {

    const models = new jsonapi.Store();

    var pastMonth = moment().subtract(1, 'months');

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==1;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z", function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + " - There was an issue while fetching leaderboards 1v1:");
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "members/global.json");
    });

    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==2;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z", function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 1v1:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "members/1v1.json");

      processTopFivePlayers(ratings);
    });
  } catch (e) {
    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - An error occured while extracting leaderboards:');
    console.log(e);
  }
};

function processTopFivePlayers(ratings) {
  let topFive = [];

  for (var i = 0; i < Math.min(ratings.length, 5); i++) {
    let user = ratings[i];

    let data = {
      name: user.player.login,
      rank: user.rating
    };

    topFive.push(data);
  }

  fs.writeFile("members/top5.json", JSON.stringify(topFive), function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - User file created successfully for top five.');
    }
  });
}
