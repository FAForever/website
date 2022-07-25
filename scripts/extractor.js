require("dotenv").config();

let jsonapi = require("json-api-models");
let request = require("request");
let fs = require("fs");
let moment = require("moment");


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
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + " - There was an issue while fetching leaderboards global:");
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
    });

    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==3;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z", function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 2v2:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "members/2v2.json");
    });

    models.reset();

    request(process.env.API_URL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.id==4;updateTime=ge=" +
      pastMonth.format("YYYY-MM-DDTHH:mm:ss") + "Z", function (error, response, body) {
      if (error || response.statusCode > 210) {
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - There was an issue while fetching leaderboards 4v4:');
        console.error(error);
        if (response) console.trace(response.statusCode);
        return;
      }

      const ratings = models.sync(JSON.parse(body));

      saveLeaderboardRatingsToFile(ratings, "members/4v4.json");
    });

  } catch (e) {
    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - An error occured while extracting leaderboards:');
    console.log(e);
  }
};

require("dotenv").config();

const fetch = require('node-fetch');
let d = new Date();
let timeFilter = 6;
let minusTimeFilter = d.setMonth(d.getMonth() - timeFilter);
let currentDate = new Date(minusTimeFilter).toISOString();

async function getClientNews() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=10&_embed&_fields=_links.author,_links.wp:featuredmedia,_embedded,title,newshub_externalLinkUrl,newshub_sortIndex,content.rendered,date,categories&categories=283`);
  let data = await response.json();
  //Now we get a js array rather than a js object. Otherwise we can't sort it out.
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

module.exports.run = function run() {
  getClientNews()
    .then(clientNewsData => {
      fs.writeFile(`public/js/app/json/client-news.json`, JSON.stringify(clientNewsData), error => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${currentDate} - Client News file created successfully.`);
        }
      });
    });
};


