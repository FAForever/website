var wp = require('../wp_connector');

exports = module.exports = function(req, res) {

  var locals = res.locals;

  // locals.section is used to set the currently selected
  // item in the header navigation.  
  locals.section = 'news';
  locals.title = 'FAForever Newshub';
  locals.content = {};

  wp.connect()
    .posts()
    .embed()
    .page(1)
    .perPage(100)
    .categories(process.env.WP_NEWSHUB_CATEGORYID) // only show articles with newshub category
    .then(function(data) {

      var posts = data
        .map(function( post ) {
            
            var p = {
                // vanilla wordpress
                id: post.id,
                title: post.title.rendered,
                // custom fields
                linkUrl : post.newshub_externalLinkUrl,
                position : post.newshub_pos,
                sortIndexAsc : post.newshub_sortIndexAsc == "" ? 1000000 : parseInt(post.newshub_sortIndexAsc)
            }
            // optional vanilla wordpress
            var images = post._embedded["wp:featuredmedia"]
            var image = images == null ? null : images[0];
            if (image != null) p.imageUrl = image.source_url;
            if (post.excerpt.rendered != "") p.paragraph = post.excerpt.rendered;

            // optional custom fields
            if (post.newshub_backgroundcolor != "") p.backgroundcolor = post.newshub_backgroundcolor;
            if (post.newshub_customStyle != "") p.customStyle = post.newshub_customStyle;
            if (post.newshub_subtitle != "") p.subtitle = post.newshub_subtitle;
            if (post.newshub_badge != "") p.badge = post.newshub_badge;
            return p;
        })
        .sort(function(a, b){ 
            return a.sortIndexAsc-b.sortIndexAsc 
        });

      var getPosts = function(type) {
        return posts.filter(function(p) { return p.position == type; })
      }
      var getPost = function(type) {
        var filtered = getPosts(type);
        return filtered.length == 0 ? null : filtered[0];
      }

      locals.content.topbar = getPost("topbar");
      locals.content.hero = getPost("hero");
      locals.content.col1 = getPosts("col1");
      locals.content.col2 = getPosts("col2");
      locals.content.col3 = getPosts("col3");
      locals.content.sidebarLeft = getPost("sidebarLeft");
      locals.content.sidebarMiddle = getPost("sidebarMiddle");
      locals.content.sidebarRight = getPost("sidebarRight");

      res.render('newshub');
    })
    .catch(function(err) {
      console.log('Error on loading news from wordpress: ' + err);
    });

};
