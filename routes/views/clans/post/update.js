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
  check('clan_tag', 'Please indicate the clan tag - No special characters and 3 characters maximum').notEmpty().isLength({max: 3});
  check('clan_description', 'Please add a description for your clan').notEmpty().isLength({max: 1000});
  check('clan_name', "Please indicate your clan's name").notEmpty().isLength({max: 64});
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

    const newName = req.body.clan_name;
    const newTag = req.body.clan_tag;
    const oldName = req.body.original_clan_name;
    const oldTag = req.body.original_clan_tag;
    const clanDescription = req.body.clan_description;
    const userId = req.body.user_id;

    // Is the name taken ?
    try {
        let msg = null;
        
        flash.class = 'alert-danger';
        flash.type = 'Error!';

        if (oldName != newName){
              const fetchRoute = process.env.API_URL+'/data/clan?filter=name=="'+encodeURIComponent(newName)+'"';
              const data = await promiseRequest(fetchRoute);
              const exists = JSON.parse(data).data.length > 0;
              
              if (exists) msg = "This name is already taken: "+encodeURIComponent(newName);
        }
        if (oldTag != newTag){
              const fetchRoute = process.env.API_URL+'/data/clan?filter=tag=="'+encodeURIComponent(newTag)+'"';
              const data = await promiseRequest(fetchRoute);
              const exists = JSON.parse(data).data.length > 0;
              
              if (exists) msg = "This tag is already taken: "+encodeURIComponent(newTag);
        }
        
        if (msg){
              flash.messages = [{msg: msg}];
              let buff = Buffer.from(JSON.stringify(flash));  
              let data = buff.toString('base64');
              return overallRes.redirect('manage?flash='+data);        
            }        
    }
    catch(e){
            flash.class = 'alert-danger';
            flash.messages = [{msg: 'Error while updating the clan '+e}];
            flash.type = 'Error!';

            let buff = Buffer.from(JSON.stringify(flash));  
            let data = buff.toString('base64');

            return overallRes.redirect('manage?flash='+data);
    }
    
    // Building update query
    const queryUrl = 
            process.env.API_URL 
            + '/data/clan/' + req.body.clan_id
    ;
    
    const newClanObject ={
              "data": {
                  "type": "clan",
                  "id": req.body.clan_id,
                  "attributes": {
                        "description": clanDescription,
                        "name": newName,
                        "tag": newTag
                  }
              }
    };
    
    
    //Run post to endpoint
    request.patch({
        url: queryUrl,
        body: JSON.stringify(newClanObject),
        headers: {
            'Authorization': 'Bearer ' + req.user.token,
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
        }
    }, function (err, res, body) {

        let resp;
        let errorMessages = [];

        if (res.statusCode != 204) {
              let msg = 'Error while updating the clan';
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
        flash.messages = [{msg: 'You have successfully updated your clan'}];
        flash.type = 'Success!';

        let buff = Buffer.from(JSON.stringify(flash));  
        let data = buff.toString('base64');
            
        return overallRes.redirect('manage?flash='+data);
    });
  }
}
