let axios = require('axios');
const {check, validationResult} = require('express-validator');
const error = require("../../account/post/error");

exports = module.exports = [

  // validate the input
  check('clan_tag', 'Please indicate the clan tag - No special characters and 3 characters maximum').isLength({max: 3}),
  check('clan_description', 'Please add a description for your clan').notEmpty().isLength({max: 1000}),
  check('clan_name', "Please indicate your clan's name").isLength({max: 64}),
  check('clan_id', 'Internal error while processing your query: invalid clan ID').notEmpty(),

  async (req, res) => {
    // check the validation object for errors
    if (!validationResult(req).isEmpty()) error.errorChecking(req, res, 'clans');
    // No errors in form, continue ahead
    else {

      const newName = req.body.clan_name;
      const newTag = req.body.clan_tag;
      const oldName = req.body.original_clan_name;
      const oldTag = req.body.original_clan_tag;
      const clanDescription = req.body.clan_description;
 

      // Is the clan name / clan tag taken ?

      if (oldName !== newName) {
        await axios.get(`${process.env.API_URL}/data/clan?filter=name=="${newName}"`)
          .then(response => {
            console.log(response.data);
            if (response.data.data.length >= 0) res.redirect('/manage?flash=alreadyTaken');
          }).catch(e => {
          console.log(e);
          res.redirect('/manage?flash=error');
        });

      }
       if (oldTag !== newTag) {
        await axios.get(`${process.env.API_URL}/data/clan?filter=name=="${newTag}"`)
          .then(response => {
            console.log(response.data);
            if (response.data.data.length >= 0) res.redirect('/manage?flash=alreadyTaken');
          }).catch(e => {
          console.log(e);
          res.redirect('/manage?flash=error');
        });
      }

      // Building update query
      const newClanObject = {
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
      axios.patch(`${process.env.API_URL}/data/clan/${req.body.clan_id}`, newClanObject,
        {

          headers: {
            'Authorization': `Bearer ${req.user.token}`,
            'Content-Type': 'application/vnd.api+json',
            'Accept': 'application/vnd.api+json'
          }
        }).then(response => {
          //Yay we did it
        res.redirect('/manage?flash=update');
      }).catch(e => {
        console.log(e);
        res.redirect('/manage?flash=error');
      });
    }
  }
];
