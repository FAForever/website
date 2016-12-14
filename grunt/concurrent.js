module.exports = {
	dev: {
		tasks: ['nodemon:debug', 'concat:js', 'uglify:dev', 'watch'],
		options: {
			logConcurrentOutput: true
		}
	}
};
