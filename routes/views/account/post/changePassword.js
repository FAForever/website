let flash = {};
const error = require('./error');
const axios = require('axios');
const {body, validationResult} = require("express-validator");


const checkNewPassword = [
  body('old_password', 'Old Password is required').notEmpty(),
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
    if (!validationResult(req).isEmpty()) {
      let errorArray = [];
      //We are putting a space in our forEach so that the errors comma don't stick to the next error.
      validationResult(req).errors.forEach(error => errorArray.push(` ${error.msg}`));
      flash.class = 'alert-danger';
      flash.messages = errorArray;
      flash.type = 'Error!';
      res.render('account/settings', {flash: flash});
    } else {
      
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
  },

];

exports = module.exports = checkNewPassword;
