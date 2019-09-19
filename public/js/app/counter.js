const delay = 3000;

$("#game_counter").parent().hide().fadeIn();
            
setInterval(function(){
    $.get('lobby_api', { resource: "players"}, function (body) {
        let entries = body;
        if ($("#player_counter").text() == entries.length.toString()) return;
        $("#player_counter").fadeOut('fast', function() {
            $(this).text(entries.length).fadeIn('fast');
        })
    });
}, delay);

setTimeout(() => {
    setInterval(function(){
        console.log($("#game_counter").parent());
        $.get('lobby_api', { resource: "games"}, function (body) {
            let entries = body;
            if ($("#game_counter").text() == entries.length.toString()) return;
            $("#game_counter").fadeOut('fast', function() {
                $(this).text(entries.length).fadeIn('fast');
            })
        });
    }, delay);  
}, delay/2);