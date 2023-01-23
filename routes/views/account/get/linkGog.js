let error = require('../post/error');
const axios = require("axios");

exports = module.exports = function (req, res) {
    
    let flash = {};
    axios.get(process.env.API_URL + '/users/buildGogProfileToken', {
      headers: {'Authorization': 'Bearer ' + req.user.token},
    }).then(response => {
      res.locals.gogToken = response.data.gogToken;
      // set flash to false so it doesnt create an empty gap
      flash = false;
    }).catch(e => {
      res.locals.gogToken = 'please refresh page to get GOG token';
      error.parseApiErrors(e.response, flash);
    }).finally(() => {
      res.render('account/linkGog', {flash: flash});
    });
  
};
