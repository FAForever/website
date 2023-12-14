class JavaApiError extends Error {
    constructor(status, url, error) {
        super('Failed request "' + url + '" with status "' + status + '"')

        this.status = status
        this.url = url
        this.error = error
    }
}
module.exports.JavaApiError = JavaApiError
module.exports.GenericJavaApiError = class GenericJavaApiError extends Error {}
module.exports.AuthFailed = class AuthFailed extends Error {}
