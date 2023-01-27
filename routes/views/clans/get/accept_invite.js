const axios = require('axios');

exports = module.exports = function (req, res) {

  let flash = {};

  const invitationId = req.query.invitationId;
  const invite = req.app.locals.clanInvitations[invitationId];
  if (!invite || !req.query.invitationId) {
    flash.type = 'Error!';
    flash.class = 'alert-danger';
    flash.messages = 'The invitation link is wrong or truncated.';
    res.render('/clans', {flash: flash});
  }
  
  const clanId = invite.clan;
// Lets check if user is in clan
  if (req.user.data.attributes.clan != null) {
    // User is already in a clan!
    res.redirect(`/clans/getClan?tag=${req.user.data.attributes.clan.tag}`);
  } else {
    //User is not in a clan, lets render so they can accept the invite
    axios.get(`${process.env.API_URL}/data/clan/${clanId}?include=memberships.player&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader&fields[player]=login,updateTime`
    ).then(response => {
        res.locals.clanName = response.data.data.attributes.name;
        res.locals.acceptURL = `/clans/join?token=${invite.token}`;
        // Render the view
        res.render('clans/accept_invite');
      }
    );    
  }

  
};
