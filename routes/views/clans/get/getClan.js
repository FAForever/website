const axios = require('axios');
require('dotenv').config();
exports = module.exports = function(req, res) {
  
  if (!req.query.tag) res.redirect('../clans?flash=error');
  else {


    //We call the API and get the info needed
    axios.get(`${process.env.API_URL}/data/clan?include=memberships.player&filter=tag==${req.query.tag.toLowerCase()}`
    ).then(response => {
      const {attributes} = response.data.data[0];
      const {name, description, createTime} = attributes;

      // first lets check user is logged in and has a clan
      if (req.user && req.user.data.attributes.clan !== undefined) {
        // lets check if the user belongs to the clan
        if (req.user.data.attributes.clan.tag.toLowerCase() === req.query.tag.toLowerCase()) {
          res.locals.leaveButton = true;
        }
      }
      
      //We set the values as local variables in our response
      res.locals.clanName = name;
      res.locals.clanDescription = description;
      res.locals.clanCreation = createTime.slice(0, 10);
      res.locals.clanTag = req.query.tag.toUpperCase();


      //We add in the clan members
      let clanMembers = [];
      response.data.included.forEach((member, index) => {
        // We only allow odd numbers because the API brings extra information on even numbers that don't include a members login/username
        if (index % 2 !== 0) {
          clanMembers.push(member.attributes.login);
        }
      });
      res.locals.clanMembers = clanMembers;

      //We find the clan leader
      const leaderID = response.data.data[0].relationships.leader.data.id;
      response.data.included.forEach((element, index) => {
        if (index % 2 !== 0) {
          if (element.id === leaderID) {
            res.locals.clanLeaderName = element.attributes.login;
          }
        }
      });
      
      
     

    }).catch((e) => {
      
      res.redirect('../clans?flash=error');

    }).finally(() => {
      
      

      res.render('clans/getClan');
    });
  }
};
