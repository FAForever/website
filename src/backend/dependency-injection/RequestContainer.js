const { ContainerBuilder, Reference } = require('node-dependency-injection')
const { UserRepository } = require('../services/UserRepository')
const { UserService } = require('../services/UserService')

module.exports.RequestContainer = (appContainer, request) => {
    const container = new ContainerBuilder()

    container.setParameter('request', request)

    container.register('UserRepository', UserRepository)
        .addArgument(new Reference('JavaApiClient'))
        .lazy = true

    container.register('JavaApiClient')
        .synthetic = true
    container.register('UserService', UserService)

    return container
}
