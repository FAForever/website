const scheduleRepeating = (name, fn, intervalMs) => {
    let timer
    let stopped = false

    const run = async () => {
        const start = Date.now()
        try {
            await fn()
            console.debug(`[scheduler] ${name} ok in ${Date.now() - start}ms`)
        } catch (err) {
            console.error(
                `[scheduler] ${name} failed in ${Date.now() - start}ms`,
                err
            )
        } finally {
            if (!stopped) {
                timer = setTimeout(run, intervalMs)
            }
        }
    }

    run()

    return {
        stop() {
            stopped = true
            if (timer) clearTimeout(timer)
        },
    }
}

module.exports = { scheduleRepeating }
