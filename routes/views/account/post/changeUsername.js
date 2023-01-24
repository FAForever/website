let flash = {};
const error = require('./error');
const {body, validationResult} = require('express-validator');
const axios = require('axios');

exports = module.exports = [
  // validate the input
  body('username', 'Username must be three or more characters').isLength({min: 3}),
  
  (req, res) => {
    res.locals.page = 'changeUsername';
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/settings');
    // No errors in form, continue ahead
    else {
      // pull the form variables off the request body
      let username = req.body.username;
      axios.post(`${process.env.API_URL}/users/changeUsername`, null,
        {
          headers: {'Authorization': `Bearer ${req.user.token}`},
          params: {newUsername: username}
        }).then(() => {

        // Successfully changed email
        flash.class = 'alert-success';
        flash.messages = 'Your new username was set successfully!';
        flash.type = 'Success!';
      }).catch((e) => {
        error.parseApiErrors(e.response, flash);
      }).finally(() => {
        res.render('account/settings', {flash: flash});
      });
    }
  }
];
