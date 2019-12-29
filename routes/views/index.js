exports = module.exports = function(req, res) {

  let locals = res.locals;
  let fs = require('fs');

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
    
  fs.readFile('members/top5.json', 'utf8', function (err, data) {
    if (data) {
      locals.topPlayers = JSON.parse(data);
    } else {
      locals.topPlayers = {};
    }
    
    let flash = {};
    
    if (req.query.flash) {
        let buff = Buffer.from(req.query.flash, 'base64');  
        let text = buff.toString('ascii');
        
        try {
            flash = JSON.parse(text);
        } catch(e) {
            console.err("Parsing error while trying to decode a flash error: "+text);
            console.err(e);
            flash = [{msg: "Unknown error"}];
        }
    }
    
    // Render the view
    res.render('index', {flash: flash, refreshCountersSeconds: parseInt(process.env.PLAYER_COUNT_UPDATE_INTERVAL)});
  });

};
