const request = require('request');
    
exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = null;
                
    let clanMembershipId = null;
    try{
        clanMembershipId = req.user.data.attributes.clan.membershipId;
    }
    catch{
        // The user doesnt belong to a clan
        res.redirect('/clans');
        return;
    }
    
    // In case the user has just generated an invite link
    if (req.query.invitation_id){
        flash = {};
        flash.class = 'alert-success';
        flash.messages = [
            {msg: 
                "<a class='invite-link' href='"+process.env.HOST + "/clans/accept"
                +"?i=" + req.query.invitation_id
                +"'><b>Right click on me and copy link</b>, then send it to the invited player</a>"}
        ];
        flash.type = '';
    }
    
    request.get(
        {
            url: 
                process.env.API_URL 
                + '/data/clanMembership/'+clanMembershipId+'/clan'
                + '?include=memberships.player'
                + '&fields[clan]=createTime,description,name,tag,updateTime,websiteUrl,founder,leader'
                + '&fields[player]=login,updateTime'
                + '&fields[clanMembership]=createTime,player',
            headers: {
                'Authorization': 'Bearer ' + req.user.data.attributes.token
            }
        },
        function (err, childRes, body) {
            
            const clan = JSON.parse(body);
            
            if (err || !clan.data){
                flash = {};
                flash.class = 'alert-danger';
                flash.messages = [{msg: "Unknown error while retrieving your clan information"}];
                flash.type = 'Error!';

                let buff = Buffer.from(JSON.stringify(flash));  
                let data = buff.toString('base64');

                return res.redirect('/clans?flash='+data);
            }
            
            if (clan.data.relationships.leader.data.id != req.user.data.id){
                // Not the leader! Should'nt be able to manage shit
                res.redirect('/clans/see?id='+clan.data.id);
                return;
            }
            
            locals.clan_name = clan.data.attributes.name;
            locals.clan_tag = clan.data.attributes.tag; 
            locals.clan_description = clan.data.attributes.description; 
            locals.clan_create_time = clan.data.attributes.createTime; 
            locals.me = req.user.data.id;
            locals.clan_id = clan.data.id;
            locals.clan_link = process.env.HOST + "/clans/see?id="+clan.data.id;
            
            let members = {};
            
            for (k in clan.included){
                switch(clan.included[k].type){
                    case "player":
                        const player = clan.included[k]; 
                        if (!members[player.id]) members[player.id] = {};
                        members[player.id].id = player.id;
                        members[player.id].name = player.attributes.login;
                        
                        if (clan.data.relationships.founder.data.id == player.id){
                            locals.founder_name = player.attributes.login
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
            
            locals.clan_members = members;

            if (req.originalUrl == '/clan_created') {
                flash = {};
                flash.class = 'alert-success';
                flash.messages = [{msg: 'You have successfully created your clan'}];
                flash.type = 'Success!';
            }
            else if (req.query.flash){
                let buff = Buffer.from(req.query.flash, 'base64');  
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
            
            // Render the view
            res.render('clans/manage', {flash: flash});
        }
    );
};