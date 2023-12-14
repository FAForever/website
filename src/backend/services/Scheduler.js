const { EventEmitter } = require('events')

module.exports = class Scheduler extends EventEmitter {
    constructor(eventName, action, ms) {
        super()
        this.eventName = eventName
        this.action = action
        this.handle = undefined
        this.interval = ms
        this.addListener(this.eventName, this.action)
    }

    start() {
        if (!this.handle) {
            this.handle = setInterval(
                () => this.emit(this.eventName),
                this.interval
            )
        }
    }
}
