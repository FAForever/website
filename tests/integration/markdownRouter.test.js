const supertestSession = require('supertest-session')
const { AppKernel } = require('../../src/backend/AppKernel')

let testSession = null
beforeEach(async () => {
    const kernel = new AppKernel()
    await kernel.boot()
    kernel.loadControllers()
    testSession = supertestSession(kernel.expressApp)
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
        '/cg',
    ]

    test.each(arr)('responds with OK to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    })
})
