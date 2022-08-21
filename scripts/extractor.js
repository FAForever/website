require("dotenv").config();

const fs = require('fs');
const fetch = require('node-fetch');

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
    rating: item.attributes.rating,
    totalgames: item.attributes.totalGames,
    wonGames: item.attributes.wonGames,
    date: item.attributes.updateTime,
  }));
  const combineArrays = (array1, array2) => array1.map((x, i) => [x, array2[i]]);
  let leaderboardData = combineArrays(playerLogin, playerValues);
  leaderboardData.sort((playerA, playerB) => playerA[1].rating - playerB[1].rating);
  return await leaderboardData;
 }

async function getNewshub() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=_links.author,_links.wp:featuredmedia,_embedded,title,content.rendered,date,categories&categories=587`);
  let data = await response.json();
  //Now we get a js array rather than a js object. Otherwise we can't sort it out.
  let dataObjectToArray = Object.values(data);
  let newshubData = dataObjectToArray.map(item => ({
    date: item.date,
    title: item.title.rendered,
    content: item.content.rendered,
    author: item._embedded.author[0].name,
    media: item._embedded['wp:featuredmedia'][0].source_url,
  }));
  return await newshubData;
}


async function getClientNews() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=10&_embed&_fields=_links.author,_links.wp:featuredmedia,_embedded,title,newshub_externalLinkUrl,newshub_sortIndex,content.rendered,date,categories&categories=283`);
  let data = await response.json();
  let dataObjectToArray = Object.values(data);
  let sortedData = dataObjectToArray.map(item => ({
    category: item.categories,
    sortIndex: item.newshub_sortIndex,
    link: item.newshub_externalLinkUrl,
    date: item.date,
    title: item.title.rendered,
    content: item.content.rendered,
    author: item._embedded.author[0].name,
    media: item._embedded['wp:featuredmedia'][0].source_url,
  }));
  sortedData.sort((articleA, articleB) => articleB.sortIndex - articleA.sortIndex);
  function onlyActiveArticles(article) {
    return article.category[1] !== 284;
  }
  let clientNewsData = sortedData.filter(onlyActiveArticles);
  return await clientNewsData;
}


async function getFAFTeams() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=content.rendered,categories&categories=636`);
  let data = await response.json();
  let dataObjectToArray = Object.values(data);
  let fafTeamsData = dataObjectToArray.map(item => ({
    content: item.content.rendered,
  }));
  return await fafTeamsData;
}

async function getContentCreators() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=100&_embed&_fields=content.rendered,categories&categories=639`);
  let data = await response.json();
  let dataObjectToArray = Object.values(data);
  let contentCreatorsData = dataObjectToArray.map(item => ({
    content: item.content.rendered,
  }));
  return await contentCreatorsData;
}



module.exports.run = function run() {
  //we start at 2 because we want the ID starting on 2
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

  getNewshub()
    .then(newshubData => {
      fs.writeFile(`public/js/app/members/newshub.json`, JSON.stringify(newshubData), error => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${currentDate} - NewsHub file created successfully.`);
        }
      });
    });
  
  getClientNews()
    .then(clientNewsData => {
      fs.writeFile(`public/js/app/members/client-news.json`, JSON.stringify(clientNewsData), error => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${currentDate} - Client News file created successfully.`);
        }
      });
    });
  getFAFTeams()
    .then(fafTeamsData => {
      fs.writeFile(`public/js/app/members/faf-teams.json`, JSON.stringify(fafTeamsData), error => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${currentDate} - FAFTeams file created successfully.`);
        }
      });
    });
  getContentCreators()
    .then(fafTeamsData => {
      fs.writeFile(`public/js/app/members/content-creators.json`, JSON.stringify(fafTeamsData), error => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${currentDate} - ContentCreators file created successfully.`);
        }
      });
    });
};