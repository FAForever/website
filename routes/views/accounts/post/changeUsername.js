let flash = {};
let request = require('request');

exports = module.exports = function (req, res) {

	let locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('username', 'Username must be three or more characters').isLength({min: 3});

	// check the validation object for errors
	let errors = req.validationErrors();

	//Must have client side errors to fix
	if (errors) {

		// failure
		flash.class = 'alert-danger';
		flash.messages = errors;
		flash.type = 'Error!';

		res.render('account/changeUsername', {flash: flash});

	} else {

		let username = req.body.username;
		let overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/changeUsername',
			headers: {'Authorization': 'Bearer ' + req.user.data.attributes.token},
			form: {newUsername: username}
		}, function (err, res, body) {

			let resp;
			let errorMessages = [];

			if (res.statusCode !== 200) {
				try {
					resp = JSON.parse(body);
				} catch (e) {
					errorMessages.push({msg: 'Invalid change username. Please try again later.'});
					flash.class = 'alert-danger';
					flash.messages = errorMessages;
					flash.type = 'Error!';

					return overallRes.render('account/changeUsername', {flash: flash});
				}

				// Failed changing username
				for (let i = 0; i < resp.errors.length; i++) {
					let error = resp.errors[i];

					errorMessages.push({msg: error.detail});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				return overallRes.render('account/changeUsername', {flash: flash});
			}

			// Successfully changed username
			flash.class = 'alert-success';
			flash.messages = [{msg: 'Your username was changed successfully. Please use the new username to log in!'}];
			flash.type = 'Success!';

			overallRes.render('account/changeUsername', {flash: flash});
		});
	}
};
