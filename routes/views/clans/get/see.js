const request = require('request');

exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
            
    let flash = {};
    
    
    if (!req.query.id){        
        flash.type = 'Error!';
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'No clan ID specified'}];

        let buff = new Buffer(JSON.stringify(flash));  
        let data = buff.toString('base64');

        return res.redirect('./?flash='+data);
    }
    
    const clanId = req.query.id;
    
    request.get(
        {
            url: 
                process.env.API_URL 
                + '/data/clan/'+clanId
                + '?include=memberships.player'
                + '&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader'
                + '&fields[player]=login,updateTime'
                + '&fields[clanMembership]=createTime,player',
            headers: 
            req.user ? {
                'Authorization': 'Bearer ' + req.user.data.attributes.token
            } : {}
        },
        function (err, childRes, body) {
            
            const clan = JSON.parse(body);
            
            if (err || !clan.data){  
                flash.type = 'Error!';
                flash.class = 'alert-danger';
                flash.messages = [{msg: 'The clan you want to see is invalid or does no longer exist'}];


                let buff = new Buffer(JSON.stringify(flash));  
                let data = buff.toString('base64');

                return res.redirect('./?flash='+data);
            }
            
            locals.clan_name = clan.data.attributes.name;
            locals.clan_tag = clan.data.attributes.tag; 
            locals.clan_description = clan.data.attributes.description; 
            locals.clan_create_time = clan.data.attributes.createTime; 
            locals.me = req.user ? req.user.data.id : null;
            locals.clan_id = clan.data.id;
            
            let members = {};
            
            for (k in clan.included){
                switch(clan.included[k].type){
                    case "player":
                        const player = clan.included[k]; 
                        if (!members[player.id]) members[player.id] = {};
                        members[player.id].id = player.id;
                        members[player.id].name = player.attributes.login;
                        members[player.id].isLeader = player.id == clan.data.relationships.leader.data.id;
                        break;
                        
                    case "clanMembership":
                        const membership = clan.included[k]; 
                        const member = membership.relationships.player.data;
                        if (!members[member.id]) members[member.id] = {};
                        members[member.id].id = member.id;
                        members[member.id].joinedAt = membership.attributes.createTime;
                        break;
                    
                }
            }
            
            locals.clan_members = members;
            
            
            if (req.query.flash){
                let buff = new Buffer(req.query.flash, 'base64');  
                let text = buff.toString('ascii');
                
                flash = JSON.parse(text);
            }
            
            // Render the view
            res.render('clans/see', {flash: flash});
        }
    )
};
