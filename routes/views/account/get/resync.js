let flash = {};
let request = require('request');
let error = require('../post/error');

exports = module.exports = function (req, res) {

  let locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'account';

  locals.formData = req.body || {};

  let overallRes = res;

  request.post({
      url: process.env.API_URL + '/users/resyncAccount',
      headers: {'Authorization': 'Bearer ' + req.user.token},
    }, function (err, res, body) {

      if (res.statusCode !== 200) {
        error.parseApiErrors(body, flash);
      } else {
        // Successfully account resync
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Your account was resynced successfully.'}];
        flash.type = 'Success!';
      }

      overallRes.render('account/confirmResyncAccount', {flash: flash});
    }
  );
};
