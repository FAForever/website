module.exports = {
	js: {
		files: [
			'model/**/*.js',
			'routes/**/*.js'
		],
		tasks: ['jshint:all', 'concat:js', 'uglify:dev']
	},
	express: {
		files: [
			'keystone.js',
			'public/js/lib/**/*.{js,json}'
		],
		tasks: ['jshint:server', 'concurrent:dev']
	},
	sass: {
		files: ['public/styles/**/*.scss'],
		tasks: ['sass:dev']
	},
	livereload: {
		files: [
			'public/styles/**/*.css',
		],
		options: {
			livereload: true
		}
	}
};
