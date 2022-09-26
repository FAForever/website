require('dotenv').config();

// /data/game?filter=endTime=gt=date.toISOString() &include=playerStats.player&fields[player]=login &sort=-endTime

const fs = require('fs');
const fetch = require('node-fetch');

let d = new Date();
let timeFilter = 4;
let minusTimeFilter = d.setHours(d.getHours() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();


async function getRecentUsers() {
  let response = await fetch(`${process.env.API_URL}/data/leaderboardRating?filter=updateTime=gt=${currentDate}&page[size]=5000`);
  let fetchData = await response.json();
  //Now we get a js array rather than a js object. Otherwise we can't sort it out.
  let dataObjectToArray = Object.values(fetchData);
  let data = dataObjectToArray[0].map((item)=> ({
    playerID: item.id
  }));
  return await data;
}

module.exports.run = function run() {
  getRecentUsers()
    .then(data => {
      fs.writeFile(`public/js/app/members/recentUsers.json`, JSON.stringify(data), error => {
        if (error) {
          console.log(error);
        } 
      });
    });
};
