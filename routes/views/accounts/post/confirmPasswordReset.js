let flash = {};
let request = require('request');
let error = require('./error');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password', 'Password must be six or more characters').isLength({min: 6});
  req.checkBody('password', 'Passwords don\'t match').isEqual(req.body.password_confirm);

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/confirmPasswordReset', {flash: flash});
  } else {
    let newPassword = req.body.password;

    let overallRes = res;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/performPasswordReset',
      form: {newPassword: newPassword}
    }, function (err, res, body) {

      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);        
        return overallRes.render('account/confirmPasswordReset', {flash: flash});
      }

    // Successfully reset password
    flash.class = 'alert-success';
    flash.messages = [{msg: 'Your password was changed successfully.'}];
    flash.type = 'Success!';

    overallRes.render('account/confirmPasswordReset', {flash: flash});
  }
);
}
}
;
