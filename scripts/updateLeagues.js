require('dotenv').load();

let request = require('request');
let fs = require('fs');

module.exports.run = async function run(leagueData) {

    const leaguesConfigPath = process.cwd()+'/configuration/leagues.json';

    let leaguesConfig = require(leaguesConfigPath);
    // This is for safety : making sure the rating range is sorted from HIGHER RATING to LOWER RATING
    leaguesConfig.ratingRange.sort((a, b) => b - a);
    
    let lastPageReached = false; // Breaks the fetching loop once there is no more data to reach
    let pageNumber = 1;
    
    while (!lastPageReached){
        const route = "/data/game?"+
                       "filter=featuredMod.id==6;endTime=isnull=false;validity=='VALID';endTime=ge="+formatTime(leaguesConfig.timeRange.from)+";endTime=le="+formatTime(leaguesConfig.timeRange.to)+"&"+
                       "sort=startTime&"+
                       "include=playerStats,playerStats.player&"+
                       "fields[game]=startTime,endTime&"+
                       "fields[gamePlayerStats]=beforeMean,beforeDeviation,score,player,game&"+
                       "fields[player]=login&"+
                       "page[number]="+pageNumber;
            
        await doRequest(process.env.API_URL + route, function (error, response, body) {
        
            if (error) {
                console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - ERROR while fetching Leagues data from the API page '+pageNumber+'. Returning truncated data.');
                console.log(error);
                return leagueData;
            }
            else{
                console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Leagues : Fetching page '+pageNumber+'...');
            }
            
            let entries = JSON.parse(body);
            
            let players = {};     // Players sorted by ID
            let games = {};       // Associates a game ID with informations about that game (list of player IDs, start time, ...)
            
            // No more data... Terminating the while loop
            if (entries.data.length <= 0 || entries.included.length <= 0){
                lastPageReached = true;
            }
            else{
                pageNumber ++;
            }
            
            // Parsing games
            for (let k in entries.data) {
                const record = entries.data[k];
                games[record.id] = {
                    'winner':null,
                    'participants':[],
                    'startTimestamp':moment(record.attributes.startTime).unix(),
                    'endTimestamp':moment(record.attributes.endTime).unix()
                }
            }
            
            // Parsing player stats
            for (let k in entries.included) {
                const record = entries.included[k];
                switch (record.type) {
                    case "gamePlayerStats":
                        const pid = record.relationships.player.data.id;
                        if (record.attributes.score > 0){
                            games[record.relationships.game.data.id].winner = pid;
                        }
                        if (players[pid] == undefined){
                            players[pid] = {};
                        }
                        if (players[pid].rating == undefined){
                            players[pid].rating = Math.ceil(record.attributes.beforeMean - 3*record.attributes.beforeDeviation);
                        }
                        games[record.relationships.game.data.id].participants.push(pid);
                        break;
                        
                    case "player":
                        if (players[record.id] == undefined){
                            players[record.id] = {};
                        }
                        players[record.id].login = record.attributes.login;
                        players[record.id].id = record.id;
                        break;
                    }
                }
                
                if (leagueData.games == undefined) leagueData.games = [];
                if (leagueData.playerData == undefined) leagueData.playerData = [];
                
                let categories = {};
                
                for (let k in games){
                    if (leagueData.games.indexOf(k) > -1){
                        continue;   // Game has already been calculated, skipping it
                    }
                    const game = games[k];
                    const timeElapsed = game.endTimestamp-game.startTimestamp;
                    
                    for (l in game.participants){
                        const playerRecord = players[game.participants[l]];
                        let player = {
                            'id': playerRecord.id,
                            'name': playerRecord.login,
                            'rating': playerRecord.rating,
                            'points': 0,
                            'wld': {"w":0, "l":0, "d":0},
                            'secondsPlayed': timeElapsed
                        };
                        
                        // Let's check if we don't have that player already
                        let already = false;
                        for (category in leagueData.playerData){
                            if (!already){
                                for (playerIndex in leagueData.playerData[category].data){
                                    const registeredPlayer = leagueData.playerData[category].data[playerIndex];
                                    if (registeredPlayer.id == player.id){
                                        player = registeredPlayer;
                                        already = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (player.id == game.winner){
                            player.wld.w ++;
                            player.points += 2;
                        }
                        else if (game.winner == null){
                            player.wld.d ++;
                            player.points -= 1;
                        }
                        else{
                            player.wld.l ++;
                        }
                        player.secondsPlayed += timeElapsed;     
                        if (!already){
                            const catName = getRangeName(leaguesConfig.ratingRange, player.rating);
                            let found = false;
                            for (categoryIndex in leagueData.playerData){
                                if (leagueData.playerData[categoryIndex].categoryName == catName){
                                    leagueData.playerData[categoryIndex].data.push(player);
                                    found = true;
                                    break;
                                }
                            }
                            if (!found){
                                leagueData.playerData.push({
                                    "categoryName":catName,
                                    "ratingReference":getMaximumRating(leaguesConfig.ratingRange, player.rating), // Used for sorting
                                    "data":[player]
                                });
                            }
                        }
                    }
                    
                    // Finally, we sort the player list so that the highest score is the first element in the list
                    for (category in leagueData.playerData){
                        sortList(leagueData.playerData[category].data, "points");
                    }
                    // And then we sort the categories
                    sortList(leagueData.playerData, "ratingReference");
                    
                    leagueData.games.push(k);
                }
            });
        }
    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Successfully updated the Leagues data');
    return leagueData;
};

// Returns the appropriate rating range name for the player (Ex : A player of rating 1245 will be between 1600 and 1100 (if those were given as range in the configuration file) and therefore this function will return "1599-1100" (1600 being part of the upper category))
function getRangeName(ranges, rating){
    for (let k in ranges){
        const range = ranges[k];
        if (rating >= range){
            if (k == 0){
                return range+"+";
            }
            else{
                return (ranges[k-1]-1)+"-"+range;
            }
        }
        else if (k == ranges.length-1){
            return (range-1)+"-";
        }
    }
}

// Returns the higher category rating this rating can possibly belong to. If the category isn't found, returns the lowest category -1. This is used for sorting the categories.
function getMaximumRating(ranges, rating){
    for (let k in ranges){
        const range = ranges[k];
        if (rating >= range){
            return range;
        }
    }
    return ranges[ranges.length-1] -1;
}

// Formats a timestamp so that Elide JSON API can understand it
function formatTime(timestamp){
    let d = moment(timestamp*1000);
    return d.format("YYYY-MM-DDTHH:mm:ss")+"Z";
}

// Sorts list by any var and in either asencing or descending order.
function sortList(list, key, ascending=false){
    
    const descending = !ascending;
    let switching = true;
    
    while (switching) {
        switching = false;
        for (index in list){
            if (index == 0){
                continue;
            }
            const element = list[index];
            if (
                (ascending && element[key] < list[index-1][key])
                ||
                (descending && element[key] > list[index-1][key])
               ){
                list[index] = list[index-1];
                list[index-1] = element;    
                switching = true;
            }
        }
    }
}

// Promise wrapper for request()
function doRequest(url, callback) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
        resolve(
            callback(error, res, body)
        );
    });
  });
}
