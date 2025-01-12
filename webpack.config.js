const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    entry: {
        clan: ['./src/frontend/js/entrypoint/clan.js'],
        clans: ['./src/frontend/js/entrypoint/clans.js'],
        'content-creators': [
            './src/frontend/js/entrypoint/content-creators.js',
        ],
        donation: ['./src/frontend/js/entrypoint/donation.js'],
        'faf-teams': ['./src/frontend/js/entrypoint/faf-teams.js'],
        leaderboards: ['./src/frontend/js/entrypoint/leaderboards.js'],
        navigation: ['./src/frontend/js/entrypoint/navigation.js'],
        newshub: ['./src/frontend/js/entrypoint/newshub.js'],
        play: ['./src/frontend/js/entrypoint/play.js'],
        report: ['./src/frontend/js/entrypoint/report.js'],
        'clan-invite': ['./src/frontend/js/entrypoint/clan-invite.js'],
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: '/dist/js',
        clean: true,
    },
    plugins: [new WebpackManifestPlugin({ useEntryKeys: true })],
}
