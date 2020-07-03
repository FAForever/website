$(document).ready(function() {

  // when you click on a link within a cell, we only want the link to be clicked, not the cell as well
  $(".hoverable a").click(function(event) {
    event.stopPropagation();
  });

  // when a cell is clicked, launch the page
  $(".hoverable").click(function() {

    var url = $(this).attr("data-url");
    if (typeof window.java !== 'undefined')
    {
      window.java.openUrl(url); // when hosted in java client, makes it launch in a new window
    }
    else
    {
      window.open(url, "_blank"); // normal web browser change
    }
  });

});
