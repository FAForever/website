const request = require('request');
let error = require('../post/error');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'account';

  locals.formData = req.body || {};

  let flash = {};
  if (req.query.done !== undefined) {
    if (req.query.errors) {
      let errors = JSON.parse(req.query.errors);

      flash.class = 'alert-danger';
      flash.messages = errors.map(error => ({msg: error.detail}));
      flash.type = 'Error';
    } /*else {
			flash.class = 'alert-success';
			flash.messages = [{msg: 'Your GOG account has been linked successfully.'}];
			flash.type = 'Success';
		}*/
  } else {
    flash = null;
  }

  let overallRes = res;

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

    // Render the view
    overallRes.render('account/linkGog', {flash: flash});
  });
};
