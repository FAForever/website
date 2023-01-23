let flash = {};
const error = require('./error');
const axios = require('axios');
const {body, validationResult} = require("express-validator");

exports = module.exports = [

  // validate the input

  body('gogUsername', 'Username must be at least 3 characters').isLength({min: 3}),
  body('gogUsername', 'Username must be at most 100 characters').isLength({max: 100}),
  //Check for errors
  (req, res) => {
    if (!validationResult(req).isEmpty()) {
      let errorArray = [];
      //We are putting a space in our forEach so that the errors comma don't stick to the next error.
      validationResult(req).errors.forEach(error => errorArray.push(` ${error.msg}`));
      flash.class = 'alert-danger';
      flash.messages = errorArray;
      flash.type = 'Error!';
      res.render('account/linkGog', {flash: flash});
    } else {

      res.locals.gogToken = 'Refresh to re-obtain';
      let gogUsername = req.body.gogUsername;

      axios.post(`${process.env.API_URL}/users/linkToGog`, null,
        {
          headers: {'Authorization': `Bearer ${req.user.token}`},
          params: {gogUsername: gogUsername}
        }).then(() => {
        flash.class = 'alert-success';
        flash.messages = [{msg: 'Your account was linked successfully.'}];
        flash.type = 'Success!';
        
      }).catch(e => {
          error.parseApiErrors(e.response, flash);

      }).finally(() => {

        res.render('account/linkGog', {flash: flash});
      });
    }
  }
];
