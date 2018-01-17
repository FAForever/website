var wp = require('../wp_connector');
var moment = require('moment');
var momentTimezone = require('moment-timezone');
var ellipsis = require('html-ellipsis');

exports = module.exports = function(req, res) {

	var locals = res.locals;

	// Init locals
	locals.section = 'news';
	locals.title = 'FAForever News';
	locals.data = {
		posts: []
	};

	//Moment is used for converting timestamp to January 1st 2016...
	locals.moment = moment;
	locals.momentTimezone = momentTimezone;
	locals.ellipsis = ellipsis;

	//Set the default page number if not specified to 1
	var page = (req.params.page ? parseInt(req.params.page) : 1);

	var filter = {};
	var search = {};
	var urlGenerator = '/news/page/';

	//Setup filters based upon parameter... Otherwise default to empty object
	if (req.params.category) {
		urlGenerator = '/category/' + req.params.category + '/page/';
		filter = {category_name: req.params.category};
	} else if (req.params.tag) {
        urlGenerator = '/tag/' + req.params.tag + '/page/';
        filter = {tag: [req.params.tag]};
	} else if (req.params.author) {
        urlGenerator = '/author/' + req.params.author + '/page/';
        filter = {author_name: req.params.author};
	}

	if (req.params.search) {
        urlGenerator = '/news/search/' + req.params.search + '/page/';
        search = req.params.search;
	}

	//Set the current page to reference in pagination
	locals.data.currentPage = page;

	//Sets the current url
	locals.data.currentUrl = urlGenerator;

	//search keyword
	locals.data.search = JSON.stringify(search) === '{}' ? '' : search;

	//Grab data before rendering the page for SEO...
	wp.connect().posts().embed().page(page).perPage(9).filter(filter).search(search).then(function( data ) {
		locals.data.posts = data;
		// do something with the returned posts

		// Render the view
		res.render('blog');
	}).catch(function( err ) {
		console.log('Error on loading news from wordpress: ' + err);
	});

};
