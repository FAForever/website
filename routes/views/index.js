exports = module.exports = function(req, res) {

  let locals = res.locals;
  let fs = require('fs');

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
    
  fs.readFile('members/top5.json', 'utf8', function (err, data) {
    if(data) {
      locals.topPlayers = JSON.parse(data);
    }
    else {
      locals.topPlayers = {}
    }
    // Render the view
    res.render('index');
  });

};
