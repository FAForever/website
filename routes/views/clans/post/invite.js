let flash = {};
const request = require('request');

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
  req.checkBody('invited_player', 'Please indicate the player name').notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    let buff = new Buffer(JSON.stringify(flash));  
    let data = buff.toString('base64');

    return overallRes.redirect('manage?flash='+data);
  } else {
      
    const clanId = req.body.clan_id;    
    const userName = req.body.invited_player;

    // Let's check first that the player exists
    const fetchRoute = process.env.API_URL+'/data/player?filter=login=="'+userName+'"&fields[player]=id';
    
    let exists = true;
    let playerData = null;
    let playerId = null;
    try {
      const httpData = await promiseRequest(fetchRoute);
      playerData = JSON.parse(httpData).data;
      exists = playerData.length > 0;
      playerData = playerData[0].id;
    }
    catch(e){
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'The player ' + userName + " doesn't seem to exist" + e.toString()}];
      flash.type = 'Error!';

      let buff = new Buffer(JSON.stringify(flash));  
      let data = buff.toString('base64');

      return overallRes.redirect('manage?flash='+data);
    }
    
    const queryUrl = 
        process.env.API_URL 
        + '/clans/generateInvitationLink'
        + '?clanId=' + encodeURIComponent(clanId)
        + '&playerId=' + encodeURIComponent(playerId)
    ;
    
    //Run post to endpoint
    request.get({
      url: queryUrl,
      body: "",
      headers: {
        'Authorization': 'Bearer ' + req.user.data.attributes.token
      }
    }, function (err, res, body) {

      if (res.statusCode != 200) {
          
          let errorMessages = [];
          let msg = 'Error while generating the invite link';
          try{
            
            msg += ': '+JSON.stringify(JSON.parse(res.body).errors[0].detail);
          }
          catch{}
          
          errorMessages.push({msg: msg});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          let buff = new Buffer(JSON.stringify(flash));  
          let data = buff.toString('base64');

          return overallRes.redirect('manage?flash='+data);
      }
      else{
          try{
            const token = JSON.parse(res.body).jwtToken;
            
            return overallRes.redirect('manage?invitation_token='+token+'&clan_id='+clanId);
          }
          catch (e){
            flash.class = 'alert-danger';
            flash.messages = "Unkown error while generating the invite link: "+e;
            flash.type = 'Error!';
            let buff = new Buffer(JSON.stringify(flash));  
            let data = buff.toString('base64');
            return overallRes.redirect('manage?flash='+data);
          }
      }
    });
  }
}
