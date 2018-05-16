let flash = {};
let request = require('request');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  req.checkBody('usernameOrEmail', 'Username or email is required').notEmpty();
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

    res.render('account/resetPassword', {flash: flash});
  } else {
    let identifier = req.body.usernameOrEmail;
    let newPassword = req.body.password;

    let overallRes = res;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/resetPassword',
      form: {identifier: identifier, newPassword: newPassword}
    }, function (err, res, body) {

      let resp;
      let errorMessages = [];

      if (res.statusCode !== 200) {
        try {
          resp = JSON.parse(body);
        } catch (e) {
          errorMessages.push({msg: 'Invalid reset password. Please try again later.'});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          return overallRes.render('account/resetPassword', {flash: flash});
        }

        if (resp.response !== 'ok') {
          // Failed resetting password
          for (let i = 0; i < resp.errors.length; i++) {
            let error = resp.errors[i];
            errorMessages.push({msg: error.detail});
          }

          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          return overallRes.render('account/resetPassword', {flash: flash});
        }

        // Successfully reset password
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.'}];
        flash.type = 'Success!';

        overallRes.render('account/resetPassword', {flash: flash});
      }
    });
  }
};
