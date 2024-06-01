require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require('./routes/user')
const jewelryRoutes = require('./routes/jewelry')
const requestRoutes = require('./routes/request')
const quoteRoutes = require('./routes/quote')

//application
const app = express()

//middleware
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//router
app.use('/api/user', userRoutes)
app.use('/api/jewelry', jewelryRoutes)
app.use('/api/request', requestRoutes)
app.use('/api/quote', quoteRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen 
        app.listen(process.env.PORT, () => {
            console.log('Connected to database! Listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })