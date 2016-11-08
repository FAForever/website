exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'competitive';
  	locals.cSection = 'global';
	locals.ratingType = 'Global';
	locals.apiURL = process.env.API_URL;
	locals.members = require('../../members/global.json');
	locals.lastPage = Math.ceil(locals.members.length / 100);

	// Render the view
	res.render('leaderboards');

};
