module.exports = {
    js: {
        nonull: true,
        files: {
            'public/js/account.min.js': [
                'node_modules/bootstrap-validator/dist/validator.js'
            ],
            'public/js/newshub.min.js': [
                'public/js/app/newshub.js'
            ],
            'public/js/report.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'public/js/app/report.js'
            ],
        }
    }
};
