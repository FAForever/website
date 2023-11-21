const appConfig = require("../config/app")
const WordpressServiceFactory = require("../lib/WordpressServiceFactory");
const Scheduler = require("../lib/Scheduler");

const warmupWordpressCache = async () => {
    const wordpressService = WordpressServiceFactory(appConfig.wordpressUrl)
    
    const successHandler = (name) => {
        console.info(name, 'cache generated')
    }
    const errorHandler = (e, name) => {
        console.error(name, e.toString(), 'cache failed')
    }
    
    wordpressService.getNews(true).then(() => successHandler('getNews')).catch((e) => errorHandler(e, 'getNews'))
    wordpressService.getNewshub(true).then(() => successHandler('getNewshub')).catch((e) => errorHandler(e, 'getNewshub'))
    wordpressService.getContentCreators(true).then(() => successHandler('getContentCreators')).catch((e) => errorHandler(e, 'getContentCreators'))
    wordpressService.getTournamentNews(true).then(() => successHandler('getTournamentNews')).catch((e) => errorHandler(e, 'getTournamentNews'))
    wordpressService.getFafTeams(true).then(() => successHandler('getFafTeams')).catch((e) => errorHandler(e, 'getFafTeams'))
}

module.exports = async () => {
    await warmupWordpressCache()
    
    const wordpressScheduler = new Scheduler('createWordpressCaches', warmupWordpressCache, 60 * 59 * 1000)
    wordpressScheduler.start()
}
