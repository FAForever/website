require('dotenv').load();

let request = require('request');
let fs = require('fs');


module.exports.run = function run() {
    
    let date = new Date();
    date.setDate( date.getDate() - 1 ); // Remove one day
    const requestUrl =
        process.env.API_URL + '/data/game'+
            '?filter=endTime=gt="'+date.toISOString()+'"'+
            '&include=playerStats.player'+
            '&fields[player]=login'+
            '&sort=-endTime'
        ;
     
	request(
        requestUrl,        
        function (error, response, body) {
            if (! error) {
                let apiRecentPlayers = JSON.parse(body);
                let recentPlayers = [];

                if (apiRecentPlayers.included == undefined){
                    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Tried to update the list of recent players, but there is no one.');
                    return;
                }

                for(i in apiRecentPlayers.included) {
                    let entry = apiRecentPlayers.included[i];
                    if (entry.type != "player") continue;
                    
                    recentPlayers.push(entry.attributes.login);
                }

                fs.writeFile("members/recent.json", JSON.stringify(recentPlayers), function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Recent players file created successfully');
                    }
                });

            }
        }
    );
};
