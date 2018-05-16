let flash = {};
let request = require('request');

exports = module.exports = function (req, res) {

	let locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();

	// check the validation object for errors
	let errors = req.validationErrors();

	//Must have client side errors to fix
	if (errors) {

		// failure
		flash.class = 'alert-danger';
		flash.messages = errors;
		flash.type = 'Error!';

		res.render('account/changEmail', {flash: flash});

	} else {

		// pull the form variables off the request body
		let email = req.body.email;
		let password = req.body.password;

		let overallRes = res;

		request.post({
			url: process.env.API_URL + '/users/changeEmail',
			headers: {'Authorization': 'Bearer ' + req.user.data.attributes.token},
			form: {newEmail: email, currentPassword: password}
		}, function (err, res, body) {

			let resp;
			let errorMessages = [];

			if (res.statusCode !== 200) {
				try {
					resp = JSON.parse(body);
				} catch (e) {
					errorMessages.push({msg: 'Invalid email. Please try again later.'});
					flash.class = 'alert-danger';
					flash.messages = errorMessages;
					flash.type = 'Error!';

					return overallRes.render('account/changEmail', {flash: flash});
				}

				// Failed changing email
				for (let i = 0; i < resp.errors.length; i++) {
					let error = resp.errors[i];

					errorMessages.push({msg: error.detail});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				return overallRes.render('account/changEmail', {flash: flash});
			}

			// Successfully changed email
			flash.class = 'alert-success';
			flash.messages = [{msg: 'Your email was set successfully. Please use the new email to log in!'}];
			flash.type = 'Success!';

			overallRes.render('account/changEmail', {flash: flash});
		});
	}
};
