module.exports = {
	dev: {
		tasks: ['nodemon', 'concat', 'watch', 'copy', 'sass:dev'],
		options: {
			logConcurrentOutput: true
		}
	}
};
