require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require('./routes/user')

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

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen 
        app.listen(process.env.PORT, () => {
            console.log('Listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })