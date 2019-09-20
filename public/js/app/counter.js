const delay = 1000;

$("#game_counter").parent().hide().fadeIn();
            
setInterval(function(){
    $.get('lobby_api', { resource: "players"}, function (body) {
        let players = body;
        if ($("#player_counter").text() == players.length.toString()) return;
        $("#player_counter").fadeOut('fast', function() {
            $(this).text(players.length).fadeIn('fast');
        })
    });
}, delay);

setTimeout(function(){
    setInterval(function(){
        $.get('lobby_api', { resource: "games"}, function (body) {
            let games = body;
            
            if ($("#game_counter").text() == games.length.toString()) return;
            
            $("#game_counter").fadeOut('fast', function() {
                $(this).text(games.length).fadeIn('fast');
            })
        });
    }, delay);  
}, delay/2);
