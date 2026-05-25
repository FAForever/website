const PAGE_SIZE = 100
const MAX_PAGES = 200

const appendPageParams = (path, pageNumber, pageSize) => {
    const separator = path.includes('?') ? '&' : '?'
    return `${path}${separator}page[number]=${pageNumber}&page[size]=${pageSize}`
}

class JavaApiPaginator {
    static async fetchAll(client, path, context = 'JavaApiPaginator') {
        const allData = []
        const includedByKey = new Map()

        for (let pageNumber = 1; pageNumber <= MAX_PAGES; pageNumber++) {
            const url = appendPageParams(path, pageNumber, PAGE_SIZE)
            const response = await client.get(url)

            if (response.status !== 200) {
                throw new Error(
                    `${context}::fetchAll failed with response status "${response.status}"`
                )
            }

            const body = JSON.parse(response.data)

            if (typeof body !== 'object' || body === null) {
                throw new Error(
                    `${context}::fetchAll malformed response, not an object`
                )
            }

            if (!Object.prototype.hasOwnProperty.call(body, 'data')) {
                throw new Error(
                    `${context}::fetchAll malformed response, expected "data"`
                )
            }

            const pageData = Array.isArray(body.data) ? body.data : []
            allData.push(...pageData)

            if (Array.isArray(body.included)) {
                for (const item of body.included) {
                    if (!item || typeof item !== 'object') continue
                    const key = `${item.type}:${item.id}`
                    if (!includedByKey.has(key)) {
                        includedByKey.set(key, item)
                    }
                }
            }

            if (pageData.length < PAGE_SIZE) {
                return { data: allData, included: [...includedByKey.values()] }
            }
        }

        throw new Error(
            `${context}::fetchAll exceeded maximum page count of ${MAX_PAGES}`
        )
    }
}

module.exports.JavaApiPaginator = JavaApiPaginator
module.exports.PAGE_SIZE = PAGE_SIZE
module.exports.MAX_PAGES = MAX_PAGES
