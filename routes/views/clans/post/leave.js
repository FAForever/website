const error = require("../../account/post/error");
let axios = require('axios');

exports = module.exports = function (req, res) {
  
  const membershipId = req.user.data.attributes.clan.membershipId;
  //Run post to endpoint
  axios.delete(`${process.env.API_URL}/data/clanMembership/${membershipId}`, {
    headers: {
      'Authorization': `Bearer ${req.user.token}`
    }
  }).then( () => {
    
    // Refreshing user
    error.userUpdate(req,res,'/clans?flash=leave');
    
  }).catch(e => {
    console.log(e.response);
    res.redirect(`clans?flash=error`);
    
  });
  
};
