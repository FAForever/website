var flash = {};
var request = require('request');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
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

		res.render('account/changEmail', {flash: flash});

	} else {

		// pull the form variables off the request body
		var email 	 = req.body.email;

		var overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/change_email',
			headers: {'Authorization':'Bearer ' + req.user.data.attributes.token},
			form : {new_email: email}
		}, function (err, res, body) {
			//Check to see if valid user
			var resp = JSON.parse(body)
			if(resp.response != 'ok') {
				var errorMessages = [];

				//Must not be valid, check to see if errors, otherwise return generic error.
				try {

					for(var i = 0; i < resp.errors.length; i++) {
						var error = resp.errors[i];

						errorMessages.push({msg: error.detail});
					}
				} catch(e) {
					errorMessages.push({msg: 'Invalid email. Please try again later.'});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				overallRes.render('account/changEmail', {flash: flash});
			} else {
				// Successfully reset password
				flash.class = 'alert-success';
				flash.messages = [{msg: 'Your email was set successfully. Please use the new email to log in!'}];
				flash.type = 'Success!';

				overallRes.render('account/changEmail', {flash: flash});
			}
		});

	}

};
