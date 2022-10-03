let flash = {};
let request = require('request');
let error = require('./error');
const {check, validationResult} = require('express-validator');

exports = module.exports = function(req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  check('gog_username', 'Username is required').notEmpty();
  check('gog_username', 'Username must be at least 3 characters').isLength({min: 3});
  check('gog_username', 'Username must be at most 100 characters').isLength({max: 100});

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {

    // failure
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/linkGog', {flash: flash});

  } else {

    let gogUsername = req.body.gog_username; // this is obtained from the form field in the mixin, not the pug file of this page!

    let overallRes = res;

    request.post({
      url: process.env.API_URL + '/users/linkToGog',
      headers: {'Authorization': 'Bearer ' + req.user.data.attributes.token},
      form: {gogUsername: gogUsername}
    }, function (err, res, body) {

      if (res !== undefined && res.statusCode === 200) {
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Your account were linked successfully.'}];
        flash.type = 'Success!';

        locals.gogToken = '-';
        overallRes.render('account/linkGog', {flash: flash});

      } else {
        error.parseApiErrors(body, flash);

        // We need the gog token on the error page as well,
        // this code literally does the same as linkGog.js, but due to the architectural structure of this application
        // it's not possible to extract it into a separate function while saving any code
        request.get({
          url: process.env.API_URL + '/users/buildGogProfileToken',
          headers: {'Authorization': 'Bearer ' + req.user.data.attributes.token},
          form: {}
        }, function (err, res, body) {
          locals.gogToken = 'unable to obtain token';
          if (res === undefined || res.statusCode !== 200) {
            flash = {};
            error.parseApiErrors(body, flash);
            return overallRes.render('account/linkGog', {flash: flash});
          }

          locals.gogToken = JSON.parse(body).gogToken;

          return overallRes.render('account/linkGog', {flash: flash});
        });
      }
    });
  }
};
