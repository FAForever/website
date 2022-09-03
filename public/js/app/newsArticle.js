let articleTitleArray = [];

async function getNewshub() {
  const response = await fetch(`/js/app/members/newshub.json`);
  const data = await response.json();

//we push the title names into an array so we can loop through the different routes
  for (let i = 0; i < data.length; i++) {
    let title = data[i].title.replace(/ /g, '-');
    articleTitleArray.push(title);
  }
  return await data;
}


let activeTitle = document.getElementById('title');
let activeAuthorDate = document.getElementById('authorDate');
let activeImage = document.getElementById('featuredImage');
let activeContent = document.getElementById('content');
let activeBackground = document.getElementById('newsBackground');
let randomNumber = Math.floor(Math.random() * (3 + 1));

function articleActivate(article) {
  getNewshub()
    .then(data => {
      let date = data[article].date;
      activeTitle.innerHTML = data[article].title;
      activeAuthorDate.innerHTML = `By ${data[article].author} on ${date.substring(0, 10)}`;
      activeImage.innerHTML = `<img src="${data[article].media}" alt="News">`;
      activeContent.innerHTML = data[article].content;
      activeBackground.style.backgroundImage = `url("../../images/black${randomNumber}.jpg")`;

    });
}

//So here we check the name of the article in the url and display the article, the slice is done so we only check the title and not the name.

let url = window.location.href;
console.log(url);
const sliceIndicator = url.indexOf('/newshub');
// The slice has + 9 because thats the amount of characters in "/newshub/" yes with two /, not one!
let findMatch = url.slice(sliceIndicator + 9);

getNewshub()
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      if (articleTitleArray[i] === findMatch) {
        articleActivate(i);
      }
    }
  });



