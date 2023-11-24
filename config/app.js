require('dotenv').config();

const oauthUrl = process.env.OAUTH_URL || 'https://hydra.faforever.com'

const appConfig = {
    nodeEnv: process.env.NODE_ENV || 'production',
    expressPort: process.env.PORT || '3000',
    host: process.env.HOST || 'http://localhost',
    session: {
        key: process.env.SESSION_SECRET_KEY || '12345',
        tokenLifespan: process.env.TOKEN_LIFESPAN || 43200
    },
    oauth: {
        strategy: 'faforever',
        clientId: process.env.OAUTH_CLIENT_ID || '12345',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || '12345',
        url: oauthUrl,
        publicUrl: process.env.OAUTH_PUBLIC_URL || oauthUrl,
        callback: process.env.CALLBACK || 'callback',
    },
    apiUrl: process.env.API_URL || 'https://api.faforever.com',
    wordpressUrl: process.env.WP_URL || 'https://direct.faforever.com',
    extractorInterval: process.env.EXTRACTOR_INTERVAL || 5,
    playerCountInterval: process.env.PLAYER_COUNT_INTERVAL || 15
}

module.exports = appConfig
