const { ContainerBuilder, Reference } = require('node-dependency-injection')
const { UserRepository } = require('../services/UserRepository')
const { UserService } = require('../services/UserService')
const { ClanManagementService } = require('../services/ClanManagementService')
const {
    ClanManagementRepository,
} = require('../services/ClanManagementRepository')

module.exports.RequestContainer = (appContainer, request) => {
    const container = new ContainerBuilder()

    container.setParameter('request', request)

    container
        .register('UserRepository', UserRepository)
        .addArgument(new Reference('JavaApiClient')).lazy = true

    container
        .register('ClanManagementService', ClanManagementService)
        .addArgument(new Reference('UserService'))
        .addArgument(new Reference('ClanManagementRepository')).lazy = true

    container
        .register('ClanManagementRepository', ClanManagementRepository)
        .addArgument(new Reference('JavaApiClient')).lazy = true

    container
        .register('ClanManagementService', ClanManagementService)
        .addArgument(new Reference('UserService'))
        .addArgument(new Reference('ClanManagementRepository'))
        .addArgument(appContainer.get('ClanService')).lazy = true

    container.register('JavaApiClient').synthetic = true

    container.register('UserService', UserService).lazy = true

    return container
}
