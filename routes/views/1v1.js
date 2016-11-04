exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
	locals.cSection = '1v1';
	locals.ratingType = '1v1';
	locals.apiURL = process.env.API_URL;
	locals.members = require('../../members/1v1.json');
	locals.lastPage = Math.ceil(locals.members.length / 100);

	// Render the view
	res.render('leaderboards');

};
