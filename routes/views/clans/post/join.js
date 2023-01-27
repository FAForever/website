const axios = require("axios");
const error = require("../../account/post/error");

exports = module.exports = function (req, res) {

  // item in the header navigation.
  let flash = {};
  
  if (!req.query.token) {
    flash.type = 'Error!';
    flash.class = 'alert-danger';
    flash.messages = [{msg: 'The invitation link is invalid!'}];
    res.render('/clans', {flash: flash});
  } else {
    const token = req.query.token;

    axios.post(`${process.env.API_URL}/clans/joinClan?token=${token}`, null, 
      {
      headers: {'Authorization': `Bearer ${req.user.token}`}
    }).then(() => {
        // Refreshing user, by going to clan/manage, user is redirected to their own clan.
        error.userUpdate(req, res, '/clans/manage');
    }).catch( e => {
      console.log(e);
    });
  }
};
