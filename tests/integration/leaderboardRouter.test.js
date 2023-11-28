const Express = require('express')
const supertestSession = require('supertest-session')
const fafApp = require('../../fafApp')
const passportMock = require('../helpers/PassportMock')

let testSession = null
beforeEach(() => {
    const app = new Express()
    fafApp.setup(app)
    passportMock(app, { passAuthentication: true })
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
})

describe('Leaderboard Routes', function () {
    test('authentication required for main page', async () => {
        let response = await testSession.get('/leaderboards')
        expect(response.status).toBe(302)

        await testSession.get('/mock-login')

        response = await testSession.get('/leaderboards')
        expect(response.status).toBe(200)
    })

    test('authentication required for datasets', async () => {
        const response = await testSession.get('/leaderboards/1v1.json')
        expect(response.status).toBe(401)
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
