exports = module.exports = function(req, res) {

  let locals = res.locals;
  
  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home';
  
  // This flash system may be still in use. Check if any page redirects here with ?flash= as a GET parameter
  // If nothing uses it, feel free to remove this section & remove the flash reference from the express render() call
  // Until  proven otherwise, consider it in use
  let flash = {};

  if (req.query.flash) {
    let buff = Buffer.from(req.query.flash, 'base64');  
    let text = buff.toString('ascii');

    try {
      flash = JSON.parse(text);
    } catch(e) {
      console.error("Parsing error while trying to decode a flash error: " + text);
      console.error(e);
      flash = [{msg: "Unknown error"}];
    }
  }
  
  res.render('index', {flash: flash, refreshCountersSeconds: parseInt(process.env.PLAYER_COUNT_UPDATE_INTERVAL)});
};
