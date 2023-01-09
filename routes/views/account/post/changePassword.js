let flash = {};
const error = require('./error');
const {check, validationResult} = require('express-validator');
const axios = require("axios");

exports = module.exports = function (req, res) {

  res.locals.formData = req.body || {};

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

    res.render('account/settings', {flash: flash});

  } else {

    //Encrypt password before sending it off to endpoint
    let newPassword = req.body.password;
    let oldPassword = req.body.old_password;
    let username = req.body.username;
    
    axios.post(`${process.env.API_URL}/users/changePassword`, null,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
        params: {name: username, currentPassword: oldPassword, newPassword: newPassword}
      }).then(response => {
      console.log(response);
      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your new password was set successfully!'}];
      flash.type = 'Success!';
    }).catch((e) => {
      error.parseApiErrors(e.response, flash);
    }).finally(() => {
      res.render('account/settings', {flash: flash});
    });
  }
};
