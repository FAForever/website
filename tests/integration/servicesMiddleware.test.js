const Express = require('../../ExpressApp')
const WordpressService = require('../../lib/WordpressService')
const UserService = require('../../lib/LoggedInUserService')
const LeaderboardService = require('../../lib/LeaderboardService')
const supertestSession = require('supertest-session')
const fafApp = require('../../fafApp')
const passportMock = require('../helpers/PassportMock')
const { Axios } = require('axios')

let testApp = null
let testSession = null

beforeEach(() => {
    const app = new Express()
    fafApp.setup(app)
    passportMock(app, { passAuthentication: true })
    testSession = supertestSession(app)
    testApp = app
})

describe('Services Middleware', function () {
    test('public service are loaded without a user', (done) => {
        expect.assertions(3)
        testApp.get('/', (req, res) => {
            try {
                expect(req.services).not.toBeUndefined()
                expect(Object.keys(req.services).length).toBe(1)
                expect(req.services.wordpressService).toBeInstanceOf(WordpressService)

                return res.send('success')
            } catch (e) {
                done(e)
            }
        })

        testSession.get('/').then(() => done())
    })

    test('additional services are loaded with authenticated user', (done) => {
        expect.assertions(6)
        testApp.get('/', (req, res) => {
            try {
                expect(req.services).not.toBeUndefined()
                expect(Object.keys(req.services).length).toBe(4)
                expect(req.services.wordpressService).toBeInstanceOf(WordpressService)
                expect(req.services.userService).toBeInstanceOf(UserService)
                expect(req.services.javaApiClient).toBeInstanceOf(Axios)
                expect(req.services.leaderboardService).toBeInstanceOf(LeaderboardService)

                return res.send('success')
            } catch (e) {
                done(e)
            }
        })

        testSession.get('/mock-login').then(() => {
            testSession.get('/').then(() => done())
        })
    })
})
