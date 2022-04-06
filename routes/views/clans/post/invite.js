let flash = {};
const request = require('request');
const {check, validationResult} = require('express-validator');

function promiseRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode < 300) {
        resolve(body);
      } else {
        console.error("Call to " + url + " failed: " + error);
        reject(error);
      }
    });
  });
}

function setLongTimeout(func, delayMs) {
    const maxDelay = 214748364-1; // JS Limit for 32 bit integers

    if (delayMs > maxDelay) {
        const remainingDelay = delayMs - maxDelay;

		// we cut it in smaller, edible chunks
        setTimeout(() => {
            setLongTimeout(func, remainingDelay);
        }, maxDelay);
    }
	else{
		setTimeout(func, delayMs);
	}
}

exports = module.exports = async function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

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
    }
    catch(e){
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'The player ' + userName + " doesn't seem to exist" + e}];
      flash.type = 'Error!';

      let buff = Buffer.from(JSON.stringify(flash));  
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

      if (res.statusCode !== 200) {

        let errorMessages = [];
        let msg = 'Error while generating the invite link';
        try {

          msg += ': ' + JSON.stringify(JSON.parse(res.body).errors[0].detail);
        } catch {
        }

        errorMessages.push({msg: msg});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          let buff = Buffer.from(JSON.stringify(flash));  
          let data = buff.toString('base64');
          return overallRes.redirect('manage?flash='+data);
      }
      else{
          try{
            const token = JSON.parse(res.body).jwtToken;
            
            const id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5).toUpperCase();
            
            req.app.locals.clanInvitations[id] = {
                token:token,
                clan:clanId
            };
            
			// We use timeout here because if we delete the invite link whenver the page is GET,
			// then discord and other messaging applications will destroy the link accidentally
			// when pre-fetching the page. So we will delete it later. Regardless if the website is restarted all the links will be 
			// killed instantly, which is fine. They are short lived by design.
			setLongTimeout(()=>{
				delete req.app.locals.clanInvitations[id]
			}, process.env.CLAN_INVITES_LIFESPAN_DAYS * 24 * 3600 * 1000);
					
            return overallRes.redirect('manage?invitation_id='+id);
          }
          catch (e){
            flash.class = 'alert-danger';
            flash.messages = [{msg:"Unkown error while generating the invite link: "+e}];
            flash.type = 'Error!';
            let buff = Buffer.from(JSON.stringify(flash));  
            let data = buff.toString('base64');
            return overallRes.redirect('manage?flash='+data);
          }
      }
    });
  }
}
