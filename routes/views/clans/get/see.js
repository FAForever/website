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
    const queryUrl = process.env.API_URL 
                + '/data/clan/'+clanId
                + '?include=memberships.player'
                + '&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader'
                + '&fields[player]=login,updateTime'
                + '&fields[clanMembership]=createTime,player';
    
    request.get(
        {
            url: queryUrl,
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

                console.log(clan);
                console.log(queryUrl);

                let buff = new Buffer(JSON.stringify(flash));  
                let data = buff.toString('base64');

                return res.redirect('./?flash='+data);
            }
            
            locals.clan_name = clan.data.attributes.name;
            locals.clan_tag = clan.data.attributes.tag; 
            locals.clan_description = clan.data.attributes.description; 
            locals.clan_create_time = clan.data.attributes.createTime; 
            locals.me = req.user ? req.user.data.id : null;
            locals.my_membership = null;
            locals.clan_id = clan.data.id;
            locals.iAmMember = false;
            locals.iAmLeader = false;
            
            let members = {};
            
            for (k in clan.included){
                switch(clan.included[k].type){
                    case "player":
                        const player = clan.included[k]; 
                        if (!members[player.id]) members[player.id] = {};
                        members[player.id].id = player.id;
                        members[player.id].name = player.attributes.login;
                        members[player.id].isLeader = player.id == clan.data.relationships.leader.data.id;
                        
                        if (!locals.iAmMember) locals.iAmMember = locals.me ? player.id == locals.me : false;
                        break;
                        
                    case "clanMembership":
                        const membership = clan.included[k]; 
                        const member = membership.relationships.player.data;
                        if (!members[member.id]) members[member.id] = {};
                        members[member.id].id = member.id;
                        members[member.id].joinedAt = membership.attributes.createTime;
                        
                        if (!locals.my_membership && locals.me) locals.my_membership =  member.id == locals.me ? membership.id : null;
                        break;
                    
                }
            }
            
            if (locals.iAmMember) locals.iAmLeader = locals.me == clan.data.relationships.leader.data.id;
            
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
