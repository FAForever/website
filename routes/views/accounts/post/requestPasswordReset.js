let flash = {};
let request = require('request');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  req.checkBody('usernameOrEmail', 'Username or email is required').notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/requestPasswordReset', {flash: flash});
  } else {
    let identifier = req.body.usernameOrEmail;

    let overallRes = res;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/requestPasswordReset',
      form: {identifier: identifier}
    }, function (err, res, body) {

      let resp;
      let errorMessages = [];
      if (res.statusCode !== 200) {
        try {
          resp = JSON.parse(body);
          resp.errors.forEach(error => errorMessages.push({msg: error.detail}))
        } catch (e) {
          errorMessages.push({msg: 'An unknown error occurred. Please try again later or ask the support.'});
        }
        
        if(errorMessages.length === 0) {
          errorMessages.push({msg: 'An unknown error occurred. Please try again later or ask the support.'});
        }

        console.log(errorMessages);
        flash.class = 'alert-danger';
        flash.messages = errorMessages;
        flash.type = 'Error!';

        return overallRes.render('account/requestPasswordReset', {flash: flash});
      }

      // Successfully reset password
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your password is in the process of being reset, please reset your password by clicking on the link provided in an email.'}];
      flash.type = 'Success!';

      overallRes.render('account/requestPasswordReset', {flash: flash});
    });
  }
};
