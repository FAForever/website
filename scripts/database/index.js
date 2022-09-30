require('dotenv').config();
const mongoose = require('mongoose');

mongoose
    .connect(process.env.MONGO)
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err));
