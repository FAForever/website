let flash = {};
let request = require('request');

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
  req.checkBody('offenders', 'Please indicate the player or players you\'re reporting').notEmpty();
  req.checkBody('report_description', 'Please describe the incident').notEmpty();
  if (req.body.game_id.length > 0){
    req.checkBody('game_id', 'Please enter a valid game ID, or nothing. The # is not needed.').optional().isDecimal();
  }
  else{
    req.body.game_id = null;
  }

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    let buff = new Buffer(JSON.stringify(flash));  
    let data = buff.toString('base64');

    return overallRes.redirect('report?flash='+data);
  } else {

    const isGameReport = req.body.game_id != null;

    const offenders = req.body.offenders.split(' ');

    // Let's check first that the users exist
    let filter = '';
    for (k in offenders){
      filter+= 'login=='+offenders[k];
      if (k < offenders.length-1){
        filter += ',';
      }
    }
    const userFetchRoute = process.env.API_URL+'/data/player?filter='+filter+'&fields[player]=login&page[size]='+offenders.length;
    let apiUsers;
    try {
      const userFetch = await promiseRequest(userFetchRoute);
      apiUsers = JSON.parse(userFetch);
    }
    catch(e){
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'Error while submitting the report form: '+e.toString()}];
      flash.type = 'Error!';

      let buff = new Buffer(JSON.stringify(flash));  
      let data = buff.toString('base64');

      return overallRes.redirect('report?flash='+data);
    }

    // Mapping users to their IDs
    let foundUsers = {};
    for (k in apiUsers.data){
      const record = apiUsers.data[k];
      if (offenders.indexOf(record.attributes.login) > -1){
        foundUsers[record.attributes.login] = record.id;
      }
    }

    if (Object.keys(foundUsers).length != offenders.length){
      // someone is missing !
      let missing = [];
      for (k in offenders){
        const offenderName = offenders[k];
        if (foundUsers[offenderName] == undefined){
          missing.push(offenderName);
        }
      }

      flash.class = 'alert-danger';
      flash.messages = [{"msg": "The following users could not be found : "+missing.join(',')}];
      flash.type = 'Error!';

      let buff = new Buffer(JSON.stringify(flash));  
      let data = buff.toString('base64');
      
      return overallRes.redirect('report?flash='+data);

    }

    // Checking the game exists
    if (isGameReport){
      const gameFetchRoute = process.env.API_URL+'/data/game?filter=id=='+req.body.game_id+'&fields[game]=id';
      try {
        const gameFetch = await promiseRequest(gameFetchRoute);
        const gameData = JSON.parse(gameFetch);
      }
      catch(e){
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'The game could not be found. Please check the game ID you provided.'}];
        flash.type = 'Error!';

        let buff = new Buffer(JSON.stringify(flash));  
        let data = buff.toString('base64');

        return overallRes.redirect('report?flash='+data);
      }
    }

    // Building report;
    let reportedUsers = []
    for (k in foundUsers){
      reportedUsers.push({
        'type':'player',
        'id':''+foundUsers[k]
      })
    }

    let relationShips = {
      "reportedUsers": {
        "data": reportedUsers
      }
    };

    if (isGameReport){
      relationShips.game = {"data":{"type":"game","id":""+req.body.game_id}};
    }

    // Making the report accordingly to what the API expects to receive
    const report = 
      {
        "data": [
          {
            "type": "moderationReport",
            "attributes": {
                "gameIncidentTimecode": (req.body.game_timecode.length > 0 ? req.body.game_timecode : null),
                "reportDescription": req.body.report_description
            },
            "relationships":relationShips
          }
        ]        
      }
    ;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/data/moderationReport',
      body: JSON.stringify(report),
      headers: {
        'Authorization': 'Bearer ' + req.user.data.attributes.token,
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json'
      }
    }, function (err, res, body) {

      let resp;
      let errorMessages = [];

      if (res.statusCode != 201) {
          errorMessages.push({msg: 'Error while submitting the report form'});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          let buff = new Buffer(JSON.stringify(flash));  
          let data = buff.toString('base64');

          return overallRes.redirect('report?flash='+data);
      }

      overallRes.redirect('../report_submitted');
    });
  }
}
