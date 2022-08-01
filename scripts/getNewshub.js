require("dotenv").config();

const fetch = require('node-fetch');
let moment = require("moment");
const fs = require("fs");
const {response} = require("express");
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
  let clientNewsData = sortedData.filter(article => article.category[1] !== 284);
  return await clientNewsData;
}

async function getTournamentNews() {
  let response = await fetch(`https://direct.faforever.com/wp-json/wp/v2/posts/?per_page=10&_embed&_fields=content.rendered,categories&categories=638`);
  let data = await response.json();
  //Now we get a js array rather than a js object. Otherwise we can't sort it out.
  let dataObjectToArray = Object.values(data);
  let sortedData = dataObjectToArray.map(item => ({
    content: item.content.rendered,
    category: item.categories
  }));
  let clientNewsData = sortedData.filter(article => article.category[1] !== 284);
  return await clientNewsData;
}

module.exports.run = function run() {
  getClientNews()
    .then(clientNewsData => {
      fs.writeFile(`public/js/app/json/client-news.json`, JSON.stringify(clientNewsData), error => {
        if (error || response.statusCode > 210) {
          console.log(moment().format("DD-MM-YYY - HH:mm:ss") + ' - There was an issue while fetching the client news');
          console.log(error);
          if (response) console.trace(response.statusCode);
          return;
        } else {
          console.log(`${currentDate} - Client News file created successfully.`);
        }
      });
    });
  getTournamentNews()
    .then(clientNewsData => {
      fs.writeFile(`public/js/app/json/tournament-news.json`, JSON.stringify(clientNewsData), error => {
        if (error || response.statusCode > 210) {
          console.log(moment().format("DD-MM-YYY - HH:mm:ss") + ' - There was an issue while fetching the client news');
          console.log(error);
          if (response) console.trace(response.statusCode);
          return;
        } else {
          console.log(`${currentDate} - Tournament News file created successfully.`);
        }
      });
    });
};
