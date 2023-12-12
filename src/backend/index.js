const { AppKernel } = require('./AppKernel')

const kernel = new AppKernel()
kernel.boot().then((bootedKernel) => {
    bootedKernel.startCronJobs()
    bootedKernel.loadControllers()
    bootedKernel.expressApp.listen(bootedKernel.config.expressPort, () => {
        console.log(
            `Express listening on port ${bootedKernel.config.expressPort}`
        )
    })
})
