require('dotenv').config()

const oauthUrl =
    process.env.OAUTH_URL || `https://hydra.${process.env.BASE_DOMAIN}`

const appConfig = {
    nodeEnv: process.env.NODE_ENV || 'production',
    expressPort: process.env.PORT || '3000',
    host: process.env.HOST || 'http://localhost',
    session: {
        key: process.env.SESSION_SECRET_KEY || '12345',
        tokenLifespan: process.env.TOKEN_LIFESPAN || 43200,
    },
    oauth: {
        strategy: 'faforever',
        clientId: process.env.OAUTH_CLIENT_ID || '12345',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || '12345',
        url: oauthUrl,
        publicUrl: process.env.OAUTH_PUBLIC_URL || oauthUrl,
        callback: process.env.CALLBACK || 'callback',
    },
    m2mOauth: {
        clientId: process.env.OAUTH_M2M_CLIENT_ID || 'faf-website-public',
        clientSecret: process.env.OAUTH_M2M_CLIENT_SECRET || 'banana',
        url: oauthUrl,
    },
    userServiceUrl:
        process.env.USER_SERVICE_URL ||
        `https://user.${process.env.BASE_DOMAIN}`,
    apiUrl: process.env.API_URL || `https://api.${process.env.BASE_DOMAIN}`,
    forumUrl:
        process.env.FORUM_URL || `https://forum.${process.env.BASE_DOMAIN}`,
    wordpressUrl:
        process.env.WP_URL || `https://direct.${process.env.BASE_DOMAIN}`,
    discordUrl: process.env.DISCORD_URL || 'https://discord.gg/mXahVSKGVb',
    extractorInterval: process.env.EXTRACTOR_INTERVAL || 5,
    playerCountInterval: process.env.PLAYER_COUNT_INTERVAL || 15,
    recaptchaKey: process.env.RECAPTCHA_SITE_KEY || 'test',
}

module.exports = appConfig
