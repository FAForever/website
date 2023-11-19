const appConfig = require("../config/app")

module.exports = () => {
    try {
        require(`./extractor`).run()
    } catch (e) {
        console.error(`Error running extractor script. Make sure the API is available (will try again after interval).`, e)
    }
    setInterval(() => {
        try {
            require(`./extractor`).run()
        } catch (e) {
            console.error(`extractor caused the error`, e)
        }
    }, appConfig.extractorInterval * 60 * 1000)
}
