console.log('Javi is the coolest');

async function getNewshub() {
  const response = await fetch(`js/app/members/newshub.json`);
  const data = await response.json();
  return await data;
}

let articleImage = document.querySelectorAll('.articleImage');
let articleTitle = document.querySelectorAll('.articleTitle');
let articleAuthorDate = document.querySelectorAll('.articleAuthorDate');
let articleContent = document.querySelectorAll('.articleContent');
let articleMain = document.getElementById('articleMain');

function updateNewshub() {
  getNewshub()
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        let date = data[i].date;

        let content = data[i].content;
        console.log(content.length);
        articleImage[i].style.backgroundImage = `url("${data[i].media}")`;
        articleTitle[i].innerHTML = `${data[i].title}`;
        articleAuthorDate[i].innerHTML = `By ${data[i].author} on ${date.substring(0, 10)}`;
        articleContent[i].innerHTML = `${content.substring(0, 150)}...`;


      }
    });
}

updateNewshub();

let activeTitle = document.getElementById('title');
let activeAuthorDate = document.getElementById('authorDate');
let activeImage = document.getElementById('featuredImage');
let activeContent = document.getElementById('content');
let activeMain = document.getElementById('newsMain');

function articleActivate(article) {
  getNewshub()
    .then(data => {
      let date = data[article].date;
      activeTitle.innerHTML = data[article].title;
      activeAuthorDate.innerHTML = `By ${data[article].author} on ${date.substring(0, 10)}`;
      activeImage.innerHTML = `<img src="${data[article].media}" alt="News">`;
      activeContent.innerHTML = data[article].content;
      activeMain.style.backgroundImage = `url("../../images/black${article}.jpg")`;
      articleMain.style.opacity = '0';
      setTimeout(() => {
        articleMain.style.display = 'none';
        activeMain.style.display = 'block';
        scroll(0, 0);
      }, 400);
      activeMain.style.opacity = '1';
    });
}

function returnNewshub() {
  getNewshub()
    .then(data => {
      activeTitle.innerHTML = '';
      activeAuthorDate.innerHTML = ``;
      activeImage.innerHTML = ``;
      activeContent.innerHTML = '';
      activeMain.style.backgroundImage = ``;
      articleMain.style.display = 'grid';
      activeMain.style.display = 'none';
      articleMain.style.opacity = '1';
      activeMain.style.opacity = '0';
      scroll(0, 0);
    });
}
