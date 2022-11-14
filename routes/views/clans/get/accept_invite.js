const request = require('request');

exports = module.exports = function(req, res) {

  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'clan';
  let flash = {};

  if (!req.query.i){
    flash.type = 'Error!';
    flash.class = 'alert-danger';
    flash.messages = [{msg: 'The invitation link is wrong or truncated. Key informations are missing.'}];

    let buff = Buffer.from(JSON.stringify(flash));
    let data = buff.toString('base64');

    return res.redirect('/clans?flash='+data);
  }

  const invitationId = req.query.i;

  if (!req.app.locals.clanInvitations[invitationId]){
    flash.type = 'Error!';
    flash.class = 'alert-danger';
    flash.messages = [{msg: 'The invitation link is wrong or truncated. Invite code missing from website clan map.'}];

    let buff = Buffer.from(JSON.stringify(flash));
    let data = buff.toString('base64');

    return res.redirect('/clans?flash='+data);
  }

  const invite = req.app.locals.clanInvitations[invitationId];
  const clanId = invite.clan;

  if (req.user.attributes.clan != null){
    // User is already in a clan!
    return res.redirect('/clans/see?id='+req.user.attributes.clan.id);
  }

  const queryUrl = process.env.API_URL
    + '/data/clan/'+clanId
    + '?include=memberships.player'
    + '&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader'
    + '&fields[player]=login,updateTime'
  ;

  request.get(
    {
      url: queryUrl
    },
    function (err, childRes, body) {

      const clan = JSON.parse(body);

      if (err || !clan.data){
        flash.type = 'Error!';
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'The clan you want to join is invalid or does no longer exist'}];

        let buff = Buffer.from(JSON.stringify(flash));
        let data = buff.toString('base64');

        return res.redirect('./?flash='+data);
      }

      locals.clanName = clan.attributes.name;
      locals.clanLeaderName = "<unknown>";

      for (k in clan.included){
        switch(clan.included[k].type){
          case "player":
            const player = clan.included[k];

            // Getting the leader name
            if (player.id == clan.data.relationships.leader.data.id)
            {
              locals.clanLeaderName = player.attributes.login;
            }

            break;
        }
      }

      const token = invite.token;
      locals.acceptURL = `/clans/join?clan_id=${clanId}&token=${token}`;

      // Render the view
      res.render('clans/accept_invite');
    }
  );
};
