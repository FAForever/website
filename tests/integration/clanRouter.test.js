const supertestSession = require('supertest-session')
const { AppKernel } = require('../../src/backend/AppKernel')

let testSession = null
beforeEach(async () => {
    const kernel = new AppKernel()
    await kernel.boot()
    kernel.loadControllers()
    testSession = supertestSession(kernel.expressApp)
})

describe('Clan Routes', function () {
    const arr = ['/clans', '/clans/everything']

    test.each(arr)('responds with 503 to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(503)
        expect(res.text).toContain('Sorry commanders, we failed to build enough pgens and are now in a tech upgrade')
    })
})
