require("dotenv").config();

let jsonapi = require("json-api-models");
let request = require("request");
let fs = require('fs');
let moment = require('moment');

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
    //LABEL = name player and value is player ID
    let data = {
      label: entry.player.login,
      value: {id: entry.player.id, rating: entry.rating, totalgames: entry.totalGames, wonGames: entry.wonGames},
      date: entry.player.updateTime
      
    };

    csvArray.push(data);
  }

  fs.writeFile(filename, JSON.stringify(csvArray), function (error) {
    if (error) {
      console.log(error);
    } else {
      var pastMonth = moment().subtract(1, 'months');
      console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - User file created successfully for global.');
      console.log(`This is the date requested ${pastMonth.format("YYYY-MM-DDTHH:mm:ss")}`);
    }
  });
}

module.exports.run = function run() {
  console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + " - Updating leaderboards...");
  try {

    const models = new jsonapi.Store();

    var pastMonth = moment().subtract(3, 'months');

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==1;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z" + '&page[size]=5000', function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + " - There was an issue while fetching leaderboards global:");
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "public/js/app/members/global.json");
    });

    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==2;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z" + '&page[size]=5000', function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 1v1:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "public/js/app/members/1v1.json");
    });

    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==3;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z" + '&page[size]=5000', function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 2v2:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "public/js/app/members/2v2.json");
    });
    
    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==4;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z" + '&page[size]=5000', function (error, response, body) {
      if (error || response.statusCode > 210) {
        
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 4v4:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "public/js/app/members/4v4.json");
    });

  } catch (e) {
    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - An error occured while extracting leaderboards:');
    console.log(e);
  }
};
