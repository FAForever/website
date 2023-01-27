let flash = {};
let axios = require('axios');
const {body, validationResult} = require('express-validator');
const error = require("../../account/post/error");


exports = module.exports = [
  // validate the input
  body('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty(),
  (req, res) => {
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'account/settings');
    // No errors in form, continue ahead
  
    else {
      //Run post to endpoint
      axios.delete(`${process.env.API_URL}/data/clan/${req.body.clan_id}`, {
        headers: {'Authorization': `Bearer ${req.user.token}`}
      }).then( ()=> {
        
        flash.class = 'alert-success';
        flash.messages = 'The clan was successfully destroyed';
        flash.type = 'Success!';

        // Refreshing user
        error.userUpdate(req, res, '/clans');
          
      }).catch((e) => {
        error.parseApiErrors(e.response, flash);
        res.render('/clans/manage', {flash: flash});
      });
    }
  }
]
;
