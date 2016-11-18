module.exports = {
	js: {
		files: [
			'model/**/*.js',
			'routes/**/*.js',
			'public/js/app/*.js'
		],
		tasks: ['jshint:all', 'concat:js', 'uglify:dev'],
		options: {
			livereload: true
		}
	},
	express: {
		files: [
			'express.js',
			'public/js/lib/**/*.{js,json}'
		],
		tasks: ['jshint:server', 'concurrent:dev'],
		options: {
			livereload: true
		}
	},
	sass: {
		files: ['public/styles/**/*.scss'],
		tasks: ['sass:dev'],
		options: {
			livereload: true
		}
	}
};
