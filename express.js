const fafApp = require('./fafApp')
const express = require('./ExpressApp')
const app = express()

fafApp.setup(app)
fafApp.loadRouters(app)
fafApp.setupCronJobs()

fafApp.startServer(app)
