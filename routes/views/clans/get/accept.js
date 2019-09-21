exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = {};
    
    if (!req.query.token || !req.query.clan_id){
        flash.type = 'Error!';
        flash.class = 'alert-danger';
        flash.messages = [{msg: 'The invitation link is wrong or truncated. Key informations are missing.'}];

        let buff = new Buffer(JSON.stringify(flash));  
        let data = buff.toString('base64');

        return overallRes.redirect('?flash='+data+'');
    }
    
    const clanId = req.query.clan_id;
    
    request.get(
        {
            url: process.env.API_URL + '/clans/joinClan?token='+req.query.token,
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
                let buff = new Buffer(JSON.stringify(flash));  
                flashData = buff.toString('base64');
                
                return overallRes.redirect('see?id='+clanId+',flash='+flashData+'');
            }
            else{
                flash.type = 'Error!';
                flash.class = 'alert-danger';
                let msg = 'The invitation is invalid or has expired';
                try{
                    msg += ': '+JSON.stringify(JSON.parse(res.body).errors[0].detail);
                } catch{}
                  
                flash.messages = [{msg: msg}];

                let buff = new Buffer(JSON.stringify(flash));  
                flashData = buff.toString('base64');
                
                return overallRes.redirect('?flash='+flashData+'');
            }
            
        }
    )
    
    
    // Render the view
    res.render('clans/index');
};
