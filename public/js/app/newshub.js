
async function getNewshub() {
  const response = await fetch(`js/app/json/client-news.json`);
  const data = await response.json();
  return await data;
}
async function getTournament() {
  const response = await fetch(`js/app/json/tournament-news.json`);
  const data = await response.json();
  return await data;
}

let dataLength = 0;
let clientSpawn = document.getElementById('clientSpawn');
let clientContainer = document.querySelectorAll('.clientContainer');
let clientMainFeature = document.querySelectorAll('.clientMainFeature');

//downscale-fix
let PICA = new pica({ features: ['js', 'wasm', 'cib', 'ww'] });

let images = [];

function rescaleToCanvas() {


  // this part should position the canvas such that it matches the original
  // background-image. the code assumes background image is centered and scaled
  // to cover the div

  let ratio = {
    x: this.div.offsetWidth / this.width,
    y: this.div.offsetHeight / this.height
  };
  let sizeCSS = {
    x: 0,
    y: 0
  };
  
  if (ratio.x > ratio.y) {
    let height = Math.round(this.height * ratio.x);
    sizeCSS.x = this.div.offsetWidth;
    sizeCSS.y = height;
    this.cvs.style.top = Math.round((this.div.offsetHeight - height) / 2) + 'px';
    this.cvs.style.left = '0';
  } else {
    let width = Math.round(this.width * ratio.y);
    sizeCSS.x = width;
    sizeCSS.y = this.div.offsetHeight;
    this.cvs.style.left = Math.round((this.div.offsetWidth - width) / 2) + 'px';
    this.cvs.style.top = '0';
  }
  
  let scale = window.devicePixelRatio;
  this.cvs.setAttribute('width', sizeCSS.x * scale);
  this.cvs.setAttribute('height', sizeCSS.y * scale);
  this.cvs.style.width = sizeCSS.x + 'px';
  this.cvs.style.height = sizeCSS.y + 'px';
  
  PICA.resize(this, this.cvs);
  
}

function prepImageDownscale(div, imageURL) {
  // We need the background image in a new Image class both to send it to pica
  // and to get it's original pixel dimensions, so we get the url from the div
  // and clean it up

  let img = new Image();

  img.src = imageURL;

  img.crossOrigin = 'Anonymous';
  
  // the canvas element will sit just inside the old div, overlapping the
  // background image and clipped to the div's dimentions with overflow: hidden
  let cvs = document.createElement('canvas');

  div.style.position = 'relative';
  div.style.overflow = 'hidden';
  cvs.style.position = 'absolute';
  div.appendChild(cvs);
  img.cvs = cvs;
  img.div = div;

  
  img.onload = rescaleToCanvas;
  images.push(img);
}
//downscale-fix END

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
      clientMainFeature[0].insertAdjacentHTML('afterbegin', `<a class="featureSubGrid column9" target='_blank' href="${data[0].link}">
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
      
      //downscale-fix
      prepImageDownscale(clientImage[i], `${data[i + 1].media}` );
      //downscale-fix END
      
      clientTitle[i].innerHTML = `${data[i + 1].title}`;
      clientContent[i].innerHTML = `${content.substring(0, 200)}`;
    }
    let featureImage = document.querySelectorAll('.featureImage');
    let featureTitle = document.querySelectorAll('.featureTitle');
    let featureContent = document.querySelectorAll('.featureContent');
    let content = data[0].content;
    featureImage[0].style.backgroundImage = `url("${data[0].media}")`;
    
    //downscale-fix
    prepImageDownscale(featureImage[0], `${data[0].media}` );
    //downscale-fix END

    featureTitle[0].innerHTML = `${data[0].title}`;
    featureContent[0].innerHTML = `${content.substring(0, 400)}`;
    
  });
}


//downscale-fix

let resizeTimer = null;
let resizeFunction = function() {
  images.forEach( (img) => {
    img.onload();
    img.cvs.style.display = 'block';
  });
};

// delay after resize event before we do the downscale. The faf client behaved
// erratically without it
let resizeTime = 60;
let resizeEventListener = function() {
  {
    clearTimeout(resizeTimer);
    images.forEach( (img) => {
      img.cvs.style.display = 'none';
    });
    resizeTimer = setTimeout(resizeFunction, resizeTime);
  }
};
window.addEventListener('resize', resizeEventListener);

//downscale-fix END

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
addEventListener('resize', () => {
  clientSpawn.style.transform = `translateX(0px)`;
  newsPosition = 0;
  newsLimit = 0;
});

let clientTournamentSpawn = document.getElementById('tournamentSpawn');
function createTournaments() {
  getTournament()
    .then(data => {
      clientTournamentSpawn.insertAdjacentHTML('beforeend', `${data[0].content}`);
      return data;
    });
}

createTournaments();
