require("dotenv").config();

let request = require("request");
let fs = require("fs");
let moment = require("moment");

module.exports.run = async function run(leagueData) {
    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Updating clan list...');
        
    let lastPageReached = false; // Breaks the fetching loop once there is no more data to reach
    let pageNumber = 1;
    
            
    let clans = [];
    try{
        while (!lastPageReached){
            const route = "/data/clan?" +
                           "fields[clan]=name,tag&"+
                           "page[number]="+pageNumber;
                
            await doRequest(process.env.API_URL + route, function (error, response, body) {
                if (error || response.statusCode > 210) {
                    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - ERROR while fetching clans from the API page '+pageNumber+'. Returning truncated data.');
                    console.log(error);
                    lastPageReached = true;
                    return leagueData;
                }
                else{
                    console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Clans : Fetching page '+pageNumber+'...');
                }
                
                let entries = JSON.parse(body).data;
                
                for (k in entries){
                    const clan = entries[k];
                    clans.push("[" + clan.attributes.tag +"] "+ clan.attributes.name);
                }
                
                // No more data... Terminating the while loop
                if (entries.length <= 0){
                    lastPageReached = true;
                }
                else{
                    pageNumber ++;
                }
            });
        }
                
        fs.writeFile("members/clans.json", JSON.stringify(clans), function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Clans file created successfully');
            }
        });
    }
    catch(e){
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Error while creating clans file!!');
        console.log(e);
    }
};


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
