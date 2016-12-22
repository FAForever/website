var flash = {};
var request = require('request');
var SHA256 = require("crypto-js/sha256");

exports = module.exports = function(req, res) {

	var locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('username', 'Username must be three or more characters').isLength({min: 3});
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password must be six or more characters').isLength({min: 6});
	req.checkBody('password', 'Passwords don\'t match').isEqual(req.body.password_confirm);
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();

	// check the validation object for errors
	var errors = req.validationErrors();

	//Must have client side errors to fix
	if (errors) {

		// failure
		flash.class = 'alert-danger';
		flash.messages = errors;
		flash.type = 'Error!';

		res.render('account/resetPassword', {flash: flash});

	} else {

		// pull the form variables off the request body
		var username = req.body.username;
		var email 	 = req.body.email;

		//Encrypt password before sending it off to endpoint
		var password = SHA256(req.body.password).toString();

		var overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/reset_password',
			form : {name: username, email: email, pw_hash: password}
		}, function (err, res, body) {
			//Check to see if valid user
			if(body != 'ok') {
				var errorMessages = [];

				//Must not be valid, check to see if errors, otherwise return generic error.
				try {
					var errors = JSON.parse(body);

					for(var i = 0; i < errors.errors.length; i++) {
						var error = errors.errors[i];

						errorMessages.push({msg: error.detail});
					}
				} catch(e) {
					errorMessages.push({msg: 'Invalid reset password. Please try again later.'});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				overallRes.render('account/resetPassword', {flash: flash});
			} else {
				// Successfully reset password
				flash.class = 'alert-success';
				flash.messages = [{msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.'}];
				flash.type = 'Success!';

				overallRes.render('account/resetPassword', {flash: flash});
			}
		});

	}

};
