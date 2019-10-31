'use strict()';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var options = {
    config: {
      src: './grunt/*.js'
    },
    paths: {
      public: './public'
    },
    pkg: grunt.file.readJSON('package.json')
  };

  var configs = require('load-grunt-config')(grunt, options);
	
  // Project configuration.
  grunt.initConfig(configs);

  // load jshint
  grunt.registerTask('lint', [
    'jshint'
  ]);

  // default option to connect server
  grunt.registerTask('serve', [
    'jshint',
    'concurrent:dev'
  ]);

  grunt.registerTask('prod', [
    'sass:dist',
    'concat:js',
    'uglify:dist'
  ]);

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  if(process.env.NODE_ENV === "development") {
	  grunt.loadNpmTasks('grunt-contrib-compass');
	  grunt.loadNpmTasks('grunt-contrib-uglify-es');
	  grunt.loadNpmTasks('grunt-sass');
	  grunt.loadNpmTasks('grunt-contrib-concat');
	  grunt.loadNpmTasks('grunt-contrib-jshint');
	  grunt.loadNpmTasks('grunt-postcss');
  }
};
