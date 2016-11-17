var flash = {};
var request = require('request');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	locals.formData = req.body || {};

	// validate the input
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

		res.render('account/changeUsername', {flash: flash});

	} else {

		var username = req.body.username;

		var overallRes = res;

		//Run post to reset endpoint
		request.post({
			url: process.env.API_URL + '/users/change_name',
            headers: {'Authorization':'Bearer ' + req.user.data.attributes.token},
			form : {desired_name: username}
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
					errorMessages.push({msg: 'Invalid change username. Please try again later.'});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
				flash.type = 'Error!';

				overallRes.render('account/changeUsername', {flash: flash});
			} else {
				// Successfully reset password
				flash.class = 'alert-success';
				flash.messages = [{msg: 'Your username was changed successfully. Please use the new username to log in!'}];
				flash.type = 'Success!';

				overallRes.render('account/changeUsername', {flash: flash});
			}
		});

	}

};
