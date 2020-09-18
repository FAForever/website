let request = require('request');
let error = require('../post/error');

exports = module.exports = function (req, res) {

  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'account';

  locals.formData = req.body || {};

  var flash = {};

  let overallRes = res;

  request.post({
      url: process.env.API_URL + '/users/buildSteamPasswordResetUrl',
    }, function (err, res, body) {

      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
      }

      locals.steamReset = JSON.parse(body).steamUrl
      overallRes.render('account/requestPasswordReset', {flash: flash});
    }
  );

};
