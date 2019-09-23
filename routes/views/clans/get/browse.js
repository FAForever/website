const fs = require('fs');

exports = module.exports = function(req, res) {

    let locals = res.locals;
    
	// locals.section is used to set the currently selected
	// item in the header navigation.
    locals.section = 'clan';
    
    let flash = null;
    
    if (req.query.flash){
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
     
	locals.apiURL = process.env.API_URL;
    
    fs.readFile('members/clans.json', 'utf8', function (err, data) {
        locals.clanList = JSON.parse(data);
        locals.lastPage = Math.ceil(locals.clanList.length / 100);
    
        // Render the view
        res.render('clans/browse', {flash:flash});
	});
};
