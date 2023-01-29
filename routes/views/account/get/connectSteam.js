const axios = require('axios');
let flash = {};
const error = require('../post/error')

exports = module.exports = function (req, res) {

  axios.post(`${process.env.API_URL}/users/buildSteamLinkUrl`, null, 
    {
    headers: {'Authorization':`Bearer ${req.user.token}`},
    params: {callbackUrl: `${req.protocol}://${req.get('host')}/account/link?done`}
  }).then( response => {
      if (response.data.steamUrl) {
        res.redirect(response.data.steamUrl);
      }
  }).catch(e => {
    error.parseApiErrors(e.response, flash);
    res.render('account/linkSteam', {flash: flash});
    
  });
};
