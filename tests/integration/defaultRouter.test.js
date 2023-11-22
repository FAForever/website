const express = require('express')
const supertestSession = require("supertest-session")
const fafApp = require('../../fafApp')

let testSession = null
beforeEach(() => {
    const app = new express()
    fafApp.setup(app)
    fafApp.loadRouters(app)
    testSession = supertestSession(app)
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
        '/play'
    ]

    test.each(arr)("responds with OK to %p", (async (route) => {
        const res = await testSession.get(route)
        expect(res.statusCode).toBe(200)
    }))
})
