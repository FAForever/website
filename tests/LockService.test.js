const {LockoutTimeoutError, LockService} = require('../lib/LockService')
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
test('release will unlock the queue', async () => {
    const lockService = new LockService()
    expect(lockService.locked).toBe(false)
    
    await lockService.lock(() => {
        expect(lockService.locked).toBe(true)
    })

    expect(lockService.locked).toBe(false)
})

test('call lock twice will fill the queue', async () => {
    let oneCalled = false
    let twoCalled = false
    const lockService = new LockService()
    const one = lockService.lock(() => oneCalled = true)
    const two = lockService.lock(() =>  twoCalled = true)

    expect(lockService.queue).toHaveLength(1)
    expect(lockService.locked).toBe(true)
    
    await one
    await two
    expect(oneCalled).toBe(true)
    expect(twoCalled).toBe(true)
    expect(lockService.queue).toHaveLength(0)
    expect(lockService.locked).toBe(false)
})

test('lock timeout will trow an error if locked by another "process" for too long', async () => {
    expect.assertions(1);
    
    const lockService = new LockService()
    
    await lockService.lock(async () => {
        try {
            await lockService.lock(() => {}, 1)
        } catch (e) {
            expect(e).toBeInstanceOf(LockoutTimeoutError)
        }
    })
});

test('lock timeout will remove it from queue', async () => {
    expect.assertions(2);

    const lockService = new LockService()

    await lockService.lock(async () => {
        try {
            await lockService.lock(() => {
            }, 1)
        } catch (e) {
            expect(e).toBeInstanceOf(LockoutTimeoutError)
            expect(lockService.queue).toHaveLength(0);
        }

    })
})

