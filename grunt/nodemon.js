//Runs express script and sets default port to 3000 if environment is not set.
module.exports = {
  debug: {
    options: {
      delay: 500,
      ignore: [
        'dist/js/*.js',
        'sessions/**',
        'node_modules/**',
        'grunt/**',
        'Gruntfile.js',
      ]
    }
  }
};
