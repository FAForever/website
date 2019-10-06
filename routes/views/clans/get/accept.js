const request = require('request');

exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = {};
    const overallRes = res;
    
    if (!req.query.i){
        flash.type = 'Error!';
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'The invitation link is wrong or truncated. Key informations are missing.'}];

        let buff = Buffer.from(JSON.stringify(flash));  
        let data = buff.toString('base64');

        return overallRes.redirect('/clans?flash='+data+'');
    }
    
    const invitationId = req.query.i;
    
    if (!req.app.locals.clanInvitations[invitationId]){
        flash.type = 'Error!';
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'The invitation link is wrong or truncated. Key informations are missing.'}];

        let buff = Buffer.from(JSON.stringify(flash));  
        let data = buff.toString('base64');

        return overallRes.redirect('/clans?flash='+data+'');
    }
    
    const invite = req.app.locals.clanInvitations[invitationId];
    const clanId = invite.clan;
    const token = invite.token;
    delete req.app.locals.clanInvitations[invitationId];
    
    request.post(
        {
            url: process.env.API_URL + '/clans/joinClan?token='+token,
            headers: {
                'Authorization': 'Bearer ' + req.user.data.attributes.token
            }
        },
        function (err, childRes, body) {
            let flashData;
            if (childRes.statusCode == 200 || childRes.statusCode == 201){                
                flash.class = 'alert-success';
                flash.messages = [
                    {msg: "Welcome to your new clan!"}
                ];
                flash.type = 'Success!';
                let buff = Buffer.from(JSON.stringify(flash));  
                flashData = buff.toString('base64');
                
                // Refreshing user
                return request.get({
                    url: process.env.API_URL + '/me',
                    headers: {
                        'Authorization': 'Bearer ' + req.user.data.attributes.token,
                    }
                },
                    
                function (err, res, body) {
                    try{
                        let user = JSON.parse(body);
                        user.data.attributes.token = req.user.data.attributes.token;
                        req.logIn(user, function(err){
                            if (err) console.error(err);
                            return overallRes.redirect('see?id='+clanId+'&flash='+flashData+'');
                        });
                    }
                    catch{
                        console.error("There was an error updating a session after an user left a clan");
                    }
                });
            }
            else{
                flash.type = 'Error!';
                flash.class = 'alert-danger';
                let msg = 'The invitation is invalid or has expired, or you are already part of a clan';
                try{
                    msg += ': '+JSON.stringify(JSON.parse(childRes.body).errors[0].detail);
                } catch{}
                  
                flash.messages = [{msg: msg}];

                let buff = Buffer.from(JSON.stringify(flash));  
                flashData = buff.toString('base64');
                
                return overallRes.redirect('/clans?flash='+flashData+'');
            }
            
        }
    );
};
