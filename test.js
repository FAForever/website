const express = require('express')
const app = express()
const router = express.Router()

router.get('/*splat', (req, res) => res.send('ok'))

app.use('/', router)

app.listen(3000, () => console.log('Server running on 3000'))
