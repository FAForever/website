const {
    JavaApiPaginator,
    PAGE_SIZE,
    MAX_PAGES,
} = require('../src/backend/services/JavaApiPaginator')

const makeClient = (responses) => {
    const calls = []
    const get = jest.fn(async (url) => {
        calls.push(url)
        const next = responses.shift()
        if (!next) throw new Error('Unexpected extra call: ' + url)
        return next
    })
    return { get, calls }
}

const makePage = (count, startId, includedSpecs = []) => ({
    status: 200,
    data: JSON.stringify({
        data: Array.from({ length: count }, (_, i) => ({
            id: String(startId + i),
            type: 'thing',
            attributes: { n: startId + i },
        })),
        included: includedSpecs,
    }),
})

test('single page (less than PAGE_SIZE) makes one request', async () => {
    const client = makeClient([
        makePage(3, 1, [{ type: 'player', id: '1', attributes: {} }]),
    ])
    const result = await JavaApiPaginator.fetchAll(client, '/data/thing')

    expect(client.get).toHaveBeenCalledTimes(1)
    expect(client.calls[0]).toBe(
        `/data/thing?page[number]=1&page[size]=${PAGE_SIZE}`
    )
    expect(result.data).toHaveLength(3)
    expect(result.included).toHaveLength(1)
})

test('preserves existing query string with & separator', async () => {
    const client = makeClient([makePage(1, 1)])
    await JavaApiPaginator.fetchAll(client, '/data/thing?include=player')

    expect(client.calls[0]).toBe(
        `/data/thing?include=player&page[number]=1&page[size]=${PAGE_SIZE}`
    )
})

test('paginates until short page returned, concatenates and dedupes included', async () => {
    const includedA = { type: 'player', id: '1', attributes: { login: 'a' } }
    const includedB = { type: 'player', id: '2', attributes: { login: 'b' } }
    const client = makeClient([
        makePage(PAGE_SIZE, 1, [includedA, includedB]),
        makePage(PAGE_SIZE, PAGE_SIZE + 1, [includedA]),
        makePage(5, 2 * PAGE_SIZE + 1, [includedB]),
    ])
    const result = await JavaApiPaginator.fetchAll(client, '/data/thing')

    expect(client.get).toHaveBeenCalledTimes(3)
    expect(result.data).toHaveLength(PAGE_SIZE * 2 + 5)
    expect(result.included).toHaveLength(2)
    expect(client.calls[1]).toContain('page[number]=2')
    expect(client.calls[2]).toContain('page[number]=3')
})

test('non-200 response throws', async () => {
    const client = makeClient([{ status: 500, data: '' }])
    await expect(
        JavaApiPaginator.fetchAll(client, '/data/thing', 'CtxName')
    ).rejects.toThrow('CtxName::fetchAll failed with response status "500"')
})

test('null body throws', async () => {
    const client = makeClient([{ status: 200, data: 'null' }])
    await expect(
        JavaApiPaginator.fetchAll(client, '/data/thing')
    ).rejects.toThrow('malformed response, not an object')
})

test('missing data property throws', async () => {
    const client = makeClient([
        { status: 200, data: JSON.stringify({ included: [] }) },
    ])
    await expect(
        JavaApiPaginator.fetchAll(client, '/data/thing')
    ).rejects.toThrow('malformed response, expected "data"')
})

test('exceeding MAX_PAGES throws', async () => {
    const responses = Array.from({ length: MAX_PAGES }, (_, i) =>
        makePage(PAGE_SIZE, i * PAGE_SIZE + 1)
    )
    const client = makeClient(responses)
    await expect(
        JavaApiPaginator.fetchAll(client, '/data/thing')
    ).rejects.toThrow('exceeded maximum page count')
})
