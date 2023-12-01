// Runs express script and sets default port to 3000 if environment is not set.
module.exports = {
    debug: {
        script: 'src/backend/index.js',
        options: {
            delay: 500,
            ignore: [
                'dist/js/*.js',
                'sessions/**',
                'node_modules/**',
                'grunt/**',
                'Gruntfile.js'
            ]
        }
    }
}
