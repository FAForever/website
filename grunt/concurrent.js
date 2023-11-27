module.exports = {
	dev: {
		tasks: [['run:webpack','copy', 'sass:dev','nodemon'], 'watch'],
		options: {
			logConcurrentOutput: true
		}
	}
};
