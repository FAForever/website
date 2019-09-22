const request = require('request');

exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = null;
    
    if (req.query.flash){
        let buff = new Buffer(req.query.flash, 'base64');  
        let text = buff.toString('ascii');
        
        try{
            flash = JSON.parse(text);
        }
        catch(e){
            console.err("Parsing error while trying to decode a flash error: "+text);
            console.err(e);
            flasg = [{msg: "Unknown error"}];
        }
    }        
      
    // Fetch the clan list    
    const activityLimit = 3; // Every clan that was active in the last 1 month
    const showActiveClanPast = new Date();
    showActiveClanPast.setMonth(showActiveClanPast.getMonth() - activityLimit);
    
    locals.clans = [];
    
    try{
        request.get(
            {
                url: 
                    process.env.API_URL 
                    + '/data/clan'
                    + '?filter=memberships.player.updateTime=gt="'+showActiveClanPast.toISOString()+'"'
                    + '&include=founder,leader'
                    + '&fields[clan]=createTime,name,memberships,leader,tag'
                    + '&fields[player]=login,clanMemberships'
                    + '&sort=-leader.updateTime'
            },
            function (err, childRes, body) {
                
                const clansData = JSON.parse(body);
                
                if (err || !clansData.data){
                    console.error("There was an error retrieving the clan index page table: "+err+"\n");
                    console.trace(clansData);
                }
                
                let clans = [];
                let players = {};
                
                for (k in clansData.included){
                    const record = clansData.included[k];
                    
                    if (record.type != "player") continue;
                    
                    const playerId = record.id;
                    players[playerId] = {
                        name: record.attributes.login                
                    }
                    
                }
                
                for (k in clansData.data){
                    const record = clansData.data[k];
                    
                    if (record.relationships.memberships.data.length <= 1) continue; // Not interested in hermitages
                    
                    clans.push({
                        name: record.attributes.name,
                        tag: record.attributes.tag,
                        createTime: record.attributes.createTime,
                        leader: players[record.relationships.leader.data.id].name,
                        population: record.relationships.memberships.data.length,
                        id: record.id
                    });
                }
                
                locals.clans = clans;
                
                if (req.query.flash){
                    let buff = new Buffer(req.query.flash, 'base64');  
                    let text = buff.toString('ascii');
                    
                    flash = JSON.parse(text);
                }
                
        
                // Render the view
                res.render('clans/index', {flash:flash});
            }
        );
    }
    catch (e){
        console.trace("An error occured while fetching the clan list");
        console.error(e);
        res.render('clans/index', {flash:flash});
    }
};
