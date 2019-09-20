exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
	locals.formData = req.body || {};
    locals.clan_name = req.query.clan_name || "";
    locals.clan_tag = req.query.clan_tag || ""; 
    locals.clan_description = req.query.clan_description || ""; 

    var flash = null;

    if (req.originalUrl == '/clan_created') {
        flash = {};

        flash.class = 'alert-success';
        flash.messages = [{msg: 'You have successfully created your clan'}];
        flash.type = 'Success!';
    }
    else if (req.query.flash){
        let buff = new Buffer(req.query.flash, 'base64');  
        let text = buff.toString('ascii');
        
        flash = JSON.parse(text);
    }
    
    // Render the view
    res.render('clans/create', {flash: flash});
};
