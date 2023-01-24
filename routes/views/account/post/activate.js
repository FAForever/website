let flash = {};
let axios = require('axios');
let error = require('./error');
const {body, validationResult} = require('express-validator');

exports = module.exports = [
  // validate the input
  body('password', 'Password must be six or more characters').isLength({min: 6}),
  body('password', '').custom((value, {req}) => {
    if (value !== req.body.password_confirm) {
      // throw error if passwords do not match
      throw new Error(`New passwords don't match`);
    } else {
      return value;
    }
  }),

  (req, res) => {
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/activate');
    // No errors in form, continue ahead  
    else {
      res.locals.username = req.query.username;
      res.locals.token = req.query.token;
      let token = req.query.token;
      let password = req.body.password;

      //Run post to reset endpoint
      axios.post(`${process.env.API_URL}/users/activate`, null,
        {
          params: {password: password, token: token}
        }).then(() => {
        // Successfully activated account
        flash.class = 'alert-success';
        flash.messages = 'Your account was created successfully.';
        flash.type = 'Success!';
      }).catch(e => {
        error.parseApiErrors(e.response, flash);

      }).finally(() => {
        res.render('account/activate', {flash: flash});
      });
    }
  }
];
