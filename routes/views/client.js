exports = module.exports = function(req, res) {

	var locals = res.locals;

	res.redirect(locals.downlords_faf_client_download_link);
};
