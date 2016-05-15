module.exports = {
	dev: {
		tasks: ['nodemon', 'node-inspector', 'concat:js', 'uglify:dev', 'watch'],
		options: {
			logConcurrentOutput: true
		}
	}
};
