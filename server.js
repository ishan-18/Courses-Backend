require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const xssClean = require('xss-clean')
const hpp = require('hpp')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const colors = require('colors')
const connectDB = require('./config/db')

connectDB()

const app = express();
app.use(express.json());
app.use(cookieParser())

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

//Sanitize data 
//{"gt": ""}
app.use(mongoSanitize())


//Set security headers
app.use(helmet())

//prevent cross-site scripting tags
//<script>alert(1)</script>
app.use(xssClean())


//Rate Limiting
const limitter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
})
app.use(limitter)


//Prevent HTTP Param Pollution
app.use(hpp())

//Enable CORS
app.use(cors())


//Routes
app.use('/api/v1/users', require('./routes/user.route'))
app.use('/api/v1/courses', require('./routes/course.route'))

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening @${PORT}`.cyan.bold);
})



process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`.red.inverse);
    server.close(() => process.exit(1))
})

