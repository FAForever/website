const request = require('request');
let flash = {};

exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.section = 'account';
  var overallRes = res;

  request.post({
    'url': process.env.API_URL + '/users/buildSteamLinkUrl',
    'headers': {'Authorization': 'Bearer ' + req.user.token},
    form: {callbackUrl: req.protocol + '://' + req.get('host') + '/account/link?done'}
  }, function (err, res, body) {
    //Must not be valid, check to see if errors, otherwise return generic error.
    try {
      body = JSON.parse(body);

      if (body.steamUrl) {
        return overallRes.redirect(body.steamUrl);
      }

      var errorMessages = [];

      for (var i = 0; i < body.errors.length; i++) {
        var error = body.errors[i];
        errorMessages.push({msg: error.detail});
      }

      flash.class = 'alert-danger';
      flash.messages = errorMessages;
      flash.type = 'Error!';

      overallRes.render('account/linkSteam', {flash: flash});

    } catch (e) {
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'Your steam account was not successfully linked! Please verify you logged into the website correctly.'}];
      flash.type = 'Error!';

      overallRes.render('account/linkSteam', {flash: flash});
    }
  });
};
