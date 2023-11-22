const express = require('express')
const middlewares = require('../../routes/middleware')
const supertestSession = require('supertest-session');
const fafApp = require("../../fafApp");

let testApp = null
let testSession = null

beforeEach(() => {
    const app = new express()
    fafApp.setup(app)
    testSession = supertestSession(app)
    testApp = app
})

describe('Authenticate Middleware', function () {

    test('route is protected and redirects to "/login"', async () => {
        testApp.get('/', middlewares.isAuthenticated(), () => {
            fail('did not protect')
        })

        const res = await testSession.get('/')
        
        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe('/login')
    })
    
    test('default url after login', async () => {
        testApp.get('/', middlewares.isAuthenticated(), () => {
            fail('did not protect')
        })

        testApp.get('/redirect-me', (req, res) => {
            res.redirect(req.session.returnTo)
        })

        await testSession.get('/')
        const res = await testSession.get('/redirect-me')
        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe('/')
    })

    test('custom url after login', async () => {
        testApp.get('/', middlewares.isAuthenticated('/go-here'), () => {
            fail('did not protect')
        })

        testApp.get('/redirect-me', (req, res) => {
            res.redirect(req.session.returnTo)
        })
        
        await testSession.get('/')
        const res = await testSession.get('/redirect-me')
        expect(res.status).toBe(302)
        expect(res.headers['location']).toBe('/go-here')
    })

    test('api url flag return 401', async () => {
        testApp.get('/', middlewares.isAuthenticated(null, true), () => {
            fail('did not protect')
        })

        const res = await testSession.get('/')
        expect(res.status).toBe(401)
        expect(res.body).toEqual({error: 'Unauthorized'})
    })

    test('identifies xhr request', async () => {
        testApp.get('/', middlewares.isAuthenticated(), () => {
            fail('did not protect')
        })

        const res = await testSession.get('/').set('X-Requested-With', 'XMLHttpRequest')
        expect(res.status).toBe(401)
        expect(res.body).toEqual({error: 'Unauthorized'})
    })

    test('identifies json accept request', async () => {
        testApp.get('/', middlewares.isAuthenticated(), () => {
            fail('did not protect')
        })

        const res = await testSession.get('/').set('Accept', 'application/json')
        expect(res.status).toBe(401)
        expect(res.body).toEqual({error: 'Unauthorized'})
    })
})
