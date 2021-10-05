exports = module.exports = function(req, res) {

	var locals = res.locals;
    var fs = require('fs');

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
	locals.cSection = '2v2';
	locals.ratingTypeTitle = '2v2';
	locals.ratingType = 'tmm_2v2';
	locals.apiURL = process.env.API_URL;

    fs.readFile('members/2v2.json', 'utf8', function (err, data) {
        if(err) return;
        locals.members = JSON.parse(data);
        locals.lastPage = Math.ceil(locals.members.length / 100);

        // Render the view
        res.render('leaderboards');
	});

};
