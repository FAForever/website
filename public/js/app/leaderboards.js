/*
 https://api.faforever.com/leaderboards/ladder1v1?page[size]=50&page[number]=1
 */

var getPage = function(pageNumber, pageSize, id) {
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
    url: apiURL + "/leaderboards/" + ratingType + "?page[size]=" + pageSize + "&page[number]=" + pageNumber,
    success: function (result) {
      renderPage(result, document.getElementById("players"), id);
    }
  });
};

var renderPage = function (page, element, playerId) {
  removeAllChildElements(element);

  for(var i = 0; i < page.data.length; i++) {
    var player = page.data[i];
    var tr = document.createElement("tr");

    // Only show player with matching id when player_id is given.
    if (playerId && playerId != player.id) {
        tr.className = 'hidden';
    }

    tr.setAttribute("id", "tr" + i);
    element.appendChild(tr);
    var rank = document.createElement("td");
    tr.appendChild(rank);
    rank.innerHTML = player.attributes.rank;
    var name = document.createElement("td");
    tr.appendChild(name);
    name.innerHTML = player.attributes.name;
    var rating = document.createElement("td");
    tr.appendChild(rating);
    rating.innerHTML = player.attributes.rating;
    var games = document.createElement("td");
    tr.appendChild(games);
    games.innerHTML = player.attributes.numGames;
    var stats = document.createElement("td");
    tr.appendChild(stats);
    stats.innerHTML = '<button class="player btn btn-primary" data-id="' + player.id + '" data-name="' + player.attributes.name + '">View</button>';
  }
};

/* Utilities */

var removeAllChildElements = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

/* Page Onclick */

$(".previous").click( function() {
  if (currentPage === 1) {
    return;
  }

  currentPage--;
  getPage(currentPage, pageSize);
});

$(".next").click( function() {
  if (currentPage === lastPage) {
    return;
  }

  currentPage++;
  getPage(currentPage, pageSize);
});

$(".first").click( function() {
  currentPage = 1;
  getPage(currentPage, pageSize);
});

$(".last").click( function() {
  currentPage = lastPage;
  getPage(currentPage, pageSize);
});

$("#forget-search").click( function() {
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

searchbar.addEventListener('awesomplete-select', function(e){
  var text = e.text;
  currentPage = text.value.page;
  getPage(text.value.page, 100, text.value.id);
});

searchbar.addEventListener('awesomplete-selectcomplete', function(e){
  var text = e.text;
  $("#searchbar").val(text.label);
});

$(document).on('click', '.player', (function(){
  var labels = [], dataset = [];
  var id = $(this).data('id');
  var name = $(this).data('name');
  var pastYear = moment().subtract(1, 'years').unix();

  let featuredMod = ratingType === 'ladder1v1' ? 'ladder1v1' : 'faf';
  $.ajax({
		url: apiURL + '/data/gamePlayerStats?filter=player.id==' + id + ';game.featuredMod.technicalName==' + featuredMod + ';scoreTime=gt='+formatTime(pastYear)+';afterDeviation=isnull=false&fields[gamePlayerStats]=afterMean,afterDeviation,scoreTime',
    success: function(result) {
       $.each(result.data, function(key, stats){
          var date = moment(stats.attributes.scoreTime).format('MMM D, YYYY');
          var mean = stats.attributes.afterMean;
          var deviation = stats.attributes.afterDeviation;
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
  getInstance: function() {
    return this.chart;
  },
  createChart: function(data) {
    this.chart = Highcharts.chart("stats", data);
  }
};

/* Init */
var pageSize = 100;
var currentPage = 1;
var init = function() {
  getPage(1, 100);
};

init();


// Formats a timestamp so that Elide JSON API can understand it
function formatTime(unix_timestamp){
    let d = moment(unix_timestamp*1000);
    return d.format("YYYY-MM-DDTHH:mm:ss")+"Z";
}