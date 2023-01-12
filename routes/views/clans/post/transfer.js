let flash = {};
const request = require('request');
const {check, validationResult} = require('express-validator');

function promiseRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode < 300) {
        resolve(body);
      } else {
        reject(error || `Unexpected status code ${res.statusCode}`);
      }
    });
  });
}

exports = module.exports = async function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  let overallRes = res;


  // validate the input
  check('transfer_to', 'Please indicate the recipient name').notEmpty();
  check('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty();

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
    const clanTAG = req.user.data.attributes.clan.tag
    const clanId = req.body.clan_id;    
    const userName = req.body.transfer_to;

    // Let's check first that the player exists AND is part of this clan
    const fetchRoute = process.env.API_URL+'/data/clan/'+clanId+'?include=memberships.player&fields[player]=login';
    
    let playerId = null;
    
    try {
        if (userName === req.user.data.attributes.userName) throw "You cannot transfer your own clan to yourself";
        
        const httpData = await promiseRequest(fetchRoute);
        clanData = JSON.parse(httpData);
      
        let members = {};
      
        for (k in clanData.included){
            const record = clanData.included[k];
            if (record.type !== "player") continue;
            members[record.attributes.login] = record.id;
        }
        
        if (!members[userName]) throw "User does not exist or is not part of the clan";
        playerId = members[userName];
    }
    catch(e){
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'There was an error during the transfer to ' + userName + ": "+e}];
      flash.type = 'Error!';

      let buff = Buffer.from(JSON.stringify(flash));  
      let data = buff.toString('base64');

      return overallRes.redirect('manage?flash='+data);
    }
        
    
    // Building update query
    const queryUrl = 
            process.env.API_URL 
            + '/data/clan/' + clanId
    ;
    
    const newClanObject =
    {
      "data": {
            "type": "clan",
            "id": clanId,
            "relationships": {
                "leader": {
                    "data":{
                        "id": playerId,
                        "type": "player"
                    }
                }
            }
        }
    };
    
    //Run post to endpoint
    request.patch({
        url: queryUrl,
        body: JSON.stringify(newClanObject),
        headers: {
            'Authorization': 'Bearer ' + req.user.token,
            'Content-Type': 'application/vnd.api+json'
        }
    }, function (err, res, body) {

        if (res.statusCode != 204) {
          
            let errorMessages = [];
            let msg = 'Error during the ownership transfer';
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
        else{
            // Refreshing user
            request.get({
                url: process.env.API_URL + '/me',
                headers: {
                    'Authorization': 'Bearer ' + req.user.token,
                }
            },
                
            function (err, res, body) {
                try{
                    let user = JSON.parse(body);
                    user.data.id = user.data.attributes.userId;
                    user.token = req.user.token;
                    req.logIn(user, function(err){
                        if (err) console.error(err);
                        return overallRes.redirect(`${clanTAG}?member=true`);
                    });
                }
                catch{
                    console.error("There was an error updating a session after a clan transfer");
                } 
            });
        }
    });
  }
}
