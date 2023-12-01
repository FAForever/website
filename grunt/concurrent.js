module.exports = {
    dev: {
        tasks: [['run:webpack', 'sass:dev', 'nodemon'], 'watch'],
        options: {
            logConcurrentOutput: true
        }
    }
}
