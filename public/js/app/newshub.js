
let articleTitleArray = [];

async function getNewshub() {
  const response = await fetch(`js/app/members/newshub.json`);
  const data = await response.json();

  for (let i = 0; i < data.length; i++) {
    let title = data[i].title.replace(/ /g, '-');
    articleTitleArray.push(title);
  }

  return await data;
}


let articleMain = document.getElementById('articleMain');

function updateNewshub() {
  getNewshub()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        articleMain.insertAdjacentHTML("afterbegin", `
<div class ="articleContainer column4">
  <div class ="articleImage" onClick="articleActivate(${data.length - 1 - i})"></div>
  <div class ="articleText">
    <h2 class ="articleAuthorDate"></h2>
    <h1 class ="articleTitle"></h1>
    <div class ="articleContent"></div>
    <button onClick="articleActivate(${data.length - 1 - i})">Learn More</button>
  </div>
</div>`);
      }
      let articleImage = document.querySelectorAll('.articleImage');
      let articleTitle = document.querySelectorAll('.articleTitle');
      let articleAuthorDate = document.querySelectorAll('.articleAuthorDate');
      let articleContent = document.querySelectorAll('.articleContent');
      

      for (let i = 0; i < data.length; i++) {
        let date = data[i].date;
        let content = data[i].content;
        articleImage[i].style.backgroundImage = `url("${data[i].media}")`;
        articleTitle[i].innerHTML = `${data[i].title}`;
        articleAuthorDate[i].innerHTML = `By ${data[i].author} on ${date.substring(0, 10)}`;
        articleContent[i].innerHTML = `${content.substring(0, 150)}...`;
      }
    });
}

updateNewshub();

function articleActivate(article) {
  getNewshub()
    .then(data => {
      let currentURL = window.location.href;
      window.location.href = `${currentURL}/${articleTitleArray[article]}`;
    });
}

