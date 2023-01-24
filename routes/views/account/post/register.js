let flash = {};
const axios = require('axios');
const {body, validationResult} = require('express-validator');
const error = require("./error");

exports = module.exports = [

  body('email', 'Email does not appear to be valid').isEmail(),
  (req, res) => {
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/register');
    // No errors in form, continue ahead
    else {
      // pull the form variables off the request body
      let username = req.body.username;
      let email = req.body.email;
      let recaptchaResponse = req.body["g-recaptcha-response"];

      //Run post to register endpoint
      axios.post(`${process.env.API_URL}/users/register`, null,
        {
          params: {username: username, email: email, recaptchaResponse: recaptchaResponse}
      }).then( () =>  {
        // Successfully registered user
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Please check your email to verify your registration. Then you will be ready to log in!'}];
        flash.type = 'Success!';

      }).catch((e) => {
        error.parseApiErrors(e.response, flash);
      }).finally(() => {
        res.render('account/register', {flash: flash, recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY});
      });
    }
  }
];
