const Express = require('../../src/backend/ExpressApp')
const supertestSession = require('supertest-session')

let testApp = null
let testSession = null

beforeEach(() => {
    const app = new Express()
    testSession = supertestSession(app)
    testApp = app
})

describe('Async Error Handler', function () {
    test('route is protected and redirects to "/login"', async () => {
        testApp.get('/', async () => {
            throw new Error('test failed and node crashed')
        })
        testApp.use((err, req, res, next) => {
            res.status(500).send('not crashed')
            next(err)
        })

        const res = await testSession.get('/')

        expect(res.status).toBe(500)
        expect(res.text).toBe('not crashed')
    })
})
