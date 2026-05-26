const axios = require('axios')

exports = module.exports = function (req, res) {
    const name = req.query.username

    axios
        .get(
            process.env.API_URL +
                '/data/player?filter=login==' +
                encodeURI(name),
            { transformResponse: [(r) => r], validateStatus: () => true }
        )
        .then((response) => {
            try {
                const userNameFree = JSON.parse(response.data).data.length === 0
                return res.status(userNameFree ? 200 : 400).send(userNameFree)
            } catch (e) {
                return res.status(500).send(e)
            }
        })
        .catch((error) => {
            console.error(error)
            return res.status(500).send(error)
        })
}
