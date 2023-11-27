const JavaApiClientFactory = require('../lib/JavaApiClient')
const appConfig = require('../config/app')
const refresh = require('passport-oauth2-refresh')
const OidcStrategy = require('passport-openidconnect')
const nock = require('nock')
const { AuthFailed } = require('../lib/ApiErrors')

beforeEach(() => {
    refresh.use(appConfig.oauth.strategy, new OidcStrategy({
        issuer: 'me',
        tokenURL: 'http://auth-localhost/oauth2/token',
        authorizationURL: 'http://auth-localhost/oauth2/auth',
        clientID: 'test',
        clientSecret: 'test',
        scope: ['openid', 'offline']
    }, () => {}))
})

afterEach(() => {
    refresh._strategies = {}
    jest.restoreAllMocks()
})

test('multiple calls with stale token will trigger refresh only once', async () => {
    const client = JavaApiClientFactory('http://api-localhost', {
        token: '123',
        refreshToken: '456'
    })

    const refreshSpy = jest.spyOn(refresh, 'requestNewAccessToken')
    const apiScope = nock('http://api-localhost')
        .get('/example')
        .times(2)
        .reply(401, 'nope')
        .get('/example')
        .times(2)
        .reply(200, 'OK')

    const authScope = nock('http://auth-localhost')
        .post('/oauth2/token')
        .times(1)
        .reply(200, { access_token: 'new_tok', refresh_token: 'new_ref' })

    const response = client.get('/example').then((res) => {
        expect(res.request.headers.authorization).toBe('Bearer new_tok')
    })

    const response2 = client.get('/example').then((res) => {
        expect(res.request.headers.authorization).toBe('Bearer new_tok')
    })

    await Promise.all([response, response2])

    expect(refreshSpy).toBeCalledTimes(1)

    apiScope.done()
    authScope.done()
})

test('refresh will throw on error', async () => {
    const client = JavaApiClientFactory('http://api-localhost', {
        token: '123',
        refreshToken: '456'
    })

    const refreshSpy = jest.spyOn(refresh, 'requestNewAccessToken')
    const apiScope = nock('http://api-localhost')
        .get('/example')
        .reply(401, 'nope')

    const authScope = nock('http://auth-localhost')
        .post('/oauth2/token')
        .times(1)
        .reply(400, null)

    let thrown = false
    try {
        await client.get('/example')
    } catch (e) {
        expect(e).toBeInstanceOf(AuthFailed)
        thrown = true
    }

    expect(thrown).toBe(true)
    expect(refreshSpy).toBeCalledTimes(1)

    apiScope.done()
    authScope.done()
})

test('refresh will not loop to death', async () => {
    const client = JavaApiClientFactory('http://api-localhost', {
        token: '123',
        refreshToken: '456'
    })

    const apiScope = nock('http://api-localhost')
        .get('/example')
        .times(2)
        .reply(401, 'nope')

    const authScope = nock('http://auth-localhost')
        .post('/oauth2/token')
        .times(1)
        .reply(200, { access_token: 'new_tok', refresh_token: 'new_ref' })

    const response = await client.get('/example')

    expect(response.status).toBe(401)

    apiScope.done()
    authScope.done()
})
