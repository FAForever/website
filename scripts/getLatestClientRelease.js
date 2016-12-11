var GitHub = require('github-api');
var fs = require('fs');

var gh = new GitHub();

//Get main client
gh.getRepo('faforever', 'client').getRelease('latest', function(err, release) {
    if (!err) {
        var data = {client_link: release.assets[0].browser_download_url};

        //Get downlords client releases
        gh.getRepo('faforever', 'downlords-faf-client').listReleases(function(err, release) {
            if (!err) {

                data = {
                    downlords_faf_client_link: release[0].assets[0].browser_download_url,
                    client_link: data.client_link
                };

                //Write to file
                fs.writeFile("../link.json", JSON.stringify(data), function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Link file created successfully for latest client links.');
                    }
                });
            }
        });

    }
}
);

