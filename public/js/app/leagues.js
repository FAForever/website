/*
 https://api.faforever.com/leaderboards/ladder1v1?page[size]=50&page[number]=1
 */
 
const categories = JSON.parse(rankingCategories);

var getPage = function(category, pageSize, id) {
  disableElement("#navigation-first-"+category);
  disableElement("#navigation-previous-"+category);
  disableElement("#navigation-next-"+category);
  disableElement("#navigation-last-"+category);
  if (currentPage[category] < lastPage[category]){
      enableElement("#navigation-next-"+category);
      enableElement("#navigation-last-"+category);
  }
  if (currentPage[category] > 1){
      enableElement("#navigation-first-"+category);
      enableElement("#navigation-previous-"+category);
  }
  const elementId = "players"+category;
  renderPage(category, document.getElementById(elementId), id); 
};

function enableElement(str){
    $(str).removeClass("disabled");
}
function disableElement(str){
    $(str).addClass("disabled");
}

var renderPage = function (category, element, playerId) {
    
  const list = categories[category].data;

  removeAllChildElements(element);
  
  for(var i = (currentPage[category]-1)*pageSize; i < Math.min(pageSize*currentPage[category], list.length); i++) {
    var player = list[i];
    var tr = document.createElement("tr");
    
    tr.setAttribute("id", "tr" + i);
    element.appendChild(tr);
    
    addCell(tr, (i+1));
    addCell(tr, player.name);
    addCell(tr, player.rating);
    addCell(tr, player.points);
    addCell(tr, player.wld.w+"/"+player.wld.l+"/"+player.wld.d);
    addCell(tr, formatTimePlayed(player.secondsPlayed));
  }
};

/* Utilities */

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

function formatTimePlayed(unix_timestamp){
     const time = unix_timestamp*1000;
     const duration = moment.duration(time);
     const hours = Math.floor(duration.asHours());
     const minutes  = Math.floor(duration.asMinutes()) - hours * 60;
     const seconds   = Math.floor(duration.asSeconds()) - hours * 60 * 60 - minutes * 60;
     const stringTime =  
        hours+"h "+
        minutes+"m "+
        seconds+"s";
     return stringTime;
}

function addCell(tr, content){
    var td = document.createElement("td");
    tr.appendChild(td);
    td.textContent = content;
}

/* Page Onclick */

for (let catName in categories){
     $("#navigation-previous-"+catName).click( function() {
      if (currentPage[catName] === 1) {
        return;
      }

      currentPage[catName]--;
      getPage(catName, currentPage[catName], pageSize);
    });

     $("#navigation-next-"+catName).click( function() {
      if (currentPage[catName] === lastPage[catName]) {
        return;
      }

      currentPage[catName]++;
      getPage(catName, currentPage[catName], pageSize);
    });
    
    $("#navigation-first-"+catName).click( function() {
      currentPage[catName] = 1;
      getPage(catName, currentPage[catName], pageSize);
    });

    $("#navigation-last-"+catName).click( function() {
      currentPage[catName] = lastPage[catName];
      getPage(catName, currentPage[catName], pageSize);
    });
}

/* Init */
let currentPage = [];
let lastPage = [];
const pageSize = 10;

const init = function() {
    for (const category in categories){
        const catName = categories[category].categoryName;
        currentPage[category] = 1;
        lastPage[category] = Math.ceil(categories[category].data.length/pageSize);
        getPage(category, pageSize);
    }
};

init();
