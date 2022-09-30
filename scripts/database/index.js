const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://Javi:4321@cluster0.j52qwuz.mongodb.net/test')
    .then(() => console.log('connected to db'))
    .catch((err)=>console.log(err))
