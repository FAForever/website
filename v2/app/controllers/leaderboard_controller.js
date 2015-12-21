FAFApp.controller('LeaderboardController', function ($scope) {

    // Headers for the tables:

    var globalheader = [
        '<thead>',
        '                    <tr>',
        '                        <th>#</th>',
        '                        <th>Player</th>',
        '                        <th>Rating</th>',
        '                        <th>Games</th>',
        '                    </tr>',
        '                </thead>'
    ].join('');

    var ladderheader = [
        '<thead>',
        '                    <tr>',
        '                        <th>#</th>',
        '                        <th>Player</th>',
        '                        <th>Rating</th>',
        '                        <th>Games</th>',
        '                        <th>Win Rate</th>',
        '                    </tr>',
        '                </thead>'
    ].join('');

    $scope.currentBoard = "global";

    $scope.currentPage = 0;

    $scope.maxPlayers = 50;

    $scope.searchField = "";

    $scope.setMaxPlayers = function (amount) {
        $scope.maxPlayers = amount;
        $scope.getPlayers($scope.currentPage * $scope.maxPlayers);
    };

    $scope.changeBoard = function (newBoard) {
        $scope.currentBoard = newBoard;
        $scope.currentPage = 0;
        $scope.getPlayers(0);
        if (newBoard == "1v1") {
            $("#globalbutton").removeClass("active");
            $("#ladderbutton").addClass("active");
        } else {
            $("#globalbutton").addClass("active");
            $("#ladderbutton").removeClass("active");
        }
        $(".previous").addClass("disabled");
    };

    $scope.changePage = function (newPage) {
        if ($scope.currentPage + newPage < 0) {
            return;
        }

        if ($scope.currentPage + newPage == 0) {
            $(".previous").addClass("disabled");
        } else {
            $(".previous").removeClass("disabled");
        }

        $scope.currentPage += newPage;
        $scope.getPlayers($scope.currentPage * $scope.maxPlayers);
    };

    $scope.findPlayer = function () {
        $.post('http://content.faforever.com/faf/leaderboards/get_players.php', {player: $scope.searchField.toLowerCase(), max_players: $scope.maxPlayers, board: $scope.currentBoard}, function (html) {
            html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, "");

            if ($scope.currentBoard == "global") {
                $('#playerlist').html(globalheader + html);
            } else {
                $('#playerlist').html(ladderheader + html);
            }

            $(".highlight").addClass("info");

            $scope.currentPage = Math.round($(".rank").html() / $scope.maxPlayers);
            if ($scope.currentPage == 0) {
                $(".previous").addClass("disabled");
            } else {
                $(".previous").removeClass("disabled");
            }

            $('html').scrollTo(".highlight");
        });
    };

    $scope.getPlayers = function (startIndex) {
        //Zep's API returns HTML, extremely ugly code ahead
        $.post('http://content.faforever.com/faf/leaderboards/get_players.php', {pos_start: startIndex, max_players: $scope.maxPlayers, board: $scope.currentBoard}, function (html) {
            //There's some script after the html, let's get rid of it
            html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, "");

            if ($scope.currentBoard == "global") {
                $('#playerlist').html(globalheader + html);
            } else {
                $('#playerlist').html(ladderheader + html);
            }

        });
    };
    
    $scope.gotoBottom = function() {
        $('html').scrollTo("footer");
    };
    
    $scope.gotoTop = function() {
        $('html').scrollTo("#top");
    };

    //INIT
    $scope.getPlayers(0);
    $("#globalbutton").addClass("active");
    $(".previous").addClass("disabled");
});