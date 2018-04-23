var GitHub = require('github-api');
var fs = require('fs');

var gh = new GitHub();
var date = new Date();

module.exports.run = function run() {
	//Get main client
	gh.getRepo('faforever', 'client').listReleases(function(err, releases) {
		if (!err) {
			var release = getPythonClientStableRelease(releases);
			if (release === null) {
				console.log("No Python client stable version was found!");
				return;
			}
			var data = {client_link: release.assets[0].browser_download_url};

			//Get downlords client releases
			gh.getRepo('faforever', 'downlords-faf-client').listReleases(function(err, release) {
				if (!err) {

					data = {
						downlords_faf_client_link: release[0].assets[0].browser_download_url,
						client_link: data.client_link
					};

					//Write to file
					fs.writeFile("link.json", JSON.stringify(data), function(err) {
						if (err) {
							console.log(err);
							verifyOutput();
						} else {
							console.log(date + ' - Link file created successfully for latest client links.');
						}
					});
				} else {
					console.log(err);
					verifyOutput();
				}
			});

		} else {
			console.log(err);
			verifyOutput();
		}
	});

	function getPythonClientStableRelease(releases) {
		for (var i = 0; i < releases.length ; i++) {
			//FIXME - use some semver parser for this
			var version = releases[i].tag_name;
			var minor_version = parseInt(version.split(".")[1]);
			var is_stable = minor_version % 2 === 0;
			if (is_stable)
				return releases[i];
		}
		return null;
	}

	function verifyOutput()
	{
		//Try to read the file after creating it
		fs.readFile('link.json', 'utf8', function (err, data) {
			try {
				//Must of parsed out properly
				clientLink = JSON.parse(data);
			} catch (e) {
				//Must not have...
				console.log(date + ' - Link file incorrectly made. Data was - ' + data);
				//Write default values to file...
				data = {
					client_link: 'https://github.com/FAForever/client/releases',
					downlords_faf_client_link: 'https://github.com/FAForever/downlords-faf-client/releases'
				};
				fs.writeFile("link.json", JSON.stringify(data), function(error) {
					if (error) {
						console.log(error);
					} else {
						console.log(date + ' - Link file verified.');
					}
				});
			}
		});
	}
}
