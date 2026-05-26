module.exports.webpackAsset = (webpackManifest) => {
    const lookup = (key) => {
        if (key in webpackManifest) {
            return webpackManifest[key]
        }

        throw new Error(
            '[error] middleware::webpackAsset Failed to find asset "' +
                key +
                '"'
        )
    }

    return (req, res, next) => {
        res.locals.webpackAssetJS = (entry) => lookup(`${entry}.js`)
        res.locals.webpackAssetCSS = (entry) => lookup(`${entry}.css`)
        next()
    }
}
