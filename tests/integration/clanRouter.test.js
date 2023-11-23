const express = require('express')
const supertestSession = require("supertest-session");
const fafApp = require('../../fafApp')
const passportMock = require("../helpers/PassportMock");

let testSession = null
beforeEach(async () => {
    const app = new express()
    fafApp.setup(app)
    passportMock(app, {passAuthentication: true})
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
})

describe('Clan Routes', function () {

    test('clan list is protected', async () => {
        let response = await testSession.get('/clans')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/login')

        await testSession.get('/mock-login')

        response = await testSession.get('/clans')
        expect(response.statusCode).toBe(200)
        expect(response.text).toContain('Clans');
    })

    test('clan list can be accessed with user', async () => {
        const response = await testSession.get('/clans')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/login')
    })

    test('clan view is protected', async () => {
        let response = await testSession.get('/clans/view/1')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/login')

        await testSession.get('/mock-login')

        response = await testSession.get('/clans/view/148')
        expect(response.statusCode).toBe(200)
        expect(response.text).toContain('STS-Clan');
    })

    test('clan view redirects on shitty id', async () => {
        await testSession.get('/mock-login')
        let response = await testSession.get('/clans/view/not-a-number')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/clans')
    })

    test('game-client clan view link is redirected', async () => {
        const response = await testSession.get('/clan/1')
        expect(response.statusCode).toBe(302)
        expect(response.headers.location).toBe('/clans/view/1')
    })
    
    test("responds with 503 to other clan routes", async () => {
        const res = await testSession.get('/clans/everything-else')
        expect(res.statusCode).toBe(503)
        expect(res.text).toContain('Sorry commanders, we failed to build enough pgens and are now in a tech upgrade');
    })
})
