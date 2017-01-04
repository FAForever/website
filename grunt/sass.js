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
      style: 'compressed',
      compass: true
    },
    files: {
      'public/styles/css/site.min.css': 'public/styles/site.sass',
    }
  }
};
