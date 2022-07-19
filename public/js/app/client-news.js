console.log('hello!');

async function getNewshub() {
  const response = await fetch(`js/app/members/client-news.json`);
  const data = await response.json();
  return await data;
}
let dataLength = 0;
let clientSpawn = document.getElementById('clientSpawn');
let clientContainer = document.querySelectorAll('.clientContainer');
let featureImage = document.querySelectorAll('.featureImage');
let featureTitle = document.querySelectorAll('.featureTitle');
let featureContent = document.querySelectorAll('.featureContent');
let featureButton = document.querySelectorAll('.featureButton');

function createArticles() {
  getNewshub()
    .then(data => {
      dataLength = data.length;
      let fixedLinkingOrder = data.length - 1;
      for (let i = 0; i < data.length - 1; i++) {
        clientSpawn.insertAdjacentHTML('afterbegin', `<div class="clientContainer column1">
    <div class="clientImage"></div>
    <div class="clientText">
        <h1 class="clientTitle"></h1>
        <div class="clientContent"></div>
            <a href="${data[fixedLinkingOrder].link}"><button>Learn More</button></a>
    </div>
</div>`);
        fixedLinkingOrder--;
      }
      return data;
    }).then(data => {
    
    let clientImage = document.querySelectorAll('.clientImage');
    let clientTitle = document.querySelectorAll('.clientTitle');
    let clientContent = document.querySelectorAll('.clientContent');
    for (let i = 0; i < data.length - 1; i++) {
      let content = data[i + 1].content;
      clientImage[i].style.backgroundImage = `url("${data[i + 1].media}")`;
      clientTitle[i].innerHTML = `${data[i + 1].title}`;
      clientContent[i].innerHTML = `${content.substring(0, 200)}`;
    }
    let content = data[0].content;
    featureImage[0].style.backgroundImage = `url("${data[0].media}")`;
    featureTitle[0].innerHTML = `${data[0].title}`;
    featureContent[0].innerHTML = `${content.substring(0, 400)}`;
    featureButton[0].innerHTML = `<a href="${data[0].link}"><button>Learn More</button></a>`;
  });
}

createArticles();
let arrowRight = document.getElementById('clientArrowRigth');
let arrowLeft = document.getElementById('clientArrowLeft');
let newsPosition = 0;
let newsLimit = 0;
let newsMove = clientContainer[0].offsetWidth;
console.log(newsMove)
arrowRight.addEventListener('click', () => {

  if (newsLimit === dataLength - 1) {
    console.log('limit reached')
  }else {
    newsLimit++;
    newsPosition = newsPosition - newsMove;
    clientSpawn.style.transform = `translateX(${newsPosition}px)`;
    arrowLeft.style.display = 'grid';
  }
  
});

arrowLeft.addEventListener('click', () => {
  if (newsLimit === 0) {
  }else {
    newsLimit--;
    newsPosition = newsPosition + newsMove;
    clientSpawn.style.transform = `translateX(${newsPosition}px)`;
  }
  

});


let clientList = document.querySelectorAll(".clientList");
let clientAbsolute = document.querySelectorAll(".clientAbsolute");
//When you mouseover/click, menu appears
clientList.forEach((element, index) => element.addEventListener("mouseover", () => {
  clientAbsolute[index].style.display = 'block';
  console.log('mouseout');
}));
clientList.forEach((element, index) => element.addEventListener("mouseout", () => {
  clientAbsolute[index].style.display = 'none';
  console.log('mouseover');
}));

//https://codepen.io/thenutz/pen/VwYeYEE?editors=1111

