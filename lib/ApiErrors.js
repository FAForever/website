class JavaApiError extends Error
{
    constructor(status, url, errors) {
        super('Failed request "' + url + '" with status "' + status + '"')

        this.status = status
        this.url = url
        this.errors = errors
    }

}

class GenericJavaApiError extends Error
{
}

module.exports.JavaApiError = JavaApiError
module.exports.GenericJavaApiError = GenericJavaApiError
