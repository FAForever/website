let flash = {};
const axios = require('axios');
const error = require('./error')
const {check, validationResult} = require('express-validator');

exports = module.exports = function (req, res) {
  
  res.locals.formData = req.body || {};
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
    res.render('account/settings', {flash: flash});
  } else {
    // pull the form variables off the request body
    let email = req.body.email;
    let password = req.body.password;
    
    axios.post(`${process.env.API_URL}/users/changeEmail`, null,
       {
         headers: {'Authorization': `Bearer ${req.user.token}`},
         params: {newEmail: email, currentPassword: password}
       }).then( response => {
      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your new email was set successfully!'}];
      flash.type = 'Success!';
    }).catch(e => {
      error.parseApiErrors(e.response, flash);
    }).finally( ()=>{
      res.render('account/settings', {flash: flash});
    });
  }
};
