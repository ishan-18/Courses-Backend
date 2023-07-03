const mongoose = require('mongoose')

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI);

    mongoose.connection.on('connected', () => {
        console.log(`Database Connected`.green.bold);
    })

    mongoose.connection.on('error', (e) => {
        console.error(`Error: ${e.message}`.red.inverse);
    })
}

module.exports = connectDB