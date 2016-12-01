var flash = {class: true, messages: [], type: true};

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'linkSteam';

	locals.formData = req.body || {};

	var result;

	if (req.query.steam_link_result) {
		result = req.query.steam_link_result;
		if (result == 'success') {
			flash.class = 'alert-success';
			flash.messages = [{msg: 'Your steam account was successfully linked!'}];
			flash.type = 'Success!';
		} else {
			flash.class = 'alert-danger';
			flash.messages = [{msg: 'Your steam account was not successfully linked! Please verify you logged in correctly to steam.'}];
			flash.type = 'Error!';
		}
	} else {
		flash = null;
	}

	//locals.steam = process.env.API_URL + '/users/link_to_steam';
	locals.steamConnect = req.protocol + '://' + req.get('host') + '/account/connect';

	// Render the view
	res.render('account/linkSteam', {flash: flash});

};
