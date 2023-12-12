const {
    JavaApiClientFactory,
} = require('../src/backend/services/JavaApiClientFactory')
const appConfig = require('../src/backend/config/app')
const refresh = require('passport-oauth2-refresh')
const OidcStrategy = require('passport-openidconnect')
const nock = require('nock')
const { AuthFailed } = require('../src/backend/services/ApiErrors')
const { UserService } = require('../src/backend/services/UserService')

beforeEach(() => {
    refresh.use(
        appConfig.oauth.strategy,
        new OidcStrategy(
            {
                issuer: 'me',
                tokenURL: 'http://auth-localhost/oauth2/token',
                authorizationURL: 'http://auth-localhost/oauth2/auth',
                clientID: 'test',
                clientSecret: 'test',
                scope: ['openid', 'offline'],
            },
            () => {}
        )
    )
})

afterEach(() => {
    refresh._strategies = {}
    jest.restoreAllMocks()
})
test('empty passport', () => {
    expect(() =>
        JavaApiClientFactory.createInstance(
            new UserService(),
            'http://api-localhost'
        )
    ).toThrowError('oAuthPassport not an object')
})

test('empty token', () => {
    expect(() =>
        JavaApiClientFactory.createInstance(
            new UserService(),
            'http://api-localhost',
            { refreshToken: '123' }
        )
    ).toThrowError('oAuthPassport.token not a string')
})

test('empty refresh-token', () => {
    expect(() =>
        JavaApiClientFactory.createInstance(
            new UserService(),
            'http://api-localhost',
            { token: '123' }
        )
    ).toThrowError('oAuthPassport.refreshToken not a string')
})

test('multiple calls with stale token will trigger refresh only once', async () => {
    const userService = new UserService()
    userService.setUserFromRequest({
        user: {},
        session: { passport: { user: {} } },
    })
    const client = JavaApiClientFactory.createInstance(
        userService,
        'http://api-localhost',
        {
            token: '123',
            refreshToken: '456',
        },
        appConfig.oauth.strategy
    )

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
    const userService = new UserService()
    userService.setUserFromRequest({
        user: {},
        session: { passport: { user: {} } },
    })
    const client = JavaApiClientFactory.createInstance(
        userService,
        'http://api-localhost',
        {
            token: '123',
            refreshToken: '456',
        },
        appConfig.oauth.strategy
    )

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
    const userService = new UserService()
    userService.setUserFromRequest({
        user: {},
        session: { passport: { user: {} } },
    })
    const client = JavaApiClientFactory.createInstance(
        userService,
        'http://api-localhost',
        {
            token: '123',
            refreshToken: '456',
        },
        appConfig.oauth.strategy
    )

    const apiScope = nock('http://api-localhost')
        .get('/example')
        .times(2)
        .reply(401, 'nope')

    const authScope = nock('http://auth-localhost')
        .post('/oauth2/token')
        .times(1)
        .reply(200, { access_token: 'new_tok', refresh_token: 'new_ref' })

    try {
        await client.get('/example')
    } catch (e) {
        expect(e).toBeInstanceOf(AuthFailed)
    }

    apiScope.done()
    authScope.done()
})
