/*

 http://api.faforever.com/ranked1v1?page[size]=50&page[number]=1&filter[is_active]=true
 http://api.faforever.com/ranked1v1/500

 */

var getPage = function(pageNumber, pageSize, id) {
  $.ajax({
    url: apiURL + "/leaderboards/" + ratingType + "?page[size]=" + pageSize + "&page[number]=" + pageNumber + "&filter[is_active]=true",
    success: function (result) {
      renderPage(result, document.getElementById("players"), id);
    }
  });
};

var renderPage = function (page, element, id) {
  removeAllChildElements(element);
  for(var i = 0; i < page.data.length; i++) {
    var player = page.data[i];
    var tr = document.createElement("tr");

      //If id, then only show that user
      if (id && id != player.id) {
          tr.className = 'hidden';
      }

    tr.setAttribute("id", "tr" + i);
    element.appendChild(tr);
    var rank = document.createElement("td");
    tr.appendChild(rank);
    rank.innerHTML = player.attributes.ranking;
    var name = document.createElement("td");
    tr.appendChild(name);
    name.innerHTML = player.attributes.login;
    var rating = document.createElement("td");
    tr.appendChild(rating);
    rating.innerHTML = player.attributes.rating;
    var games = document.createElement("td");
    tr.appendChild(games);
    games.innerHTML = player.attributes.num_games;
    var stats = document.createElement("td");
    tr.appendChild(stats);
    stats.innerHTML = '<button class="player btn btn-primary" data-id="' + player.id + '" data-name="' + player.attributes.login + '">View</button>';
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
    list: JSON.parse(members)
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

  var labels = [],
  dataset = [];

  var id = $(this).data('id');
  var name = $(this).data('name');

  var pastYear = moment().subtract(1, 'years').unix();

  $.ajax({
    url: apiURL + '/players/' + id + '/ratings/' + ratingType + '/history',
    success: function(result) {
      $.each(result.data.attributes.history, function(unixTime, values){

        //Only get information for past year for chart...
        if (unixTime > pastYear) {
          var date = moment.unix(unixTime).format('MMM D, YYYY');
          var mean = values[0];
          var deviation = values[1];
          labels.push(date);
          dataset.push(Math.round(mean - 3 * deviation));
        }
      });

      var data = {
        labels: labels,
        datasets: [ {
          label: name + ' Rating over the Past Year',
          data: dataset,
          backgroundColor: "rgba(0, 140, 186, 0.4)"
        }]
      };

      var ctx = $(".stats");

      chart.createChart(ctx, data);

      $(".stats").animatedScroll();

    }
  });

}));

var chart = {
    chart: '',

    getInstance: function() {
        return this.chart;
    },

    createChart: function(ctx, data) {
        this.chart = new Chart(ctx, {
            type: 'line',
            data: data
        });
    }
};

/* Init */
var pageSize = 100;

var currentPage = 1;

var init = function() {
    getPage(1, 100);
};

init();

