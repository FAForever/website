exports = module.exports = function(req, res) {

  let locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'clan';

  const request = require('request');

  request.get(
    {
      url: process.env.API_URL + '/clans/me',
      headers: {
        'Authorization': 'Bearer ' + req.user.token
      }
    },
    function (err, childRes, body) {

      const clanInfo = JSON.parse(body);
      if (clanInfo.clan != null){
        res.redirect('/clans/manage');
        return;
      }

      locals.formData = req.body || {};
      locals.clan_name = req.query.clan_name || "";
      locals.clan_tag = req.query.clan_tag || "";
      locals.clan_description = req.query.clan_description || "";
      locals.clan_create_time = (new Date()).toUTCString();

      var flash = null;

      if (req.query.flash){
        let buff = Buffer.from(req.query.flash, 'base64');
        let text = buff.toString('ascii');

        try{
          flash = JSON.parse(text);
        }
        catch(e){
          console.error("Parsing error while trying to decode a flash error: " + text);
          console.error(e);
          flasg = [{msg: "Unknown error"}];
        }
      }

      // Render the view
      res.render('clans/create', {flash: flash});
    }
  );
};
