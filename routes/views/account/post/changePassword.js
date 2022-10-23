let flash = {};
let request = require('request');
let error = require('./error');
const {check, validationResult} = require('express-validator');

exports = module.exports = function(req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  check('old_password', 'Old Password is required').notEmpty();
  check('old_password', 'Old Password must be six or more characters').isLength({min: 6});
  check('password', 'New Password is required').notEmpty();
  check('password', 'New Password must be six or more characters').isLength({min: 6});
  check('password', 'New Passwords don\'t match').equals(req.body.password_confirm);
  check('username', 'Username is required').notEmpty();
  check('username', 'Username must be three or more characters').isLength({min: 3});

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {

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
			headers: {'Authorization': 'Bearer ' + req.user.token},
			form: {name: username, currentPassword: oldPassword, newPassword: newPassword}
		}, function (err, res, body) {

			if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
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
