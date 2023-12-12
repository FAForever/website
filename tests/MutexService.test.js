const {
    AcquireTimeoutError,
    MutexService,
} = require('../src/backend/services/MutexService')
test('release will unlock the queue', async () => {
    const mutexService = new MutexService()
    expect(mutexService.locked).toBe(false)

    await mutexService.acquire(() => {
        expect(mutexService.locked).toBe(true)
    })

    expect(mutexService.locked).toBe(false)
})

test('call lock twice will fill the queue', async () => {
    let oneCalled = false
    let twoCalled = false
    const mutexService = new MutexService()
    const one = mutexService.acquire(() => {
        oneCalled = true
    })
    const two = mutexService.acquire(() => {
        twoCalled = true
    })

    expect(mutexService.queue).toHaveLength(1)
    expect(mutexService.locked).toBe(true)

    await one
    await two
    expect(oneCalled).toBe(true)
    expect(twoCalled).toBe(true)
    expect(mutexService.queue).toHaveLength(0)
    expect(mutexService.locked).toBe(false)
})

test('lock timeout will trow an error if locked by another "process" for too long', async () => {
    expect.assertions(1)

    const mutexService = new MutexService()

    await mutexService.acquire(async () => {
        try {
            await mutexService.acquire(() => {}, 1)
        } catch (e) {
            expect(e).toBeInstanceOf(AcquireTimeoutError)
        }
    })
})

test('lock timeout will remove it from queue', async () => {
    expect.assertions(2)

    const mutexService = new MutexService()

    await mutexService.acquire(async () => {
        try {
            await mutexService.acquire(() => {}, 1)
        } catch (e) {
            expect(e).toBeInstanceOf(AcquireTimeoutError)
            expect(mutexService.queue).toHaveLength(0)
        }
    })
})
