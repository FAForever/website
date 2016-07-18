var keystone = require('keystone');
var wp = require('../wp_connector');
var moment = require('moment');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.data = {
		posts: []
	};

	//Moment is used for converting timestamp to January 1st 2016...
	locals.moment = moment;

	//Set the default page number if not specified to 1
	var page = (req.params.page ? req.params.page : 1);

	var filter = {};

	//Setup filters based upon parameter... Otherwise default to empty object
	if (req.params.category) {
		filter = {category_name: req.params.category};
	} else if (req.params.tag) {
		filter = {tag: [req.params.tag]};
	} else if (req.params.author) {
		filter = {author_name: req.params.author};
	}

	//Set the current page to reference in pagination
	locals.data.currentPage = page;

	//Grab data before rendering the page for SEO...
	wp.connect().posts().embed().page(page).perPage(6).filter(filter).then(function( data ) {
		locals.data.posts = data;
		// do something with the returned posts

		// Render the view
		view.render('blog');
	}).catch(function( err ) {
		// handle error
	});

};
