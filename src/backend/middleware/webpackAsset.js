module.exports.webpackAsset = (webpackManifestJS) => {
    return (req, res, next) => {
        res.locals.webpackAssetJS = (asset) => {
            if (asset in webpackManifestJS) {
                return webpackManifestJS[asset]
            }

            throw new Error('[error] middleware::webpackAsset Failed to find asset "' + asset + '"')
        }
        next()
    }
}
