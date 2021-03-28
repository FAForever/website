let flash = {};
let request = require('request');
let error = require('./error');
const {check, validationResult} = require('express-validator');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  check('usernameOrEmail', 'Username or email is required').notEmpty();

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/requestPasswordReset', {flash: flash});
  } else {
    let identifier = req.body.usernameOrEmail;
    let recaptchaResponse = req.body["g-recaptcha-response"]

    let overallRes = res;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/requestPasswordReset',
      form: {identifier: identifier, recaptchaResponse: recaptchaResponse}
    }, function (err, res, body) {

      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
        return overallRes.render('account/requestPasswordReset', {
          flash: flash,
          recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
      }

      // Successfully reset password
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.'}];
      flash.type = 'Success!';

      overallRes.render('account/requestPasswordReset', {
        flash: flash,
        recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
      });
    });
  }
};
