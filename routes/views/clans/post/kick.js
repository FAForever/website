let flash = {};
let request = require('request');
const {check, validationResult} = require('express-validator');

function promiseRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode < 300) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

exports = module.exports = async function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  let overallRes = res;

  // validate the input
  check('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty();
  check('membership_id', 'Internal error while processing your query: invalid member ID').notEmpty();

  // check the validation object for errors
  let errors = validationResult(req);

  // Should not happen normally, but you never know
  if (req.body.membership_id == req.user.data.attributes.clan.membershipId) errors = [{msg: "You cannot kick yourself"}];

  //Must have client side errors to fix
  if (!errors.isEmpty()) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    let buff = Buffer.from(JSON.stringify(flash));
    let data = buff.toString('base64');

    return overallRes.redirect('manage?flash=' + data);
  } else {

    // Building update query
    const membershipId = req.body.membership_id;
    const queryUrl =
      process.env.API_URL
      + '/data/clanMembership/' + membershipId

    ;

    //Run post to endpoint
    request.delete({
      url: queryUrl,
      body: "",
      headers: {
        'Authorization': 'Bearer ' + req.user.token
      }
    }, function (err, res, body) {

      let resp;
      let errorMessages = [];

      if (res.statusCode != 204) {
        let msg = 'Error while removing the member';
        try{

          msg += ': '+JSON.stringify(JSON.parse(res.body).errors[0].detail);
        }
        catch{}
        errorMessages.push({msg: msg});
        flash.class = 'alert-danger';
        flash.messages = errorMessages;
        flash.type = 'Error!';

        let buff = Buffer.from(JSON.stringify(flash));
        let data = buff.toString('base64');

        return overallRes.redirect('manage?flash='+data);
      }

      flash = {};
      flash.class = 'alert-success';
      flash.messages = [{msg: 'The member was kicked'}];
      flash.type = 'Success!';

      let buff = Buffer.from(JSON.stringify(flash));
      let data = buff.toString('base64');

      return overallRes.redirect('manage?flash='+data);
    });
  }
}
