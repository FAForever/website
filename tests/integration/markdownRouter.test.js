const Express = require('../../ExpressApp')
const supertestSession = require('supertest-session')
const fafApp = require('../../fafApp')

let testSession = null
beforeEach(() => {
    const app = new Express()
    fafApp.setup(app)
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
})

describe('Privacy And TOS Routes', function () {
    const arr = [
        '/privacy',
        '/privacy-fr',
        '/privacy-ru',
        '/tos',
        '/tos-fr',
        '/tos-ru',
        '/rules',
        '/cg'
    ]

    test.each(arr)('responds with OK to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    })
})
