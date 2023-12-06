const Scheduler = require('../services/Scheduler')

const successHandler = (name) => {
    console.debug('[debug] Cache updated', { name })
}
const errorHandler = (e, name) => {
    console.error(e.toString(), { name, entrypoint: 'clanCacheCrawler.js' })
    console.error(e.stack)
}

const warmupClans = async (clanService) => {
    try {
        await clanService.getAll(false)
            .then(() => successHandler('clanService::getAll(global)'))
            .catch((e) => errorHandler(e, 'clanService::getAll(global)'))
    } catch (e) {
        console.error('Error: clanCacheCrawler::warmupClans failed with "' + e.toString() + '"',
            { entrypoint: 'clanCacheCrawler.js' })
        console.error(e.stack)
    }
}

/**
 * @param {clanService} clanService
 * @return {Scheduler[]}
 */
module.exports = (clanService) => {
    warmupClans(clanService).then(() => {})

    const clansScheduler = new Scheduler('createClanCache',
        () => warmupClans(clanService).then(() => {}), 60 * 59 * 1000)
    clansScheduler.start()

    return clansScheduler
}
