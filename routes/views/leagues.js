exports = module.exports = function(req, res, ladderData) {
  var moment = require('moment-timezone');
  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'competitive';
  locals.cSection = 'leagues';
  locals.ratingTypeTitle = 'Galaxy resistance';
  locals.ratingType = 'ladder1v1';
  locals.apiURL = process.env.API_URL;
  locals.members = [];
  locals.lastPage = [];
    
    const leaguesConfig = require(process.cwd()+'/configuration/leagues.json');
    locals.rankingCategories = ladderData.playerData || {};
    locals.state = +(moment(leaguesConfig.timeRange.to).tz("Etc/GMT+0").isBefore(moment())) - +(moment(leaguesConfig.timeRange.from).tz("Etc/GMT+0").isAfter(moment()));
    locals.dates = {
        "from": moment(leaguesConfig.timeRange.from).tz("Etc/GMT+0").format("dddd, MMMM Do YYYY, H:mm:ss"),
        "to": moment(leaguesConfig.timeRange.to).tz("Etc/GMT+0").format("dddd, MMMM Do YYYY, H:mm:ss")
        };
    for (const category in locals.rankingCategories){
        locals.members[category] = [];
        for (let i =0 ;i < locals.rankingCategories[category].data; i++){
            const member = locals.rankingCategories[category].data[i];
            const listElement = {'label': member.name, 'value': i};
            locals.members[category].push(listElement);
        }
    }
    res.render('leagues');
};
