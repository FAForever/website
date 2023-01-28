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


  axios.get(`${process.env.API_URL}/data/clanMembership/${clanMembershipId}/clan?include=memberships.player&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader&fields[player]=login,updateTime&fields[clanMembership]=createTime,player`, null,
    {
      headers: {'Authorization': `Bearer ${req.user.token}`},

    }).then(response => {

    let clan = response.data

    // Not the leader! Shouldn't be able to manage stuff
    if (clan.data.relationships.leader.data.id != req.user.data.attributes.userId) {
      res.redirect(`/clans/getClan?tag=${req.user.data.attributes.clan.tag}`);
    }
    
    
    // Lets create the schema for all the members and clan descriptions
    res.locals.clan_name = clan.data.attributes.name;
    res.locals.clan_tag = clan.data.attributes.tag;
    res.locals.clan_description = clan.data.attributes.description;
    res.locals.clan_create_time = clan.data.attributes.createTime;
    res.locals.me = req.user.data.attributes.userId;
    res.locals.clan_id = clan.data.id;

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
    
    // Lets check the different flash types
    if (req.query.flash) {
      flash.class = 'alert-success';
      flash.type = 'Success!';
      switch (req.query.flash) {
        
        case 'created':
          flash.messages = 'You have created your clan.';
          break;

        case 'kick':
          flash.messages = `You have kicked ${req.query.kickPlayer}.`;
          break;
          
        case 'update':
          flash.messages = `You have updated your clan information.`;
          break;
          
          
        case 'error':
          flash.class = 'alert-danger';
          flash.messages = 'There was an error with your request.';
          flash.type = 'Error!';
          break;
      }
    }
    
    
    //Lets check if they tried inviting an user
    if (req.query.invitation_id && req.query.invitation_id !== 'error') {

      flash.class = 'alert-invite';
      flash.hasHTML = `<a id="inviteLink" onclick="return false" href="${process.env.HOST}/clans/accept_invite?invitationId=${req.query.invitation_id}">${process.env.HOST}/clans/accept_invite?i=${req.query.invitation_id}</a>`;
      flash.type = 'invite';
    } else if (req.query.invitation_id === 'error') {
      flash.class = 'alert-danger';
      flash.messages = `User isn't a valid username (check your spelling). If error continues contact support`;
      flash.type = 'Error!';
    }

  }).catch((e) => {
    console.log(e);
    error.parseApiErrors(e.response, flash);
    
    
  }).finally(() => {
    res.render('clans/manage', {flash: flash});
  });
  
};
