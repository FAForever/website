let getPage = function (pageNumber, pageSize, id) {
  let moment = require("moment");
  let apiURL = process.env.API_URL;

  
  let pastMonth = moment().subtract(1, "months").format("YYYY-MM-DDTHH:mm:ss") + "Z";

  if (pageNumber === 1) {
    $(".first").addClass("disabled");
    $(".previous").addClass("disabled");
    $(".next").removeClass("disabled");
    $(".last").removeClass("disabled");
  } else {
    $(".first").removeClass("disabled");
    $(".previous").removeClass("disabled");
    $(".next").removeClass("disabled");
    $(".last").removeClass("disabled");
  }

  if (pageNumber === lastPage) {
    $(".first").removeClass("disabled");
    $(".previous").removeClass("disabled");
    $(".next").addClass("disabled");
    $(".last").addClass("disabled");
  }

  $.ajax({
    url: apiURL + "/data/leaderboardRating?include=player&sort=-rating&filter=leaderboard.technicalName==" + ratingType + ";updateTime=ge=" +
      pastMonth + "&page[size]=" + pageSize + "&page[number]=" + pageNumber,
    success: function (result) {
      renderPage(result, document.getElementById("players"), id, pageSize, pageNumber);
    }
  });
};

var renderPage = function (page, element, playerId, pageSize, pageNumber) {
  removeAllChildElements(element);
  
  let players = {};
  
  for (let k = 0; k < page.included.length; k++) {
    if (page.included[k].type === "player") {
      const player = page.included[k];
      players[player.id] = player.attributes.login;
    } 
  }

  for (let i = 0; i < page.data.length; i++) {
    var playerRating = page.data[i];
    var ratedPlayerId = playerRating.relationships.player.data.id;
    var tr = document.createElement("tr");
    
    let playerName = players[ratedPlayerId];

    // Only show player with matching id when player_id is given.
    if (playerId && playerId !== ratedPlayerId) {
      tr.className = 'hidden';
    }

    tr.setAttribute("id", "tr" + i);
    element.appendChild(tr);
    var rank = document.createElement("td");
    tr.appendChild(rank);
    rank.innerHTML = (i + 1 + pageSize * (pageNumber - 1)).toString();
    var name = document.createElement("td");
    tr.appendChild(name);
    name.innerHTML = playerName;
    var rating = document.createElement("td");
    tr.appendChild(rating);
    rating.innerHTML = Math.round(playerRating.attributes.rating);
    var games = document.createElement("td");
    tr.appendChild(games);
    games.innerHTML = playerRating.attributes.totalGames;
    var stats = document.createElement("td");
    tr.appendChild(stats);
    stats.innerHTML = '<button class="player btn btn-primary" data-id="' + ratedPlayerId + '" data-name="' + playerName + '">View</button>';
  }
};

/* Utilities */

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/* Page Onclick */

$(".previous").click(function () {
  if (currentPage === 1) {
    return;
  }

  currentPage--;
  getPage(currentPage, pageSize);
});

$(".next").click(function () {
  if (currentPage === lastPage) {
    return;
  }

  currentPage++;
  getPage(currentPage, pageSize);
});

$(".first").click(function () {
  currentPage = 1;
  getPage(currentPage, pageSize);
});

$(".last").click(function () {
  currentPage = lastPage;
  getPage(currentPage, pageSize);
});

$("#forget-search").click(function () {
  init();

  if (chart.getInstance()) {
    chart.getInstance().destroy();
    $(".stats").width(0);
  }
});

var searchbar = document.getElementById("searchbar");

// Show label but insert value into the input:
new Awesomplete(searchbar, {
  list: JSON.parse(members),
  minChars: 0,
  maxItems: 5
});

searchbar.addEventListener('awesomplete-select', function (e) {
  var text = e.text;
  currentPage = text.value.page;
  getPage(text.value.page, 100, text.value.id);
});

searchbar.addEventListener('awesomplete-selectcomplete', function (e) {
  var text = e.text;
  $("#searchbar").val(text.label);
});

$(document).on('click', '.player', (function () {
  var labels = [], dataset = [];
  var id = $(this).data('id');
  var name = $(this).data('name');
  let pastYear = moment().subtract(1, 'years').format("YYYY-MM-DDTHH:mm:ss") + "Z";
  
  $.ajax({
    url: apiURL + '/data/leaderboardRatingJournal?filter=gamePlayerStats.player.id==' + id + ';leaderboard.technicalName==' + ratingType + ';gamePlayerStats.scoreTime=ge=' + pastYear + ';deviationAfter=isnull=false&fields[leaderboardRatingJournal]=meanAfter,deviationAfter,gamePlayerStats&fields[gamePlayerStats]=scoreTime&include=gamePlayerStats',
    success: function (result) {

      let gamePlayerStats = {};
      
      $.each(result.included, function (key, object) {
        if (object.type === "gamePlayerStats") {
          gamePlayerStats[object.id] = object;
        }
      });
      
      $.each(result.data, function (key, journal) {
        var statsId = journal.relationships.gamePlayerStats.data.id;
        var scoreTime = gamePlayerStats[statsId].attributes.scoreTime;
        var date = moment(scoreTime).format('MMM D, YYYY');
        var mean = journal.attributes.meanAfter;
        var deviation = journal.attributes.deviationAfter;
        labels.push(date);
        dataset.push(Math.round(mean - 3 * deviation));
      });

      var data = {
        title: {
          text: name + ' Rating over the Past Year',
          x: -20 //center
        },
        xAxis: {
          categories: labels
        },
        yAxis: {
          title: {
            text: 'Rating'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        series: [{
          name: name + '\'s Rating',
          data: dataset
        }]
      };

      chart.createChart(data);
      $("#stats").animatedScroll();
    }
  });
}));

var chart = {
  chart: '',
  getInstance: function () {
    return this.chart;
  },
  createChart: function (data) {
    this.chart = Highcharts.chart("stats", data);
  }
};

/* Init */
var pageSize = 100;
var currentPage = 1;
var init = function () {
  getPage(1, 100);
};

init();
