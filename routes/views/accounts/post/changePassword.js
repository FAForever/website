var flash = {};
var request = require('request');
var SHA256 = require("crypto-js/sha256");

exports = module.exports = function(req, res) {

	var locals = res.locals;

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
	var errors = req.validationErrors();

	//Must have client side errors to fix
	if (errors) {

		// failure
		flash.class = 'alert-danger';
		flash.messages = errors;
		flash.type = 'Error!';

		res.render('account/changePassword', {flash: flash});

	} else {

		//Encrypt password before sending it off to endpoint
		var newPassword = SHA256(req.body.password).toString();
		var oldPassword = SHA256(req.body.old_password).toString();
		var username = req.body.username;

		var overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/change_password',
			headers: {'Authorization':'Bearer ' + req.user.data.attributes.token},
			form : {name: username, pw_hash_old: oldPassword, pw_hash_new: newPassword}
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
					errorMessages.push({msg: 'Invalid change password. Please try again later.'});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				overallRes.render('account/changePassword', {flash: flash});
			} else {
				// Successfully reset password
				flash.class = 'alert-success';
				flash.messages = [{msg: 'Your password was changed successfully. Please use the new password to log in!'}];
				flash.type = 'Success!';

				overallRes.render('account/changePassword', {flash: flash});
			}
		});

	}

};
