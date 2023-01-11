let flash = {};
const request = require('request');
const {check, validationResult} = require('express-validator');
const axios = require("axios");
const error = require("../../account/post/error");

function promiseRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      console.log('promiseRequest being called')
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
  
  res.locals.formData = req.body || {};

  let overallRes = res;


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
    const invitedPlayer = req.body.invited_player;

    // Let's check first that the player exists
    const fetchRoute = process.env.API_URL + '/data/player?filter=login=="' + invitedPlayer + '"&fields[player]=';
    
    
    let playerData = '';
    let playerId = '';
    const httpData = await promiseRequest(fetchRoute);
    playerData = JSON.parse(httpData).data;
    playerId = playerData[0].id;
    console.log('Start get Invite')
    
    axios.get(`${process.env.API_URL}/clans/generateInvitationLink?clanId=${clanId}&playerId=${playerId}`, null,
      {
        headers: {'Authorization': `Bearer ${req.user.token}`},
      }).then(response => {
        console.log('hello');
        console.log(response);
        const token = JSON.parse(res.body).jwtToken;
        console.log(token)
        console.log('json Parse')
        const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase();
        req.app.locals.clanInvitations[id] = {
          token: token,
          clan: clanId
        };
        return overallRes.redirect('manage?invitation_id=' + id);

    }).catch((e) => {
      
      console.error(e.response);
      error.parseApiErrors(e.response, flash);
      let buff = Buffer.from(JSON.stringify(flash));
      let data = buff.toString('base64');
      return overallRes.redirect('manage?flash=' + data);
    });
  }
};
