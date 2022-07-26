console.log('hello!');

async function getNewshub() {
  const response = await fetch(`js/app/json/client-news.json`);
  const data = await response.json();
  return await data;
}

let dataLength = 0;
let clientSpawn = document.getElementById('clientSpawn');
let clientContainer = document.querySelectorAll('.clientContainer');
let clientMainFeature = document.querySelectorAll('.clientMainFeature');

function createArticles() {
  getNewshub()
    .then(data => {
      dataLength = data.length;
      let fixedLinkingOrder = data.length - 1;
      for (let i = 0; i < data.length - 1; i++) {
        clientSpawn.insertAdjacentHTML('afterbegin', `<a target='_blank' href="${data[fixedLinkingOrder].link}">
    <div class="clientContainer column1">
        <div class="clientImage"></div>
        <div class="clientText">
            <h1 class="clientTitle"></h1>
            <div class="clientContent"></div>
        </div>
    </div>
</a>`);

        fixedLinkingOrder--;
      }
      clientMainFeature[0].insertAdjacentHTML('afterbegin', `<a class="featureSubGrid column11" target='_blank' href="${data[0].link}">
    <div class="featureContainer column5">
        <div class="featureImage"></div>
    </div>
    <div class="featureContainer column7">
        <div class="featureText">
            <h1 class="featureTitle"></h1>
            <div class="featureContent"></div>
        </div>
    </div>
</a>`);
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
    let featureImage = document.querySelectorAll('.featureImage');
    let featureTitle = document.querySelectorAll('.featureTitle');
    let featureContent = document.querySelectorAll('.featureContent');
    let content = data[0].content;
    featureImage[0].style.backgroundImage = `url("${data[0].media}")`;
    featureTitle[0].innerHTML = `${data[0].title}`;
    featureContent[0].innerHTML = `${content.substring(0, 350)}`;

  });
}

createArticles();
let arrowRight = document.getElementById('clientArrowRigth');
let arrowLeft = document.getElementById('clientArrowLeft');
let newsPosition = 0;
let newsLimit = 0;
let newsMove = clientContainer[0].offsetWidth;
console.log(newsMove);
let spawnStyle = getComputedStyle(clientSpawn).columnGap;
let columnGap = spawnStyle.slice(0, 2);


arrowRight.addEventListener('click', () => {
  let newsMove = clientContainer[0].offsetWidth;
  if (newsLimit === dataLength) {
    console.log('limit reached');
  } else {
    newsLimit++;
    newsPosition = newsPosition - newsMove;
    clientSpawn.style.transform = `translateX(${newsPosition - columnGap}px)`;
    arrowLeft.style.display = 'grid';
  }
});
arrowLeft.addEventListener('click', () => {
  let newsMove = clientContainer[0].offsetWidth;
  if (newsLimit === 0) {
  } else {
    newsLimit--;
    newsPosition = newsPosition + newsMove;
    clientSpawn.style.transform = `translateX(${newsPosition - columnGap + 10}px)`;
  }

});
addEventListener('resize', (event) => {
  clientSpawn.style.transform = `translateX(0px)`;
  newsPosition = 0;
  newsLimit = 0;
});

function movee() {
  newsPosition = newsPosition - newsMove;
  clientSpawn.style.transform = `translateX(${newsPosition - 50}px)`;
}

//setInterval(movee, 1000);
