const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const path = require('path')

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false } },
                    'sass-loader',
                ],
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
        'scroll-to-flash': ['./src/frontend/js/entrypoint/scroll-to-flash.js'],
        styles: ['./public/styles/site.sass'],
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        clean: true,
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
        }),
        new WebpackManifestPlugin(),
    ],
}
