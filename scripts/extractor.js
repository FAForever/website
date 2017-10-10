require("dotenv-safe").config();

var request = require('request');
var fs = require('fs');

var date = new Date();

request(process.env.API_URL + '/leaderboards/global?filter[is_active]=true', function (error, response, body) {
    if (! error) {
        var users = JSON.parse(body);

        var csvArray = [];

        for(var i = 0; i < users.data.length; i++) {
            var user = users.data[i];

            var data = {
                label: user.attributes.login,
                value: { id: user.id, page: Math.ceil((i+1) / 100) }
            };

            csvArray.push(data);
        }

        fs.writeFile("members/global.json", JSON.stringify(csvArray), function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log(date + ' - User file created successfully for global.');
            }
        });

    }
});

request(process.env.API_URL + '/leaderboards/1v1?filter[is_active]=true', function (error, response, body) {
    if (! error) {
        var users = JSON.parse(body);

        var csvArray = [];

        for(var i = 0; i < users.data.length; i++) {
            var user = users.data[i];

            var data = {
                label: user.attributes.login,
                value: { id: user.id, page: Math.ceil((i+1) / 100) }
            };

            csvArray.push(data);
        }

        fs.writeFile("members/1v1.json", JSON.stringify(csvArray), function(error) {
            if (error) {
                console.log(error);
            } else {
                console.log(date + ' - User file created successfully for 1v1.');
            }
        });

    }
});
