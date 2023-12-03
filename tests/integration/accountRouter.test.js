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
    const publicUrls = [
        '/account/requestPasswordReset',
        '/account/register',
        '/account/activate'
    ]

    test.each(publicUrls)('responds with OK to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    })

    test('responds with OK to provided parameters', async () => {
        const response = await testSession.get('/account/password/confirmReset?username=turbo2&token=XXXXX')
        expect(response.statusCode).toBe(200)
        expect(response.headers.location).toBe('/account/requestPasswordReset')
    })

    test('redirect to reset request page if missing parameters', async () => {
        const response = await testSession.get('/account/password/confirmReset')
        expect(response.statusCode).toBe(200)
        expect(response.headers.location).toBe('/account/requestPasswordReset')
    })

    test('redirect old pw-reset routes', async () => {
        const response = await testSession.get('/account/password/reset')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/account/requestPasswordReset')
    })

    test('redirect old pw-reset-confirm routes', async () => {
        const response = await testSession.get('/account/confirmPasswordReset?username=banana&token=xxx')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/account/password/confirmReset?username=banana&token=xxx')
    })

    const protectedUrls = [
        '/account/linkGog',
        '/account/report',
        '/account/changePassword',
        '/account/changeEmail',
        '/account/changeUsername',
        '/account/resync',
        '/account/link',
        '/account/connect',
        '/account/create'
    ]

    test.each(protectedUrls)('%p responds with redirect to login', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(302)
    })
})
