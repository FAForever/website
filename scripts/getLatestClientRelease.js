var GitHub = require('github-api');
var fs = require('fs');

var gh = new GitHub();

gh.getRepo('faforever', 'client').getRelease('latest', function(err, release) {
        if (!err) {
            var data = {link: release.assets[0].browser_download_url};

            fs.writeFile("link.json", JSON.stringify(data), function(error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Link file created successfully for latest client download link.');
                }
            });
        }
    }
);