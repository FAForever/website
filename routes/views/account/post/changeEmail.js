let flash = {};
const axios = require('axios');
const error = require('./error');
const {body, validationResult} = require('express-validator');

exports = module.exports = [
  // validate the input
  body('email', 'Email does not appear to be valid').isEmail(),
  // check the validation object for errors
  (req, res) => {
    res.locals.page = 'changeEmail';
    if (!validationResult(req).isEmpty()) {
      let errorArray = [];
      //We are putting a space in our forEach so that the errors comma don't stick to the next error.
      validationResult(req).errors.forEach(error => errorArray.push(` ${error.msg}`));
      flash.class = 'alert-danger';
      flash.messages = errorArray;
      flash.type = 'Error!';
      res.render('account/settings', {flash: flash});
    } else {
      // pull the form variables off the request body
      const email = req.body.email;
      const password = req.body.password;
      axios.post(`${process.env.API_URL}/users/changeEmail`, null,
        {
          headers: {'Authorization': `Bearer ${req.user.token}`},
          params: {newEmail: email, currentPassword: password}
        }).then((res) => {
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
