module.exports = {
    js: {
        files: {
            'public/js/bottom.min.js': [
                'public/js/jquery/jquery-1.11.3.min.js',
                'public/js/bootstrap/bootstrap-3.3.5.min.js',
                'public/js/app/headroom.min.js',
                'public/js/app/navigation.js'
            ],
            'public/js/leaderboards.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'node_modules/moment/min/moment-with-locales.min.js',
                'node_modules/highcharts/highcharts.js',
                'public/js/jquery/jquery.animatedscroll-1.1.5.min.js',
                'public/js/app/leaderboards.js'
            ],
            'public/js/leagues.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'node_modules/moment/min/moment-with-locales.min.js',
                'node_modules/highcharts/highcharts.js',
                'public/js/jquery/jquery.animatedscroll-1.1.5.min.js',
                'public/js/app/leagues.js'
            ],
            'public/js/account.min.js': [
                'node_modules/bootstrap-validator/dist/validator.js'
            ],
            'public/js/blog.min.js': [
                'public/js/app/blog.js'
            ],
            'public/js/newshub.min.js': [
                'public/js/app/newshub.js'
            ],
            'public/js/report.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'public/js/app/report.js'
            ],
            'public/js/browse_clans.min.js': [
                'node_modules/awesomplete/awesomplete.js',
                'public/js/app/browse_clans.js'
            ],
            'public/js/world-map-dependencies.min.js': [
                'public/armchart_4.1.12/armcharts4/core.js',
                'public/armchart_4.1.12/armcharts4//maps.js',
                'public/armchart_4.1.12/armcharts4-geodata/worldLow.js',
                'public/armchart_4.1.12/armcharts4-geodata/continentsLow.js',
                'public/armchart_4.1.12/armcharts4/themes/animated.js',
            ],
            'public/js/world-map.min.js': [
                'public/js/app/world-map.js'
            ]
        }
    }
};
