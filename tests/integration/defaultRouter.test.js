const supertestSession = require('supertest-session')
const { AppKernel } = require('../../src/backend/AppKernel')

let testSession = null
beforeEach(async () => {
    const kernel = new AppKernel()
    await kernel.boot()
    kernel.loadControllers()
    testSession = supertestSession(kernel.expressApp)
})
describe('Default Routes', function () {
    const arr = [
        '',
        '/',
        '/newshub',
        '/campaign-missions',
        '/scfa-vs-faf',
        '/donation',
        '/tutorials-guides',
        '/ai',
        '/faf-teams',
        '/contribution',
        '/content-creators',
        '/play',
    ]

    test.each(arr)('responds with OK to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    })
})
