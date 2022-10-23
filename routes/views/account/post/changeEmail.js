let flash = {};

let error = require('./error');
const {check, validationResult} = require('express-validator');
const axios = require("axios");

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  check('email', 'Email is required').notEmpty();
  check('email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {

    // failure
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/changeEmail', {flash: flash});

  } else {

		// pull the form variables off the request body
		let email = req.body.email;
		let password = req.body.password;
		let overallRes = res;
    
    axios.post(`${process.env.API_URL}/users/changeEmail`, {
      headers: {'Authorization': `Bearer ${req.user.token}`},
      form: {newEmail: email, currentPassword: password}

    }).then(function (err, res, body) {

        if (res.statusCode !== 200) {
          error.parseApiErrors(body, flash);
          return overallRes.render('account/changeEmail', {flash: flash});
        }
        

        // Successfully changed email
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Your email was set successfully.'}];
        flash.type = 'Success!';

        overallRes.render('account/changeEmail', {flash: flash});
        return (req.user.token);
    });
	}
};
