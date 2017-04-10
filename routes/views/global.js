exports = module.exports = function(req, res) {

	var locals = res.locals;
    var fs = require('fs');

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
  	locals.cSection = 'global';
	locals.ratingType = 'Global';
	locals.apiURL = process.env.API_URL;
    fs.readFile('members/global.json', 'utf8', function (err, data) {
        locals.members = JSON.parse(data);
        locals.lastPage = Math.ceil(locals.members.length / 100);

        // Render the view
        res.render('leaderboards');
    });
};
