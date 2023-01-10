const axios = require("axios");
const error = require("../../account/post/error");

exports = module.exports = function (req, res) {


  // res.locals.section is used to set the currently selected
  // item in the header navigation.
  res.locals.section = 'clan';

  let flash = {};

  let clanMembershipId = null;
  try {
    clanMembershipId = req.user.data.attributes.clan.membershipId;
  } catch (e) {
    // The user doesnt belong to a clan
    res.redirect('/clans');
    return;
  }

  // In case the user has just generated an invite link
  if (req.query.invitation_id) {
    flash = {};
    flash.class = 'alert-invite';

    flash.messages = [
      {
        msg:
          `<p><a id='inviteLink' onclick='return false' href='${process.env.HOST}/clans/accept_invite?i=${req.query.invitation_id}'> Right click on me and copy the invitation link</a></p>Note: It only works for the user you typed.`
      }
    ];
    flash.type = '';

  }

  axios.get(`${process.env.API_URL}/data/clanMembership/${clanMembershipId}/clan?include=memberships.player&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader&fields[player]=login,updateTime&fields[clanMembership]=createTime,player`, null,
    {
      headers: {'Authorization': `Bearer ${req.user.token}`},

    }).then(response => {

    let clan = response.data
    if (clan.data.relationships.leader.data.id != req.user.data.attributes.userId) {
      // Not the leader! Shouldn't be able to manage stuff
      res.redirect(`/clans/${req.user.data.attributes.clan.tag}?member=true`);
      return;
    }

    res.locals.clan_name = clan.data.attributes.name;
    res.locals.clan_tag = clan.data.attributes.tag;
    res.locals.clan_description = clan.data.attributes.description;
    res.locals.clan_create_time = clan.data.attributes.createTime;
    res.locals.me = req.user.data.attributes.userId;
    res.locals.clan_id = clan.data.id;
    res.locals.clan_link = process.env.HOST + "/clans/see?id=" + clan.data.id;

    let members = {};

    for (k in clan.included) {
      switch (clan.included[k].type) {
        case "player":
          const player = clan.included[k];
          if (!members[player.id]) members[player.id] = {};
          members[player.id].id = player.id;
          members[player.id].name = player.attributes.login;

          if (clan.data.relationships.founder.data.id == player.id) {
            res.locals.founder_name = player.attributes.login
          }
          break;

        case "clanMembership":
          const membership = clan.included[k];
          const member = membership.relationships.player.data;
          if (!members[member.id]) members[member.id] = {};
          members[member.id].id = member.id;
          members[member.id].membershipId = membership.id;
          members[member.id].joinedAt = membership.attributes.createTime;
          break;
      }
    }
    res.locals.clan_members = members;

    if (req.originalUrl == '/clan_created') {
      flash = {};
      flash.class = 'alert-success';
      flash.messages = [{msg: 'You have successfully created your clan'}];
      flash.type = 'Success!';
    } else if (req.query.flash) {
      let buff = Buffer.from(req.query.flash, 'base64');
      let text = buff.toString('ascii');
      try {
        flash = JSON.parse(text);
      } catch (e) {
        console.error("Parsing error while trying to decode a flash error: " + text);
        console.log(e)
        flash = [{msg: "Unknown error"}];
      }
    }

  }).catch((e) => {
    console.log(e)
    console.error(e.response);
    error.parseApiErrors(e.response, flash);
  }).finally(() => {
    // Render the view
    res.render('clans/manage', {flash: flash});
  });
};
