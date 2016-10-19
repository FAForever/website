var flash = {};
var request = require('request');

exports = module.exports = function(req, res) {

	// validate the input
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password', 'Password should be equal to confirmed password').isEqual(req.body.password_confirm);
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email does not appear to be valid').isEmail();

	// check the validation object for errors
	var errors = req.validationErrors();

	if (errors) {

		// failure

		console.log(errors);

		flash.type = 'alert-danger';
		flash.messages = [{msg: errors}];

		res.render('register', {flash: flash});

	} else {

		// pull the form variables off the request body
		var username = req.body.username;
		var password = req.body.password;
		var email 	 = req.body.email;

		request.post({
			url: 'api.faforever.com/users/register',
			form : {name: username, email: email, pw_hash: password}
		}, function (err, res, body) {
			console.log(body);
		});

		// success

		console.log('success');

		flash.type = 'alert-success';
		flash.messages = [{msg: 'Please check your email to verify your registration. Then you will be ready to log in!'}];

		res.render('login', {flash: flash});

	}

};
