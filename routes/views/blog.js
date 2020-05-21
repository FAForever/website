var wp = require('../wp_connector');
var moment = require('moment');
var momentTimezone = require('moment-timezone');
var ellipsis = require('html-ellipsis');
var itemsPerPage = 9;

exports = module.exports = function(req, res) {
  var locals = res.locals;

  // Init locals
  locals.section = 'news';
  locals.title = 'FAForever News';
  locals.data = {
    posts: []
  };

  // Moment is used for converting timestamp to January 1st 2016...
  locals.moment = moment;
  locals.momentTimezone = momentTimezone;
  locals.ellipsis = ellipsis;

  // Set the default page number if not specified to 1
  var page = req.params.page ? parseInt(req.params.page) : 1;

  var search = {};
  var urlGenerator = '/news/page/';

  // Setup the current URL
  if (req.params.category) {
    urlGenerator = '/category/' + req.params.category + '/page/';
  } else if (req.params.tag) {
    urlGenerator = '/tag/' + req.params.tag + '/page/';
  } else if (req.params.author) {
    urlGenerator = '/author/' + req.params.author + '/page/';
  }

  if (req.params.search) {
    urlGenerator = '/news/search/' + req.params.search + '/page/';
    search = req.params.search;
  }

  // Set the current page to reference in pagination
  locals.data.currentPage = page;

  // Sets the current url
  locals.data.currentUrl = urlGenerator;

  // search keyword
  locals.data.search = JSON.stringify(search) === '{}' ? '' : search;

  // Search for the given text.
  if (locals.data.search) {
    // Grab data before rendering the page for SEO.
    wp.connect()
      .posts()
      .embed()
      .page(page)
      .perPage(itemsPerPage)
      .excludeCategories(process.env.WP_NEWSHUB_CATEGORYID) // exclude articles with newshub category on blog
      .search(search)
      .then(function(data) {
        locals.data.posts = data;
        // Render the view
        res.render('blog');
      })
      .catch(function(err) {
        console.log('Error on loading news from wordpress: ' + err);
      });
  }
  // If it's not a search, it's something else.
  // We'll check if it's a category, a tag or an author.
  // If so the slug is resolved (as we ne the id) and then we'll use the id
  // to get the relevant data.
  // Default show's all news without any filter.
  // Currently there is no concatenation between author/category/tag.
  // If needed the queries can be modified and extended like this:
  // http://wp-api.org/node-wpapi/using-the-client/#api-query-parameters
  else {
    // Category view
    if (req.params.category) {
      wp.connect()
        .categories()
        // .slug() queries will always return as an array
        .slug(req.params.category)
        .then(function(cats) {
          // Always take the first result.
          var category = cats[0];
          return wp
            .connect()
            .posts()
            .categories(category.id)
            .embed()
            .page(page)
            .perPage(itemsPerPage)
            .excludeCategories(process.env.WP_NEWSHUB_CATEGORYID); // exclude articles with newshub category on blog
        })
        .then(function(data) {
          locals.data.posts = data;
          // Render the view
          res.render('blog');
        })
        .catch(function(err) {
          console.log('Error on loading news from wordpress: ' + err);
        });
    } else if (req.params.tags) {
      wp.connect()
        .tags()
        .slug(req.params.tag)
        .then(function(tags) {
          var tag = tags[0];
          return wp
            .connect()
            .posts()
            .tags(tag.id)
            .embed()
            .page(page)
            .perPage(itemsPerPage)
            .excludeCategories(process.env.WP_NEWSHUB_CATEGORYID); // exclude articles with newshub category on blog
        })
        .then(function(data) {
          locals.data.posts = data;
          res.render('blog');
        })
        .catch(function(err) {
          console.log('Error on loading news from wordpress: ' + err);
        });
    } else if (req.params.author) {
      wp.connect()
        .users()
        .slug(req.params.author)
        .then(function(users) {
          var author = users[0];
          return wp
            .connect()
            .posts()
            .author(author.id)
            .embed()
            .page(page)
            .perPage(itemsPerPage)
            .excludeCategories(process.env.WP_NEWSHUB_CATEGORYID); // exclude articles with newshub category on blog
        })
        .then(function(data) {
          locals.data.posts = data;
          res.render('blog');
        })
        .catch(function(err) {
          console.log('Error on loading news from wordpress: ' + err);
        });
    } else {
      wp.connect()
        .posts()
        .embed()
        .page(page)
        .perPage(itemsPerPage)
        .excludeCategories(process.env.WP_NEWSHUB_CATEGORYID) // exclude articles with newshub category on blog
        .then(function(data) {
          locals.data.posts = data;
          res.render('blog');
        })
        .catch(function(err) {
          console.log('Error on loading news from wordpress: ' + err);
        });
    }
  }
};
