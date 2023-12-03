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
    test('get all clans', async () => {
        const response = await testSession.get('/clans')
        expect(response.status).toBe(200)
    })

    test('redirects faf-client', async () => {
        const response = await testSession.get('/clan/2741')
        expect(response.status).toBe(302)
        expect(response.headers.location).toBe('/clans/view/2741')
    })

    test('get clan', async () => {
        const response = await testSession.get('/clans/view/2741')
        expect(response.status).toBe(200)
        expect(response.text).toContain('The Melters')
    })

    test('get clans json', async () => {
        const response = await testSession.get('/data/clans.json')
        expect(response.status).toBe(200)
        expect(response.text).toContain('The Melters')
        expect(response.text).toContain('antz')
    })

    const arr = ['/clans/everything']

    test.each(arr)('responds with 503 to %p', async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(503)
        expect(res.text).toContain('Sorry commanders, we failed to build enough pgens and are now in a tech upgrade')
    })
})
