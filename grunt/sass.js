module.exports = {
	dev: {
        options: {
            style: 'expanded',
            compass: true
        },
        files: {
            'public/styles/css/site.min.css': 'public/styles/site.scss',
            'public/styles/css/contributions.min.css': 'public/styles/site/contributions.scss',
            'public/styles/css/account.min.css': 'public/styles/site/account.scss',
            'public/styles/css/index.min.css': 'public/styles/site/index.scss',
            'public/styles/css/post.min.css': 'public/styles/site/post.scss',
            'public/styles/css/news.min.css': 'public/styles/site/news.scss',
            'public/styles/css/calendar.min.css': 'public/styles/site/calendar.scss',
            'public/styles/css/leaderboards.min.css': 'public/styles/site/leaderboards.scss'
        }
    },
    dist: {
        options: {
            style: 'compressed',
            compass: true
        },
        files: {
            'public/styles/css/site.min.css': 'public/styles/site.scss',
            'public/styles/css/contributions.min.css': 'public/styles/site/contributions.scss',
            'public/styles/css/account.min.css': 'public/styles/site/account.scss',
            'public/styles/css/index.min.css': 'public/styles/site/index.scss',
            'public/styles/css/post.min.css': 'public/styles/site/post.scss',
            'public/styles/css/news.min.css': 'public/styles/site/news.scss',
            'public/styles/css/calendar.min.css': 'public/styles/site/calendar.scss',
            'public/styles/css/leaderboards.min.css': 'public/styles/site/leaderboards.scss'
        }
    }
};
