const delay = refreshCountersSeconds * 1000;

function updateGameCounter() {
    $.get("lobby_api", {resource: "games"}, function (gameCount) {
        if ($("#game_counter").text() === gameCount.toString()) {
          return;
        }

        $("#game_counter").fadeOut("fast", function() {
            $(this).text(gameCount).fadeIn("fast");
        });
    });
}

function updatePlayerCounter() {
    $.get("lobby_api", {resource: "players"}, function (playerCount) {
        if ($("#player_counter").text() === playerCount.toString()) {
            return;
        }

        $("#player_counter").fadeOut("fast", function() {
            $(this).text(playerCount).fadeIn("fast");
        });
    });
}

setInterval(updatePlayerCounter, delay);

setTimeout(function() {
    setInterval(updateGameCounter, delay);
}, delay / 2);

updateGameCounter();
updatePlayerCounter();

const waitBeforeShowing = setInterval(
    function() {
        if ($("#player_counter").text() !== "0" && $("#game_counter").text() !== "0") {
            $(".counters").css("opacity", 1);
            clearInterval(waitBeforeShowing);
        }
    },
    100
);
