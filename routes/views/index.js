exports = module.exports = function(req, res) {

	var locals = res.locals;
	var fs = require('fs');
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	fs.readFile('members/top5.json', 'utf8', function (err, data) {
		locals.topPlayers = JSON.parse(data);

		// Render the view
		res.render('index');
	});
	
};
