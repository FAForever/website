const sass = require('dart-sass');

module.exports = {
  dev: {
    options: {
      style: 'expanded',
      compass: true
    },
    files: {
      'public/styles/css/site.min.css': 'public/styles/site.sass',
    }
  },
  dist: {
    options: {
      implementation: sass,
      style: 'compressed',
      compass: true
    },
    files: {
      'public/styles/css/site.min.css': 'public/styles/site.sass',
    }
  }
};
