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
  req.checkBody('clan_tag', 'Please indicate the clan tag').notEmpty();
  req.checkBody('clan_description', 'Please add a description for your clan').notEmpty();
  req.checkBody('clan_name', 'Please indicate your clan\'s name').notEmpty();

  // check the validation object for errors
  let errors = req.validationErrors();

  //Must have client side errors to fix
  if (errors) {
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    let buff = new Buffer(JSON.stringify(flash));  
    let data = buff.toString('base64');

    return overallRes.redirect('clans/create?flash='+data);
  } else {

    const clanName = req.body.clan_name;
    const clanTag = req.body.clan_tag;
    const clanDescription = req.body.clan_description;
    const userId = req.body.user_id;

    // Let's check first that the name or tag are not taken
    const clanFetchRoute = process.env.API_URL+'/data/clan?filter=name=="'+clanName+'",tag=="'+clanTag+'"';
    let exists = true;
    try {
      const httpData = await promiseRequest(clanFetchRoute);
      exists = JSON.parse(userFetch).data.length > 0;
    }
    catch(e){
      flash.class = 'alert-danger';
      flash.messages = [{msg: 'Error while creating the clan '+e.toString()}];
      flash.type = 'Error!';

      let buff = new Buffer(JSON.stringify(flash));  
      let data = buff.toString('base64');

      return overallRes.redirect('clans/create?flash='+data);
    }
    
    
    // Building report;
    const player ={
        'type':'player',
        'id':''+userId
    }

    let relationShips = {
      "founder": player,
      "leader": player
    };

    // Making the clan query accordingly to what the API expects to receive
    const query = 
      {
        "data": [
          {
            "type": "clan",
            "attributes": {
                "tag": clanTag,
                "name": clanName,
                "description": clanDescription
            },
            "relationships":relationShips
          }
        ]        
      }
    ;

    //Run post to reset endpoint
    request.post({
      url: process.env.API_URL + '/data/clan',
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
          errorMessages.push({msg: 'Error while creating the clan'});
          flash.class = 'alert-danger';
          flash.messages = errorMessages;
          flash.type = 'Error!';

          let buff = new Buffer(JSON.stringify(flash));  
          let data = buff.toString('base64');

          return overallRes.redirect('clans/create?flash='+data);
      }
        
        // TO CHANGE
      overallRes.redirect('clans/create');
    });
  }
}
