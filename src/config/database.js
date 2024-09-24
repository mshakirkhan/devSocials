const mongoose = require("mongoose");
require('dotenv').config()

const DBConnect = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

DBConnect().then(() => {
    console.log('Database connected successfully!')
}).catch((err) => {
    console.log('Database is not connected')
})