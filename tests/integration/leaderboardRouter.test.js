const supertestSession = require('supertest-session')
const passportMock = require('../helpers/PassportMock')
const { AppKernel } = require('../../src/backend/AppKernel')

let testSession = null
beforeEach(async () => {
    const kernel = new AppKernel()
    await kernel.boot()
    passportMock(kernel.expressApp, { passAuthentication: true })
    kernel.loadControllers()
    testSession = supertestSession(kernel.expressApp)
})

describe('Leaderboard Routes', function () {
    test('no authentication required for main page', async () => {
        let response = await testSession.get('/leaderboards')
        expect(response.status).toBe(200)

        await testSession.get('/mock-login')

        response = await testSession.get('/leaderboards')
        expect(response.status).toBe(200)
    })

    test('no authentication required for datasets', async () => {
        const response = await testSession.get('/leaderboards/1v1.json')
        expect(response.status).toBe(200)
    })

    test('fails with 404 on unknown leaderboard', async () => {
        await testSession.get('/mock-login')
        const response = await testSession.get('/leaderboards/this-is-not-valid.json')
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Leaderboard "this-is-not-valid" does not exist' })
    })

    const arr = [
        '/leaderboards/1v1.json',
        '/leaderboards/2v2.json',
        '/leaderboards/4v4.json',
        '/leaderboards/global.json'
    ]

    test.each(arr)('responds with OK to %p', async (route) => {
        await testSession.get('/mock-login')

        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    })
})
