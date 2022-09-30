const mongoose = require('mongoose')

mongoose
    .connect('mongo')
    .then(() => console.log('connected to db'))
    .catch((err)=>console.log(err))
