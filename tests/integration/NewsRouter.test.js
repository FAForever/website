const Express = require('express')
const supertestSession = require('supertest-session')
const fafApp = require('../../fafApp')

let testSession = null
beforeEach(() => {
    const app = new Express()
    fafApp.setup(app)
    fafApp.loadRouters(app)

    testSession = supertestSession(app)
})

describe('News Routes', function () {
    test('responds to /', async () => {
        const res = await testSession.get('/news')
        expect(res.header['content-type']).toBe('text/html; charset=utf-8')
        expect(res.statusCode).toBe(200)
        expect(res.text).toContain('Welcome to the patchnotes for the 3750 patch.')
        expect(res.text).toContain('New FAF Website')
        expect(res.text).toContain('Game version 3738')
        expect(res.text).toContain('Weapon Target Checking Intervals')
    })

    test('responds to /:slug', async () => {
        const res = await testSession.get('/news/balance-patch-3750-is-live')
        expect(res.header['content-type']).toBe('text/html; charset=utf-8')
        expect(res.statusCode).toBe(200)
        expect(res.text).toContain('Welcome to the patchnotes for the 3750 patch.')
    })

    test('responds to /:slug with redirect if called with old slug', async () => {
        const res = await testSession.get('/news/Balance-Patch-3750-Is-Live')
        expect(res.statusCode).toBe(301)
        expect(res.header.location).toBe('balance-patch-3750-is-live')
    })
})
