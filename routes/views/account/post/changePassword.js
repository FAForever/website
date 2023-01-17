let flash = {};
const error = require('./error');
const {validationResult} = require('express-validator');
const axios = require('axios');



exports = module.exports = function (req, res) {
  res.locals.page = 'changePassword';
  // validate the input
  
  
  // check the validation object for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorArray = [];
    //We are putting a space in our forEach so that the errors comma don't stick to the next error.
    errors.errors.forEach(error => errorArray.push(` ${error.msg}`));
    flash.class = 'alert-danger';
    flash.messages = errorArray;
    flash.type = 'Error!';
    
    res.render('account/settings', {flash: flash});

  } else {
    //Encrypt password before sending it off to endpoint
    const newPassword = req.body.password;
    const oldPassword = req.body.old_password;
    //let username = req.body.username;
    
    axios.post(`${process.env.API_URL}/users/changePassword`, null,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
        params: {currentPassword: oldPassword, newPassword: newPassword}
      }).then(response => {
      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = 'Your new password was set successfully!';
      flash.type = 'Success!';
    }).catch((e) => {
      error.parseApiErrors(e.response, flash);
    }).finally(() => {
      res.render('account/settings', {flash: flash});
    });
  }
};
