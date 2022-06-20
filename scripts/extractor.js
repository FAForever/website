require("dotenv").config();
const fetch = require("node-fetch");
const fs = require('fs');
let d = new Date();
let timeFilter = 6;
let minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();
//Dummies added (o and 1) so we cab re-use leaderboardID on the API call
let leaderboardIDs = [0, 1, '1v1', '2v2', '4v4',];

async function getLeaderboards(leaderboardID) {
  let response = await fetch(`${process.env.API_URL}/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==${leaderboardID};updateTime=ge=${currentDate}&page[size]=9499`);
  let data = await response.json();
  //Now we get a js array rather than a js object. Otherwise we can't sort it out.
  let dataObjectToArray = Object.values(data);
  let playerLogin = dataObjectToArray[2].map(item => ({
    label: item.attributes.login
  }));

  let playerValues = dataObjectToArray[0].map(item => ({
    rating: item.attributes.rating, totalgames: item.attributes.totalGames, wonGames: item.attributes.wonGames,
    date: item.attributes.updateTime
  }));
  const combineArrays = (array1, array2) => array1.map((x, i) => [x, array2[i]]);
  let leaderboardData =  combineArrays(playerLogin, playerValues);
  leaderboardData.sort((playerA, playerB) => playerA[1].rating - playerB[1].rating);
  return await leaderboardData;
}
module.exports.run = function run() {
  for (let i = 2; i < 5; i++) {
    getLeaderboards(i)
      .then(leaderboardData => {
        fs.writeFile(`public/js/app/members/${leaderboardIDs[i]}.json`, JSON.stringify(leaderboardData), error => {
          if (error) {
            console.log(error);
          } else {
            console.log(`${currentDate} - ${leaderboardIDs[i]} Leaderboard file created successfully.`);
          }
        });
      });
  }
};
