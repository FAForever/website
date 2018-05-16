let flash = {};
let request = require('request');

exports = module.exports = function(req, res) {

	let locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
	req.checkBody('old_password', 'Old Password is required').notEmpty();
	req.checkBody('old_password', 'Old Password must be six or more characters').isLength({min: 6});
	req.checkBody('password', 'New Password is required').notEmpty();
	req.checkBody('password', 'New Password must be six or more characters').isLength({min: 6});
	req.checkBody('password', 'New Passwords don\'t match').isEqual(req.body.password_confirm);
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

		res.render('account/changePassword', {flash: flash});

	} else {

		//Encrypt password before sending it off to endpoint
		let newPassword = req.body.password;
		let oldPassword = req.body.old_password;
		let username = req.body.username;

		let overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/changePassword',
			headers: {'Authorization': 'Bearer ' + req.user.data.attributes.token},
			form: {name: username, currentPassword: oldPassword, newPassword: newPassword}
		}, function (err, res, body) {

			let resp;
			let errorMessages = [];

			if (res.statusCode !== 200) {
				try {
					resp = JSON.parse(body)
				} catch (e) {
					errorMessages.push({msg: 'Invalid change password. Please try again later.'});
					flash.class = 'alert-danger';
					flash.messages = errorMessages;
					flash.type = 'Error!';

					return overallRes.render('account/changePassword', {flash: flash});
				}

				// Failed resetting password
				for (let i = 0; i < resp.errors.length; i++) {
					let error = resp.errors[i];

					errorMessages.push({msg: error.detail});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				return overallRes.render('account/changePassword', {flash: flash});
			}

			// Successfully reset password
			flash.class = 'alert-success';
			flash.messages = [{msg: 'Your password was changed successfully. Please use the new password to log in!'}];
			flash.type = 'Success!';

			overallRes.render('account/changePassword', {flash: flash});
		});
	}
};
