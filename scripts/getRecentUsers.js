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
                let entries = JSON.parse(body);
                let finalArray = [];

                if (entries.included == undefined) return;

                for(let i = 0; i < entries.included.length; i++) {
                    let entry = entries.included[i];
                    if (entry.type != "player") continue;

                    finalArray.push(entry.attribute.login);
                }

                fs.writeFile("members/recent.json", JSON.stringify(finalArray), function(error) {
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