let axios = require('axios');

exports = module.exports = function (req, res) {

  // Check if we are missing the member to kick or if someone is trying to kick themselves. Should not happen normally, but you never know
  if (req.body.membership_id === req.user.data.attributes.clan.membershipId || !req.body.membership_id) {
    res.redirect('manage?flash=error&error=missingData');
  } else {
    const membershipId = req.body.membership_id;
    const kickedPlayer = req.body.membership_name;
    //Run post to endpoint
    axios.delete(`${process.env.API_URL}/data/clanMembership/${membershipId}`, {
      headers: {'Authorization': `Bearer ${req.user.token}`}
    }).then(() => {
      res.redirect(`manage?flash=kick&kickPlayer=${kickedPlayer}`);

    }).catch((e) => {
      console.log(e);
      res.redirect(`manage?flash=error`);

    });
    
  }
  
};
