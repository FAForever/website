module.exports = {
    webpack: {
        files: ['src/frontend/**/*.js'],
        tasks: ['run:webpack']
    },
	sass: {
		files: ['public/styles/**/*.{scss,sass}'],
		tasks: ['sass:dev']
	}
};
