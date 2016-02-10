var getPlayers = function () {

  var output;

  jQuery.ajax({
        url: 'http://api.faforever.com/ranked1v1',
        success: function (result) {
          output = result;
        },
        async: false
    });

    return output;
}

var paginate = function (players) {
  var pages = [];

  for (var i = 0; i < 50; i++) {
    var page = [];

    for (var j = 0; j < 100; j++) {
      page[j] = players.data[i * 100 + j];
    }

    pages.push(page);
  }

  return pages;
}

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

var renderPage = function (page, element) {
  removeAllChildElements(element);
  for(var player of page) {
    var tr = document.createElement("tr")
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

function prevPage() {
  if (currentPage === 0) {
    return;
  }
  currentPage--;
  renderPage(pages[currentPage], document.getElementById("players"));
}

function nextPage() {
  if (currentPage === 49) {
    return;
  }
  currentPage++;
  renderPage(pages[currentPage], document.getElementById("players"));
}

/* INIT */

var players = getPlayers();

var pages = paginate(players);

renderPage(pages[0], document.getElementById("players"));

var currentPage = 0;

console.log(pages[5][52]);
