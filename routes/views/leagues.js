exports = module.exports = function(req, res, ladderData) {
  var moment = require('moment-timezone')
  var locals = res.locals;
  var fs = require('fs');

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'competitive';
  locals.cSection = 'leagues';
  locals.ratingTypeTitle = 'Galaxy resistance';
  locals.ratingType = 'ladder1v1';
  locals.apiURL = process.env.API_URL;
  locals.members = [];
  locals.lastPage = [];
    
    const settings = require(process.cwd()+'/configuration/leagues.json');
    locals.rankingCategories = ladderData.playerData || {};
    locals.state = +(settings.timeRange.to < moment().unix()) - +(settings.timeRange.from > moment().unix());
    locals.dates = {
        "from": moment(settings.timeRange.from*1000).tz("Etc/GMT+0").format("dddd, MMMM Do YYYY, H:mm:ss"),
        "to": moment(settings.timeRange.to*1000).tz("Etc/GMT+0").format("dddd, MMMM Do YYYY, H:mm:ss")
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
