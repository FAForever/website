exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = null;
    
    if (req.query.flash){
        let buff = new Buffer(req.query.flash, 'base64');  
        let text = buff.toString('ascii');
        
        flash = JSON.parse(text);
    }
            
    // Render the view
    res.render('clans/index', {flash:flash});
};
