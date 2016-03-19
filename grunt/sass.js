module.exports = {
	dev: {
        options: {
            style: 'expanded',
            compass: true
        },
        files: {
            'public/styles/css/site.min.css': 'public/styles/site.scss',
            'public/styles/css/contributions.min.css': 'public/styles/site/contributions.scss',
            'public/styles/css/index.min.css': 'public/styles/site/index.scss',
            'public/styles/css/news.min.css': 'public/styles/site/news.scss'
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
            'public/styles/css/index.min.css': 'public/styles/site/index.scss',
            'public/styles/css/news.min.css': 'public/styles/site/news.scss'
        }
    }
};
