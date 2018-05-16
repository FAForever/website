require('dotenv').load();

let request = require('request');
let fs = require('fs');

let date = new Date();

module.exports.run = function run() {
	request(process.env.API_URL + '/leaderboards/global', function (error, response, body) {
		if (! error) {
			let entries = JSON.parse(body);

			let csvArray = [];

			for(let i = 0; i < entries.data.length; i++) {
				let entry = entries.data[i];

				let data = {
					label: entry.attributes.name,
					value: {id: entry.id, page: Math.ceil((i + 1) / 100)}
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

	request(process.env.API_URL + '/leaderboards/ladder1v1', function (error, response, body) {
		if (error) {
			return;
		}

		let entries = JSON.parse(body);

		let csvArray = [];

		for (let i = 0; i < entries.data.length; i++) {
			let entry = entries.data[i];

			let data = {
				label: entry.attributes.name,
				value: {id: entry.id, page: Math.ceil((i + 1) / 100)}
			};

			csvArray.push(data);
		}

		fs.writeFile("members/1v1.json", JSON.stringify(csvArray), function (error) {
			if (error) {
				console.log(error);
			} else {
				console.log(date + ' - User file created successfully for 1v1.');
			}
		});

		processTopFivePlayers(entries);
	});
};

function processTopFivePlayers(users) {
	let topFive = [];

	for(var i = 0; i < Math.min(users.length, 5); i++) {
		let user = users.data[i];

		let data = {
			name: user.attributes.name,
			rank: user.attributes.mean
		};

		topFive.push(data);
	}

	fs.writeFile("members/top5.json", JSON.stringify(topFive), function(error) {
		if (error) {
			console.log(error);
		} else {
			console.log(date + ' - User file created successfully for top five.');
		}
	});
}
