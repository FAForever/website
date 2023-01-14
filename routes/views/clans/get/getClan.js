const axios = require('axios');
require('dotenv').config();
exports = module.exports = function(req, res) {
  //We call the API and get the info needed
  axios.get(`${process.env.API_URL}/data/clan?include=memberships.player&filter=tag==${req.query.tag.toLowerCase()}`
  ).then(response => {
    const {attributes} = response.data.data[0];
    const {name, description, createTime} = attributes;
    
    //We set the values as local variables in our response
    res.locals.clanName = name;
    res.locals.clanDescription = description;
    res.locals.clanCreation = createTime.slice(0,10);
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
    
  }).catch((e)=>{
    console.log('e')
    res.redirect('../../404');
    
  }).finally( ()=>{
    if (req.user) {
      if (req.user.data.attributes.clan.tag.toLowerCase() === req.query.tag.toLowerCase() ) {
        res.locals.leaveButton = true;
      } 
    }
    //We check if user belongs to the clan, if so, the leave button is on
    
    res.render('clans/getClan');
  });
  
  


  
};
