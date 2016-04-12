/*

http://api.faforever.com/ranked1v1?page[size]=50&page[number]=1&filter[is_active]=true
http://api.faforever.com/ranked1v1/500

*/

var getPage = function(pageNumber, pageSize) {
  var output;

  jQuery.ajax({
    url: "http://api.faforever.com/ranked1v1?page[size]=" + pageSize + "&page[number]=" + pageNumber + "&filter[is_active]=true",
    success: function (result) {
      output = result;
    },
    async: false
  });

  return output;
}

var renderPage = function (page, element) {
  removeAllChildElements(element);
  for(var i = 0; i < page.data.length; i++) {
    var player = page.data[i];
    var tr = document.createElement("tr")
    tr.setAttribute("id", "tr" + i);
    element.appendChild(tr);
    var rank = document.createElement("td")
    tr.appendChild(rank);
    rank.innerHTML = player.attributes.ranking;
    var name = document.createElement("td")
    tr.appendChild(name);
    name.innerHTML = player.attributes.login;
    var rating = document.createElement("td")
    tr.appendChild(rating);
    rating.innerHTML = player.attributes.rating;
    var games = document.createElement("td")
    tr.appendChild(games);
    games.innerHTML = player.attributes.num_games;
  }
}

/* Utilities */

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/* Page Onclick */

function prevPage() {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  renderPage(getPage(currentPage, pageSize), document.getElementById("players"));
}

function nextPage() {
  if (currentPage === 100) {
    return;
  }
  currentPage++;
  renderPage(getPage(currentPage, pageSize), document.getElementById("players"));
}

/* Init */

var pageSize = 50;

var currentPage = 1;

renderPage(getPage(1, pageSize), document.getElementById("players"));
