var wp = require('../wp_connector');

function processPosts(res, data) {

    var posts = data
      .map(mapPost)
      .sort(function(a, b){ 
          return b.sortIndex - a.sortIndex 
      });

    res.locals.content.topbar = getPost(posts, "topbar");
    res.locals.content.sidebarLeft = getPost(posts, "sidebarLeft");
    res.locals.content.sidebarMiddle = getPost(posts, "sidebarMiddle");
    res.locals.content.sidebarRight = getPost(posts, "sidebarRight");
    res.locals.content.rightArticles = getPosts(posts, "rightArticles");
    res.locals.content.normalArticles = posts.filter(function(post) 
    { 
      return post.position != "rightArticles" 
        && post.position != "topbar"
        && post.position != "sidebarLeft"
        && post.position != "sidebarMiddle"
        && post.position != "sidebarRight";
    });

    res.render('newshub');
}

function mapPost(post)
{        
    var mappedPost = {
        // vanilla wordpress
        id : post.id,
        title : post.title.rendered,
        paragraph : post.excerpt.rendered,
        image : null,
        // custom fields
        linkUrl : post.newshub_externalLinkUrl,
        position : post.newshub_pos,
        backgroundcolor : post.newshub_backgroundcolor,
        customStyle : post.newshub_customStyle,
        subtitle : post.newshub_subtitle,
        badge : post.newshub_badge,
        sortIndex : isNaN(parseInt(post.newshub_sortIndex)) ? post.id : parseInt(post.newshub_sortIndex)
    }

    // optional vanilla wordpress
    var images = post._embedded["wp:featuredmedia"]
    var image = images == null ? null : images[0];
    if (image != null) mappedPost.imageUrl = image.source_url;

    return mappedPost;
}

function getPosts(posts, type) {
    return posts.filter(function(post) { return post.position == type; })
}

function getPost (posts, type) {
    var filtered = getPosts(posts, type);
    return filtered.length == 0 ? null : filtered[0];
}

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
    .excludeCategories(process.env.WP_NEWSHUBARCHIVE_CATEGORYID) // exclude articles with archive category
    .then(function(data) { processPosts (res, data) })
    .catch(function(err) {
      console.log('Error on loading news from wordpress: ' + err.name + '.' + err.message);
    });

};
