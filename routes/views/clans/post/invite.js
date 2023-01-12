let flash = {};
const request = require('request');
const axios = require('axios');
const {check, validationResult} = require('express-validator');
const error = require("../../account/post/error");

function promiseRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      console.log('promiseRequets is being done!')
      if (!error && res.statusCode < 300) {
        resolve(body);
      } else {
        console.error("Call to " + url + " failed: " + error);
        reject(error);
      }
    });
  });
}


exports = module.exports = async function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  let overallRes = res;

  let id = '';
  // validate the input
  check('invited_player', 'Please indicate the player name').notEmpty();

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    let buff = Buffer.from(JSON.stringify(flash));
    let data = buff.toString('base64');

    return overallRes.redirect('manage?flash=' + data);
  } else {

    const clanId = req.body.clan_id;
    const userName = req.body.invited_player;

    // Let's check first that the player exists
    const fetchRoute = process.env.API_URL + '/data/player?filter=login=="' + userName + '"&fields[player]=';

    let exists = true;
    let playerData = null;
    let playerId = null;
    try {
      const httpData = await promiseRequest(fetchRoute);
      playerData = JSON.parse(httpData).data;
      exists = playerData.length > 0;
      playerId = playerData[0].id;
    } catch (e) {
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'The player ' + userName + " doesn't seem to exist" + e}];
      flash.type = 'Error!';

      let buff = Buffer.from(JSON.stringify(flash));
      let data = buff.toString('base64');

      return overallRes.redirect('manage?flash=' + data);
    }
    console.log('request get')
    //Run post to endpoint
    axios.get(`${process.env.API_URL}/clans/generateInvitationLink?clanId=${clanId}&playerId=${playerId}`,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
      }).then(response => {
      let data = response.data;
      
      console.log(data);

      console.log('hellpo?')
      const token = data.jwtToken;



      let id = Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5).toUpperCase();
      console.log(req.user.data)
      req.app.locals.clanInvitations[id] = {
        token: token,
        clan: clanId
      };
      
      res.redirect('manage?invitation_id=' + id);

    }).catch(e => {
      console.log(e)
      console.log(e.response)
      error.parseApiErrors(e.response, flash);

    });
  }
}
