class LockoutTimeoutError extends Error {
}

class LockService {
    constructor() {
        this.queue = [];
        this.locked = false;
    }

    async lock(callback, timeLimitMS = 500) {
        let timeoutHandle;
        const lockHandler = {}

        const timeoutPromise = new Promise((resolve, reject) => {
            lockHandler.resolve = resolve
            lockHandler.reject = reject

            timeoutHandle = setTimeout(
                () => reject(new LockoutTimeoutError('LockService timeout reached')),
                timeLimitMS
            );
        });

        const asyncPromise = new Promise((resolve, reject) => {
            if (this.locked) {
                lockHandler.resolve = resolve
                lockHandler.reject = reject

                this.queue.push(lockHandler);
            } else {
                this.locked = true;
                resolve();
            }
        });

        await Promise.race([asyncPromise, timeoutPromise]).then(async () => {
            clearTimeout(timeoutHandle);
            try {
                if (callback[Symbol.toStringTag] === 'AsyncFunction') {
                    await callback()
                    return
                }

                callback()
            } finally {
                this.release()
            }
        }).catch(e => {
            let index = this.queue.indexOf(lockHandler);

            if (index !== -1) {
                this.queue.splice(index, 1);
            }

            throw e
        })
    }

    release() {
        if (this.queue.length > 0) {
            const queueItem = this.queue.shift();
            queueItem.resolve();
        } else {
            this.locked = false;
        }
    }
}

module.exports.LockService = LockService
module.exports.LockoutTimeoutError = LockoutTimeoutError
