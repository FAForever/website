const fafApp = require('./fafApp')
const express = require('express')
const app = express()

fafApp.setup(app)
fafApp.loadRouters(app)
fafApp.setupCronJobs()

fafApp.startServer(app)
