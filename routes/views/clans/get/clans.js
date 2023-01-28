exports = module.exports = function (req, res) {
  let flash = {};
  if (req.query.flash) {
    
    flash.class = 'alert-success';
    flash.type = 'Success!';
    switch (req.query.flash) {
      case 'leave':
        flash.messages = 'You left your clan.';
        break;

      case 'destroy':
        flash.messages = 'You deleted your clan.';
        break;
        
      case 'transfer':
        flash.messages = `You have transferred your clan to ${req.query.newLeader}.`;
        break;
        
      case 'error':
        flash.class = 'alert-danger';
        flash.messages = 'There was an issue with your request.';
        flash.type = 'Error!';
        break;
    }
  }
  res.render('clans', {flash: flash});

};
