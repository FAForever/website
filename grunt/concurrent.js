module.exports = {
	dev: {
		tasks: ['nodemon', 'concat', 'watch', 'copy'],
		options: {
			logConcurrentOutput: true
		}
	}
};
