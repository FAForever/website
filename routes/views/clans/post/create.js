let flash = {};
const axios = require('axios');
const {body, validationResult} = require('express-validator');
const error = require("../../account/post/error");
const {userUpdate} = require("../../account/post/error");

exports = module.exports = [

  // validate the input

  body('clan_description', 'Your clan description is too long (max 1000 characters)').notEmpty().isLength({max: 1000}),
  body('clan_name', 'Your clan name is too long (max 40 characters)').isLength({max: 40}),
  async (req, res) => {
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
        axios.post(`${process.env.API_URL}/clans/create?name=${clanName}&tag=${clanTag}&description=${clanDescription}`, null,
          {
            headers: {'Authorization': 'Bearer ' + req.user.token}
          }).then( () => {
            
          // Refreshing user
          axios.get(`${process.env.API_URL}/me`, {
            headers: {
              'Authorization': `Bearer ${req.user.token}`,
            }
          }).then( () => {
            
            //Lets update our user
            error.userUpdate(req, res, '/clans/create' );
          }).catch(e => {
            error.parseApiErrors(e.response, flash);
          });
          
        }).catch((e) => {
          error.parseApiErrors(e.response, flash);
          res.render('/clans/create', {flash: flash});
        });
      }

    }
  }
];
