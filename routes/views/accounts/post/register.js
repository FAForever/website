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

		res.render('account/register', {flash: flash});

	} else {

		// pull the form variables off the request body
		var username = req.body.username;
		var email 	 = req.body.email;

		//Encrypt password before sending it off to endpoint
		var password = SHA256(req.body.password).toString();

		var overallRes = res;

		//Run post to register endpoint
		request.post({
			url: process.env.API_URL + '/users/register',
			form : {name: username, email: email, pw_hash: password}
		}, function (err, res, body) {
			//Check to see if valid user
			var resp = JSON.parse(body);
			if(resp.response != 'ok') {
				var errorMessages = [];

				//Must not be valid, check to see if errors, otherwise return generic error.
				try {

					for(var i = 0; i < resp.errors.length; i++) {
						var error = resp.errors[i];

						errorMessages.push({msg: error.detail});
					}
				} catch(e) {
					errorMessages.push({msg: 'Invalid registration sign up. Please try again later.'});
				}

				flash.class = 'alert-danger';
				flash.messages = errorMessages;
                flash.type = 'Error!';

				overallRes.render('account/register', {flash: flash});
			} else {
				// Successfully registered user
				flash.class = 'alert-success';
				flash.messages = [{msg: 'Please check your email to verify your registration. Then you will be ready to log in!'}];
                flash.type = 'Success!';

				overallRes.render('account/register', {flash: flash});
			}
		});

	}

};
