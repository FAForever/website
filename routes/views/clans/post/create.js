let flash = {};
const axios = require('axios')
let request = require('request');
const {body, validationResult} = require('express-validator');
const error = require("../../account/post/error");

exports = module.exports = [

  // validate the input

  body('clan_description', 'Your clan description is too long (max 1000 characters)').notEmpty().isLength({max: 1000}),
  body('clan_name', 'Your clan name is too long (max 40 characters)').isLength({max: 40}),
  async (req, res) => {
    console.log('hello')
    // check the validation object for errors
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/settings');
    // No errors in form, continue ahead
    else {
      
      // Take variables from form 
      const clanName = req.body.clan_name;
      const clanTag = req.body.clan_tag;
      const clanDescription = req.body.clan_description;
      
      
      // We check if the clan already exists
      let clanExists = '';
      await axios.get(`${process.env.API_URL}/data/clan?filter=name=="${clanName}",tag=="${clanTag}"`)
        .then(response => {
          clanExists = !response.data.data[0];
        }).catch(e => {
          error.parseApiErrors(e.response, flash);
        });
      if (!clanExists) {
        flash.class = 'alert-danger';
        flash.messages = 'The clan tag/name are already taken. Choose a different one.';
        flash.type = 'Error!';
        res.render('clans/create', {flash: flash});
        
      } 
      // Clan doesn't exist, lets create it!
      else {      
        request.post({
          url: `${process.env.API_URL}/clans/create?name=${clanName}&tag=${clanTag}&description=${clanDescription}`,
          body: "",
          headers: {
            'Authorization': 'Bearer ' + req.user.token
          }
        }, function (err, res, body) {

          let resp;
          let errorMessages = [];

          if (res.statusCode !== 200) {
            let msg = 'Error while creating the clan';
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

            return res.redirect('create?flash=' + data + '&clan_name=' + clanName + '&clan_tag=' + clanTag + '&clan_description=' + clanDescription + '');
          }

          // Refreshing user
          request.get({
              url: process.env.API_URL + '/me',
              headers: {
                'Authorization': 'Bearer ' + req.user.token,
              }
            },
            function (err, res, body) {
              try {
                let user = JSON.parse(body);
                user.token = req.user.token;
                user.data.id = user.data.attributes.userId;
                req.logIn(user, function (err) {
                  if (err) console.error(err);
                  return res.redirect('/clans/manage');
                });
              } catch {
                console.error("There was an error updating a session after a clan creation");
              }
            });

        });
      }

    }
  }
];
