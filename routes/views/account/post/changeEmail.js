let flash = {};
const axios = require('axios');
const error = require('./error');
const {body, validationResult} = require('express-validator');

exports = module.exports = [
  // validate the input
  body('email', 'Email does not appear to be valid').isEmail(),

  (req, res) => {
    res.locals.page = 'changeEmail';
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/settings');
    // No errors in form, continue ahead
    else {
      // pull the form variables off the request body
      const email = req.body.email;
      const password = req.body.password;
      axios.post(`${process.env.API_URL}/users/changeEmail`, null,
        {
          headers: {'Authorization': `Bearer ${req.user.token}`},
          params: {newEmail: email, currentPassword: password}
        }).then( () => {
        // Successfully changed email
        //console.log(res)
        //console.log(res.status)
        flash.class = 'alert-success';
        flash.messages = 'Your new email was set successfully!';
        flash.type = 'Success!';
      }).catch(e => {
        error.parseApiErrors(e.response, flash);
      }).finally(() => {
        res.render('account/settings', {flash: flash});
      });
    }
  },
];
