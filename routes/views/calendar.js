const locale = require("accept-language-parser");
const challonge_config = require('../challonge_config');
const request = require('request');

exports = module.exports = function(req, res) {
  let locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'calendar';

  locals.calendar = process.env.GOOGLE_CALENDAR_API_KEY;

  let languages = locale.parse(req.headers["accept-language"]);

  if (languages.length > 0) {
    locals.locale = languages[0].code;
  } else {
    locals.locale = 'en';
  }

  request(challonge_config.getAuth() + '/tournaments.json', function (error, response, body) {
    if (error || response.statusCode != 200) {
      locals.error = true;
      return res.render('calendar');
    } else {
      let tournaments = JSON.parse(body);

      locals.tournaments = tournaments
        .map(t => t.tournament)
        .filter(t => t.start_at || t.started_at)
        .map(t => ({
          id: t.id,
          title: t.name,
          start: t.start_at || t.started_at,
          end: t.completed_at,
          url: t.full_challonge_url,
          description: t.description
        }));
      return res.render('calendar');
    }
  });

};
