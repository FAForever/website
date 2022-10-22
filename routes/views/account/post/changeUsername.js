let flash = {};
let request = require('request');
let error = require('./error');
const {check, validationResult} = require('express-validator');
console.log('changeUsername logged for the first time!');
exports = module.exports = function (req, res) {
  console.log('1 - changeUsername is being read!');
    let locals = res.locals;

    locals.formData = req.body || {};

    // validate the input
    check('username', 'Username is required').notEmpty();
    check('username', 'Username must be three or more characters').isLength({min: 3});

    // check the validation object for errors
    let errors = validationResult(req);

    //Must have client side errors to fix
    if (!errors.isEmpty()) {

        // failure
        flash.class = 'alert-danger';
        flash.messages = errors;
        flash.type = 'Error!';

        res.render('account/changeUsername', {flash: flash});

    } else {
      console.log('2 - changeUsername is being read!');
    let username = req.body.username;
    let overallRes = res;
      console.log('3 - changeUsername is being read!');
    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/users/changeUsername',
      headers: {'Authorization': 'Bearer ' + req.user.token},
      form: {newUsername: username}
    }, function (err, res, body) {
      console.log('4 - changeUsername is being read!');
      
      
      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
        return overallRes.render('account/changeUsername', {flash: flash});
      }
      console.log('5 - changeUsername is being read!');
      // Successfully changed username
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your username was changed successfully. Please use the new username to log in!'}];
      flash.type = 'Success!';

      overallRes.render('account/changeUsername', {flash: flash});
    });
  }
};
