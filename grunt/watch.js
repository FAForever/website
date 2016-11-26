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
		tasks: ['jshint:server', 'concurrent:dev']
	},
	sass: {
		files: ['public/styles/**/*.scss'],
		tasks: ['sass:dev']
	},
	livereload: {
		files: [
			'public/styles/**/*.css'
		],
		options: {
			livereload: true
		}
	}
};
