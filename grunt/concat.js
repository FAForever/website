module.exports = {
    js: {
        files: {
            'public/js/bottom.min.js': [
                'public/js/jquery/jquery-1.11.3.min.js',
                'public/js/bootstrap/bootstrap-3.3.5.min.js',
                'public/js/app/headroom.min.js',
                'public/js/app/navigation.js'
            ],
            'public/js/calendar.min.js': [
                'node_modules/moment/min/moment-with-locales.min.js',
                'node_modules/fullcalendar/dist/fullcalendar.min.js',
                'node_modules/fullcalendar/dist/locale-all.js',
                'node_modules/fullcalendar/dist/gcal.js',
                'node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js',
                'public/js/app/calendar.js'
            ],
            'public/js/leaderboards.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'node_modules/moment/min/moment-with-locales.min.js',
                'node_modules/highcharts/highcharts.js',
                'public/js/jquery/jquery.animatedscroll-1.1.5.min.js',
                'public/js/app/leaderboards.js'
            ],
            'public/js/account.min.js': [
                'node_modules/bootstrap-validator/dist/validator.js'
            ],
            'public/js/blog.min.js': [
                'public/js/app/blog.js'
            ]
        }
    }
};
