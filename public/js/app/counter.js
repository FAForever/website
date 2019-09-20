const delay = 1000;
            
setInterval(updatePlayerCounter, delay);

setTimeout(function(){
    setInterval(updateGameCounter, delay);  
}, delay/2);

function updateGameCounter(){
    $.get('lobby_api', { resource: "games"}, function (body) {
        let games = body;
        
        if ($("#game_counter").text() == games.length.toString()) return;
        
        $("#game_counter").fadeOut('fast', function() {
            $(this).text(games.length).fadeIn('fast');
        })
    });
}

function updatePlayerCounter(){
    $.get('lobby_api', { resource: "players"}, function (body) {
        let players = body;
        if ($("#player_counter").text() == players.length.toString()) return;
        $("#player_counter").fadeOut('fast', function() {
            $(this).text(players.length).fadeIn('fast');
        })
    });
}

updateGameCounter();
updatePlayerCounter();

const waitBeforeShowing = setInterval(
    function(){
        if ($("#player_counter").text() != '0' && $("#game_counter").text() != '0'){
            $(".counters").css("opacity", 1);
            clearInterval(waitBeforeShowing);
        }
    },
    100
);
