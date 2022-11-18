let flash = {};
const request = require('request');
const ClientOAuth2 = require('client-oauth2');
const {check, validationResult} = require('express-validator');
require("dotenv").config();

const apiAuth = new ClientOAuth2({
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  accessTokenUri: process.env.API_URL + '/oauth/token',
  authorizationUri: process.env.API_URL + '/oauth/authorize',
  redirectUri: process.env.HOST + '/callback',
  scopes: ['create_user']
});

exports = module.exports = function (req, res) {
  let locals = res.locals;

  locals.formData = req.body || {};
  // validate the input
  check('username', 'Username is required').notEmpty();
  check('username', 'Username must be three or more characters').isLength({min: 3});
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

    res.render('account/register', {flash: flash});

  } else {

    // pull the form variables off the request body
    let username = req.body.username;
    let email = req.body.email;
    let recaptchaResponse = req.body["g-recaptcha-response"]

    let overallRes = res;

    //Run post to register endpoint
    request.post({
      url: process.env.API_URL + '/users/register',
      form: {username: username, email: email, recaptchaResponse: recaptchaResponse}
    }, function (err, res, body) {
      let resp;
      let errorMessages = [];

      if (res.statusCode !== 200) {
        try {
          resp = JSON.parse(body);
        } catch (e) {
          errorMessages.push({msg: 'Invalid registration sign up. Please try again later.'});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          return overallRes.render('account/register', {flash: flash, recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY});
        }

        // Failed registering user
        for (let i = 0; i < resp.errors.length; i++) {
          let error = resp.errors[i];

          errorMessages.push({msg: error.detail});
        }

        flash.class = 'alert-danger';
        flash.messages = errorMessages;
        flash.type = 'Error!';

        return overallRes.render('account/register', {flash: flash, recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY});
      }

      // Successfully registered user
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Please check your email to verify your registration. Then you will be ready to log in!'}];
      flash.type = 'Success!';

      overallRes.render('account/register', {flash: flash});
    });
  }
};
