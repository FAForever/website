exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'linkSteam';

	locals.formData = req.body || {};

	locals.steam = process.env.API_URL + '/users/link_to_steam';

	// Render the view
	res.render('account/linkSteam');

};
