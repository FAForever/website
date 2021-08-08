require('dotenv').config();

let jsonapi = require('json-api-models');
let request = require('request');
let moment = require('moment-timezone');

module.exports.run = async function run(leagueData) {

  const models = new jsonapi.Store();
  const leaguesConfigPath = process.cwd() + '/configuration/leagues.json';

  let leaguesConfig = require(leaguesConfigPath);
  // This is for safety : making sure the rating range is sorted from HIGHER RATING to LOWER RATING
  leaguesConfig.ratingRange.sort((a, b) => b - a);

  let lastPageReached = false; // Breaks the fetching loop once there is no more data to reach
  let pageNumber = 1;

  try {
    while (!lastPageReached) {
      const route = '/data/game?' +
        'filter=playerStats.ratingChanges.leaderboard.id==2;endTime=isnull=false;validity==VALID' +
      ';endTime=ge=' + leaguesConfig.timeRange.from + ';endTime=le=' + leaguesConfig.timeRange.to + '&' +
      'sort=startTime&' +
      'include=playerStats.ratingChanges,playerStats.player,playerStats.ratingChanges.leaderboard&' +
      'fields[game]=startTime,endTime,playerStats&' +
      'fields[gamePlayerStats]=score,player,game,faction,ratingChanges&' +
      'fields[leaderboardRatingJournal]=meanBefore,deviationBefore,leaderboard&' +
      'fields[player]=login&' +
      'fields[leaderboard]=technicalName&' +
      'page[number]=' + pageNumber + '&' +
      'page[size]=1000';

      await doRequest(process.env.API_URL + route, function (error, response, body) {
        try {
          if (error || response.statusCode > 210) {
            console.log(moment().format('DD-MM-YYYY - HH:mm:ss') + ' - ERROR while fetching Leagues data from the API page ' + pageNumber + '. Returning truncated data.');
            console.log(error);
            lastPageReached = true;
            return;
          } else {
            console.log(moment().format('DD-MM-YYYY - HH:mm:ss') + ' - Leagues : Fetching page ' + pageNumber + '...');
          }

          let entries = JSON.parse(body);
          models.sync(entries);

          // No more data... Terminating the while loop
          if (entries.data.length <= 0 || entries.included.length <= 0) {
            lastPageReached = true;
          } else {
            pageNumber++;
          }
        } catch (e) {
          console.log(moment().format('DD-MM-YYYY - HH:mm:ss') + ' - ERROR while fetching Leagues data from the API page ' + pageNumber + '. Returning truncated data.');
          console.log(error);
          lastPageReached = true;
        }
      });
    }

    let players = models.findAll('player');
    let leagueRecords = {};
    for (let k = 0; k < players.length; k++) {
      let player = players[k];
      leagueRecords[player.id] = {
        'id': player.id,
        'name': player.login,
        'rating': null,
        'points': 0,
        'factions': {1: 0, 2: 0, 3: 0, 4: 0},
        'wld': {'w': 0, 'l': 0, 'd': 0},
        'secondsPlayed': 0
      };
    }

    let games = models.findAll('game');       // Associates a game ID with informations about that game (list of player IDs, start time, ...)

    leagueData.playerData = [];

    for (let k = 0; k < leaguesConfig.ratingRange.length; k++) {
      let ratingBoundary = leaguesConfig.ratingRange[k];
      leagueData.playerData.push({
        'categoryName': getRangeName(leaguesConfig.ratingRange, ratingBoundary),
        'ratingReference': getMaximumRating(leaguesConfig.ratingRange, ratingBoundary), // Used for sorting
        'data': []
      });
    }
    leagueData.playerData.push({
      'categoryName': getRangeName(leaguesConfig.ratingRange, 0),
      'ratingReference': getMaximumRating(leaguesConfig.ratingRange, 0), // Used for sorting
      'data': []
    });

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      const timeElapsed = moment(game.endTime).unix() - moment(game.startTime).unix();

      let winner = null;
      for (let k = 0; k < game.playerStats.length; k++) {
        const playerRecord = game.playerStats[k];
        if (playerRecord.score > 0) {
          winner = playerRecord.player.id;
        }
      }

      for (let k = 0; k < game.playerStats.length; k++) {
        const playerRecord = game.playerStats[k];

        let leagueRecord = leagueRecords[playerRecord.player.id];

        if (leagueRecord.id === winner) {
          leagueRecord.wld.w++;
          leagueRecord.points += 2;
        } else if (winner == null) {
          leagueRecord.wld.d++;
        } else {
          leagueRecord.wld.l++;
          leagueRecord.points -= 1;
        }

        leagueRecord.factions[playerRecord.faction]++;

        leagueRecord.secondsPlayed += timeElapsed;
        if (leagueRecord.rating == null) {
          for (let j = 0; j < playerRecord.ratingChanges.length; j++) {
            if (playerRecord.ratingChanges[j].leaderboard.technicalName === 'ladder_1v1') {
              leagueRecord.rating = Math.round(playerRecord.ratingChanges[j].meanBefore - 3 * playerRecord.ratingChanges[j].deviationBefore);
            }
          }
        }
      }
    }

    for (let k = 0; k < players.length; k++) {
      let player = players[k];
      let leagueRecord = leagueRecords[player.id];
      const categoryName = getRangeName(leaguesConfig.ratingRange, leagueRecord.rating);
      for (let k = 0; k < leagueData.playerData.length; k++) {
        if (leagueData.playerData[k].categoryName === categoryName) {
          leagueData.playerData[k].data.push(leagueRecord);
          break;
        }
      }
    }

    // Finally, we sort the player list so that the highest score is the first element in the list
    for (let k = 0; k < leagueData.playerData.length; k++) {
      sortListOfObjects(leagueData.playerData[k].data, 'points');
    }
    // And then we sort the categories
    sortListOfObjects(leagueData.playerData, 'ratingReference');

    console.log(moment().format('DD-MM-YYYY - HH:mm:ss') + ' - Successfully updated the Leagues data');
    models.reset();
    return leagueData;
  } catch (e) {
    console.log(moment().format('DD-MM-YYYY - HH:mm:ss') + ' - Error while updating leagues');
    console.log(e);

    leagueData.playerData = [];

    return leagueData;
  }
};

// Returns the appropriate rating range name for the player (Ex : A player of rating 1245 will be between 1600 and 1100 (if those were given as range in the configuration file) and therefore this function will return '1599-1100' (1600 being part of the upper category))
function getRangeName(ranges, rating) {
  for (let k in ranges) {
    const range = ranges[k];
    if (rating >= range) {
      if (k == 0) {
        return range + '+';
      } else {
        return (ranges[k - 1] - 1) + '-' + range;
      }
    } else if (k == ranges.length - 1) {
      return (range - 1) + '-';
    }
  }
}

// Returns the higher category rating this rating can possibly belong to. If the category isn't found, returns the lowest category -1. This is used for sorting the categories.
function getMaximumRating(ranges, rating) {
  for (let k in ranges) {
    const range = ranges[k];
    if (rating >= range) {
      return range;
    }
  }
  return ranges[ranges.length - 1] - 1;
}

// Sorts list by any var and in either asencing or descending order.
function sortListOfObjects(list, key, ascending = false) {

  const descending = !ascending;
  let switching = true;

  while (switching) {
    switching = false;
    for (let index = 0; index < list.length; index++) {
        if (index === 0) {
          continue;
        }
        const element = list[index];
        if (
          (ascending && element[key] < list[index - 1][key]) ||
          (descending && element[key] > list[index - 1][key])
        ) {
          list[index] = list[index - 1];
          list[index - 1] = element;
          switching = true;
        }
    }
  }
}

// Promise wrapper for request()
function doRequest(url, callback) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      resolve(
        callback(error, res, body)
      );
    });
  });
}
