require('dotenv').config();

// /data/game?filter=endTime=gt=date.toISOString() &include=playerStats.player&fields[player]=login &sort=-endTime

const fs = require('fs');
const fetch = require('node-fetch');

// This time filter will make our application go back to the players playing in the last 10 minutes
let date = new Date();
let timeFilter = 10;
let minusTimeFilter = date.setMinutes(date.getMinutes() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();
console.log(currentDate);

async function getRecentUsers() {
  
  try {
    let response = await fetch(`${process.env.API_URL}/data/leaderboardRating?filter=updateTime=gt=${currentDate}&page[size]=5000`);
    let fetchData = await response.json();
    //Now we get a js array rather than a js object. Otherwise we can't sort it out.
    let dataObjectToArray = Object.values(fetchData);
    let data = dataObjectToArray[0].map((item)=> ({
      playerID: item.id
    }));
    return await data;    
  }catch (e) {
    console.log(e);
    return null;
  }

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
