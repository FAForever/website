var GitHub = require('github-api');
var fs = require('fs');

var gh = new GitHub();

module.exports.run = function run() {
  console.log(moment().format("DD-MM-YYYY - HH:mm:ss")  + ' - Updating the client links...');
  function verifyOutput()
  {
    //Try to read the file after creating it
    fs.readFile('link.json', 'utf8', function (err, data) {
      try {
        //Must of parsed out properly
        clientLink = JSON.parse(data);
      } catch (e) {
        //Must not have...
        console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Link file incorrectly made. Data was - ' + data);
        //Write default values to file...
        data = {
          downlords_faf_client_link: 'https://github.com/FAForever/downlords-faf-client/releases'
        };
        fs.writeFile("link.json", JSON.stringify(data), function(error) {
          if (error) {
            console.log(error);
          } else {
            console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Link file verified.');
          }
        });
      }
    });
  }
  
	//Get main client
	gh.getRepo('faforever', 'downlords-faf-client').getRelease('latest', function(err, release) {
		if (!err) {
		  var exeAsset = release.assets.filter(function (asset) {
        return asset.name.includes('.exe');
      })[0];
		  
			var data = {
        downlords_faf_client_link: exeAsset.browser_download_url
      };
			
      //Write to file
      fs.writeFile("link.json", JSON.stringify(data), function(err) {
        if (err) {
          console.log(err);
          verifyOutput();
        } else {
          console.log(moment().format("DD-MM-YYYY - HH:mm:ss") + ' - Link file created successfully for latest client links.');
        }
      });
				

		} else {
			console.log(err);
			verifyOutput();
		}
	});
};

