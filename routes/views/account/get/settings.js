exports = module.exports = function(req, res) {


	res.locals.formData = req.body || {};

  switch (req.path.slice(9)) {
    case 'changePassword':
      res.locals.page = 'changePassword';
      break;
    case 'changeEmail':
      res.locals.page = 'changeEmail';
      break;
    case 'settings':
    case 'changeUsername':
      res.locals.page = 'changeUsername';
      break;
  }
	// Render the view
	res.render('account/settings');

};
