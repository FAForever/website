const supertestSession = require('supertest-session')
const { AppKernel } = require('../../src/backend/AppKernel')

let testSession = null
beforeEach(async () => {
    const kernel = new AppKernel()
    await kernel.boot()
    kernel.loadControllers()
    testSession = supertestSession(kernel.expressApp)
})

describe('Account Routes', function () {
    const protectedUrls = [
        '/account/linkGog',
        '/account/report',
        '/account/changePassword',
        '/account/changeEmail',
        '/account/changeUsername',
        '/account/resync',
        '/account/link',
        '/account/connect',
    ]

    test.each(protectedUrls)(
        '%p responds with redirect to login',
        async (route) => {
            const res = await testSession.get(route)
            expect(res.statusCode).toBe(302)
        }
    )
})
