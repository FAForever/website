module.exports = {
  postcss: { // Begin Post CSS Plugin
    options: {
      map: false,
      processors: [
        require('autoprefixer')({
          browsers: ['last 8 versions', 'ie 9']
        })
      ]
    },
    cwd: '<%= paths.public %>/styles/css/',
    src: '*.css',
    dest: '<%= paths.public %>/styles/css/',
    expand: true,
    ext: '.css'
  }
};
