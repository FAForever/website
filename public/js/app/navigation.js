if (document.querySelector('.navigation-wrapper') !== null) {
  var headroom = new Headroom(document.querySelector('.navigation-wrapper'), {
    'offset': 100,
    'tolerance': 5,
    'classes': {
      'initial': '',
      'pinned': 'pinned',
      'unpinned': 'unpinned',
      'top': 'at-top',
      'notTop': 'not-at-top',
      'bottom': 'at-bottom',
      'notBottom': 'not-at-bottom'
    }
  });

  headroom.init();
}
  
$(document).ready(function() {
  $('.toggle-nav').click(function() {
    if ($('.navigation-wrapper').hasClass('opened')) {
      $('body').removeClass('nav-locked');
    } else {
      $('body').addClass('nav-locked');
    };
    $('.navigation-wrapper').toggleClass('opened');
  });
});
