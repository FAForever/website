let flash = {};
const error = require('./error');
const {check, validationResult} = require('express-validator');
const axios = require("axios");

exports = module.exports = function (req, res) {
  res.locals.formData = req.body || {};

  // validate the input
  check('username', 'Username is required').notEmpty();
  check('username', 'Username must be three or more characters').isLength({min: 3});

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {
    console.log(errors);
    // failure
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';
    res.render('account/settings  ', {flash: flash});
    
  } else {
    // pull the form variables off the request body
    let username = req.body.username;
    axios.post(`${process.env.API_URL}/users/changeUsername`, null,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
        params: {newUsername: username}
      }).then(response => {
      console.log(response);
      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your new username was set successfully!'}];
      flash.type = 'Success!';
    }).catch((e) => {
      error.parseApiErrors(e.response, flash);
    }).finally(() => {
      res.render('account/settings', {flash: flash});
    });
  }
};
