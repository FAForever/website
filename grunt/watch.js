module.exports = {
	js: {
		files: [
			'public/js/app/*.js'
		],
		tasks: ['concat:js'],
	},
	express: {
		files: [
      'routes/**/*.js',
			'express.js',
		]
	},
	sass: {
		files: ['public/styles/**/*.{scss,sass}'],
		tasks: ['sass:dev']
	},
	livereload: {
		files: [
			'public/styles/**/*.css'
		],
	}
};
