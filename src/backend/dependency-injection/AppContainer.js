const { ContainerBuilder, Reference } = require('node-dependency-injection')
const { LeaderboardRepository } = require('../services/LeaderboardRepository')
const { LeaderboardService } = require('../services/LeaderboardService')
const { JavaApiM2MClient } = require('../services/JavaApiM2MClient')
const { WordpressService } = require('../services/WordpressService')
const { WordpressRepository } = require('../services/WordpressRepository')
const { DataRepository } = require('../services/DataRepository')
const { ClanService } = require('../services/ClanService')
const NodeCache = require('node-cache')
const { Axios } = require('axios')
const fs = require('fs')
const webpackManifestJS = JSON.parse(
    fs.readFileSync('dist/js/manifest.json', 'utf8')
)

/**
 * @param {object} appConfig
 * @return {ContainerBuilder}
 */
module.exports.appContainer = function (appConfig) {
    const container = new ContainerBuilder()

    container.setParameter('webpackManifestJS', webpackManifestJS)

    container.register('NodeCache', NodeCache).addArgument({
        stdTTL: 300, // use 5 min for all caches if not changed with ttl
        checkperiod: 600, // cleanup memory every 10 min
    })

    container.register('WordpressClient', Axios).addArgument({
        baseURL: appConfig.wordpressUrl,
    })

    container
        .register('WordpressRepository', WordpressRepository)
        .addArgument(new Reference('WordpressClient'))

    container
        .register('WordpressService', WordpressService)
        .addArgument(new Reference('NodeCache'))
        .addArgument(new Reference('WordpressRepository'))

    container
        .register('JavaApiM2MClient')
        .addArgument(appConfig.m2mOauth.clientId)
        .addArgument(appConfig.m2mOauth.clientSecret)
        .addArgument(appConfig.m2mOauth.url)
        .addArgument(appConfig.apiUrl)
        .setFactory(JavaApiM2MClient, 'createInstance')

    container
        .register('LeaderboardRepository', LeaderboardRepository)
        .addArgument(new Reference('JavaApiM2MClient'))

    container
        .register('LeaderboardService', LeaderboardService)
        .addArgument(new Reference('NodeCache'))
        .addArgument(new Reference('LeaderboardRepository'))

    container
        .register('DataRepository', DataRepository)
        .addArgument(new Reference('JavaApiM2MClient'))

    container
        .register('ClanService', ClanService)
        .addArgument(new Reference('NodeCache'))
        .addArgument(new Reference('DataRepository'))

    return container
}
