const Express = require('../../ExpressApp')
const supertestSession = require('supertest-session')
const fafApp = require('../../fafApp')

let testSession = null
beforeEach(async () => {
    const app = new Express()
    fafApp.setup(app)
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
})

describe('Clan Routes', function () {
    const arr = ['/clans', '/clans/everything']

    test.each(arr)('responds with 503 to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(503)
        expect(res.text).toContain('Sorry commanders, we failed to build enough pgens and are now in a tech upgrade')
    })
})
