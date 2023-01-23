let flash = {};
const error = require('./error');
const {body, validationResult} = require('express-validator');
const axios = require('axios');

exports = module.exports = [
  // validate the input
  body('username', 'Username must be three or more characters').isLength({min: 3}),

  // check the validation object for errors
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
    // pull the form variables off the request body
    let username = req.body.username;
    axios.post(`${process.env.API_URL}/users/changeUsername`, null,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
        params: {newUsername: username}
      }).then( () => {

      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = 'Your new username was set successfully!';
      flash.type = 'Success!';
    }).catch((e) => {
      error.parseApiErrors(e.response, flash);
    }).finally(() => {
      res.locals.page = 'changeUsername';
      res.render('account/settings', {flash: flash});
    });
    }
  }
];
