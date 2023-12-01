const { LeaderboardService } = require('../src/backend/services/LeaderboardService')
const { LeaderboardRepository } = require('../src/backend/services/LeaderboardRepository')
const NodeCache = require('node-cache')
const { Axios } = require('axios')

jest.mock('axios')

let leaderboardService = null
const axios = new Axios()
const fakeEntry = JSON.stringify({
    data: [
        {
            attributes: {
                rating: -1000,
                totalGames: 100,
                wonGames: 30,
                updateTime: '2023-12-1'
            }
        }
    ],
    included: [
        {
            attributes: {
                login: 'player1'
            }
        }
    ]
})

beforeEach(() => {
    jest.restoreAllMocks()
    jest.useFakeTimers()
    leaderboardService = new LeaderboardService(
        new NodeCache(
            { stdTTL: 300, checkperiod: 600 }
        ),
        new LeaderboardRepository(axios)
    )
})
afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    axios.get.mockReset()
})
test('non 200 will throw', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 403 }))
    await expect(leaderboardService.getLeaderboard(0)).rejects.toThrowError('LeaderboardRepository::fetchLeaderboard failed with response status "403"')
})

test('malformed empty response', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: null }))
    await expect(leaderboardService.getLeaderboard(0)).rejects.toThrowError('LeaderboardRepository::mapResponse malformed response, not an object')
})

test('malformed response data missing', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: JSON.stringify({ included: [] }) }))
    await expect(leaderboardService.getLeaderboard(0)).rejects.toThrowError('LeaderboardRepository::mapResponse malformed response, expected "data"')
})

test('malformed response included missing', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: JSON.stringify({ data: [{}] }) }))
    await expect(leaderboardService.getLeaderboard(0)).rejects.toThrowError('LeaderboardRepository::mapResponse malformed response, expected "included"')
})

test('empty response will log and not throw an error', async () => {
    const warn = jest.spyOn(console, 'log').mockImplementationOnce(() => {})
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: JSON.stringify({ data: [] }) }))
    await leaderboardService.getLeaderboard(0)

    expect(warn).toBeCalledWith('[info] leaderboard empty')
})

test('response is mapped correctly', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: fakeEntry }))
    const result = await leaderboardService.getLeaderboard(0)

    expect(result).toHaveLength(1)
    expect(result[0].rating).toBe(-1000)
    expect(result[0].totalgames).toBe(100)
    expect(result[0].wonGames).toBe(30)
    expect(result[0].date).toBe('2023-12-1')
    expect(result[0].label).toBe('player1')
})

test('only numbers valid', async () => {
    expect.assertions(1)

    try {
        await leaderboardService.getLeaderboard()
    } catch (e) {
        expect(e.toString()).toBe('Error: LeaderboardService:getLeaderboard id must be a number')
    }
})

test('timeout for cache creation throws an error', async () => {
    expect.assertions(1)
    axios.get.mockImplementationOnce(() => Promise.resolve({ status: 200, data: fakeEntry }))

    leaderboardService.mutexService.locked = true
    leaderboardService.getLeaderboard(0).then(() => {}).catch((e) => {
        expect(e.toString()).toBe('Error: MutexService timeout reached')
    })

    jest.runOnlyPendingTimers()
})

test('full scenario', async () => {
    const cacheSetSpy = jest.spyOn(leaderboardService.cacheService, 'set')
    const mock = axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: fakeEntry }))

    // starting two promises simultaneously
    const creatingTheCache = leaderboardService.getLeaderboard(0)
    const waitingForCache = leaderboardService.getLeaderboard(0)

    await Promise.all([creatingTheCache, waitingForCache])

    // start another one, that will get the cache directly
    await leaderboardService.getLeaderboard(0)

    expect(mock.mock.calls.length).toBe(1)
    expect(cacheSetSpy).toHaveBeenCalledTimes(1)

    const date = new Date()
    date.setSeconds(date.getSeconds() + (60 * 60) + 1)
    jest.setSystemTime(date)

    // start another with when the cache is stale
    await leaderboardService.getLeaderboard(0)
    expect(cacheSetSpy).toHaveBeenCalledTimes(2)
    expect(mock.mock.calls.length).toBe(2)
    jest.setSystemTime(new Date())

    cacheSetSpy.mockReset()
})
