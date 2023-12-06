const { appContainer } = require('./dependency-injection/AppContainer')
const { RequestContainer } = require('./dependency-injection/RequestContainer')
const { RequestContainerCompilerPass } = require('./dependency-injection/RequestContainerCompilerPass')
const { webpackAsset } = require('./middleware/webpackAsset')
const { bootPassport } = require('./security/bootPassport')
const express = require('./ExpressApp')
const appConfig = require('./config/app')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const wordpressCacheCrawler = require('./cron-jobs/wordpressCacheCrawler')
const leaderboardCacheCrawler = require('./cron-jobs/leaderboardCacheCrawler')
const clanCacheCrawler = require('./cron-jobs/clanCacheCrawler')
const defaultRouter = require('./routes/views/defaultRouter')
const authRouter = require('./routes/views/auth')
const staticMarkdownRouter = require('./routes/views/staticMarkdownRouter')
const newsRouter = require('./routes/views/news')
const leaderboardRouter = require('./routes/views/leaderboardRouter')
const clanRouter = require('./routes/views/clanRouter')
const accountRouter = require('./routes/views/accountRouter')
const dataRouter = require('./routes/views/dataRouter')

class AppKernel {
    constructor (nodeEnv = 'production') {
        this.env = nodeEnv
        this.config = appConfig
        this.expressApp = null
        this.appContainer = null
        this.schedulers = []
    }

    async boot () {
        await this.compileContainer(this.config)
        this.bootstrapExpress()
        return this
    }

    async compileContainer (config) {
        this.appContainer = appContainer(config)
        await this.appContainer.compile()
    }

    bootstrapExpress () {
        this.expressApp = express()

        this.expressApp.locals.clanInvitations = {}
        this.expressApp.use((req, res, next) => {
            res.locals.navLinks = []
            res.locals.cNavLinks = []
            res.locals.appGlobals = {
                loggedInUser: null
            }
            next()
        })

        this.expressApp.set('views', 'src/backend/templates/views')
        this.expressApp.set('view engine', 'pug')
        this.expressApp.use(express.static('public', {
            immutable: true,
            maxAge: 4 * 60 * 60 * 1000 // 4 hours
        }))

        this.expressApp.use('/dist', express.static('dist', {
            immutable: true,
            maxAge: 4 * 60 * 60 * 1000 // 4 hours, could be longer since we got cache-busting
        }))

        this.expressApp.use(express.json())
        this.expressApp.use(bodyParser.json())
        this.expressApp.use(bodyParser.urlencoded({ extended: false }))
        this.expressApp.use(webpackAsset(this.appContainer.getParameter('webpackManifestJS')))

        this.expressApp.use(session({
            resave: false,
            saveUninitialized: true,
            secret: appConfig.session.key,
            store: new FileStore({
                retries: 0,
                ttl: appConfig.session.tokenLifespan,
                secret: appConfig.session.key
            })
        }))
        bootPassport(this.expressApp, this.config)

        this.expressApp.use(async (req, res, next) => {
            req.appContainer = this.appContainer
            req.requestContainer = RequestContainer(this.appContainer, req)
            req.requestContainer.addCompilerPass(new RequestContainerCompilerPass(this.config, req))
            await req.requestContainer.compile()

            if (req.requestContainer.fafThrownException) {
                return next(req.requestContainer.fafThrownException)
            }

            next()
        })

        this.expressApp.use(flash())
        this.expressApp.use(function (req, res, next) {
            req.asyncFlash = async function () {
                const result = req.flash(...arguments)
                await new Promise(resolve => req.session.save(resolve))

                return result
            }

            return next()
        })
        this.expressApp.use(async (req, res, next) => {
            res.locals.connectFlash = () => req.flash()
            next()
        })

        this.expressApp.use(function (req, res, next) {
            if (req.isAuthenticated()) {
                res.locals.appGlobals.loggedInUser = req.requestContainer.get('UserService').getUser()
            }
            next()
        })
    }

    startCronJobs () {
        this.schedulers.push(leaderboardCacheCrawler(this.appContainer.get('LeaderboardService')))
        this.schedulers.push(wordpressCacheCrawler(this.appContainer.get('WordpressService')))
        this.schedulers.push(clanCacheCrawler(this.appContainer.get('ClanService')))
    }

    loadControllers () {
        this.expressApp.use('/', defaultRouter)
        this.expressApp.use('/', authRouter)
        this.expressApp.use('/', staticMarkdownRouter)
        this.expressApp.use('/news', newsRouter)
        this.expressApp.use('/leaderboards', leaderboardRouter)
        this.expressApp.use('/clans', clanRouter)
        this.expressApp.use('/account', accountRouter)
        this.expressApp.use('/data', dataRouter)

        this.expressApp.use((req, res) => {
            res.status(404).render('errors/404')
        })
        this.expressApp.use((err, req, res, next) => {
            console.error('[error] Incoming request to"', req.originalUrl, '"failed with error "', err.toString(), '"')
            console.error(err.stack)

            if (res.headersSent) {
                return next(err)
            }

            res.status(500).render('errors/500')
        })
    }
}

module.exports.AppKernel = AppKernel
