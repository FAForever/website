let flash = {};
let request = require('request');
const axios = require('axios');
let error = require('./error');
const {check, validationResult} = require('express-validator');


exports = module.exports = function (req, res) {

  let locals = res.locals;

  locals.formData = req.body || {};

  // validate the input
  check('email', 'Email is required').notEmpty();
  check('email', 'Email does not appear to be valid').isEmail();

  // check the validation object for errors
  let errors = validationResult(req);

  //Must have client side errors to fix
  if (!errors.isEmpty()) {

    // failure
    flash.class = 'alert-danger';
    flash.messages = errors;
    flash.type = 'Error!';

    res.render('account/changeEmail', {flash: flash});

  } else {

    // pull the form variables off the request body
   
    let overallRes = res;
    let formEmailData = {
      newEmail: req.body.email,
      currentPassword: req.body.password,
    };

//TODO: Axios is giving me a 400 error

    console.log('Axios is being used');
    axios.post(`${process.env.API_URL}/users/changeEmail`, {
      headers: {'Authorization': `Bearer ${req.user.token}`},
      form: formEmailData

    }).then((response) => {
      console.log('.then()');
      console.log(response);
      

      // Successfully changed email
      flash.class = 'alert-success';
      flash.messages = [{msg: 'Your email was set successfully.'}];
      flash.type = 'Success!';
      overallRes.render('account/changeEmail', {flash: flash});

    });
    
  }
};
