let flash = {};
const error = require('./error');
const axios = require('axios');
const {body, validationResult} = require("express-validator");

exports = module.exports = [
  body('password', 'New password must be six or more characters').isLength({min: 6}),
  body('password', '').custom((value, {req}) => {
    if (value !== req.body.password_confirm) {
      // throw error if passwords do not match
      throw new Error(`New passwords don't match`);
    } else {
      return value;
    }
  }),
  
  (req, res) => {
    res.locals.page = 'changePassword';
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/settings');
    // No errors in form, continue ahead
    else {

      const newPassword = req.body.password;
      const oldPassword = req.body.old_password;

      axios.post(`${process.env.API_URL}/users/changePassword`, null,
        {
          headers: {'Authorization': `Bearer ${req.user.token}`},
          params: {currentPassword: oldPassword, newPassword: newPassword}
        }).then(() => {
        // Successfully changed password
        flash.class = 'alert-success';
        flash.messages = 'Your new password was set successfully!';
        flash.type = 'Success!';
      }).catch((e) => {
        error.parseApiErrors(e.response, flash);
      }).finally(() => {
        res.render('account/settings', {flash: flash});
      });
    }
  }
];

