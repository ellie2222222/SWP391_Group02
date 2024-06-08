require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');

const userRoutes = require('./routes/user')
const usersRoutes = require('./routes/users')
const jewelryRoutes = require('./routes/jewelry')
const requestRoutes = require('./routes/request')
const materialRoutes = require('./routes/material')
const gemstoneRoutes = require('./routes/gemstone')
const warrantyRoutes = require('./routes/warranty')
const blogRoutes = require('./routes/blog')
const worksOnRoutes = require('./routes/worksOn');
const designRoutes = require('./routes/design');
const invoiceRoutes = require('./routes/invoice')
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
app.use('/api/users', usersRoutes)
app.use('/api/jewelries', jewelryRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/materials', materialRoutes)
app.use('/api/gemstones', gemstoneRoutes)
app.use('/api/warranties', warrantyRoutes)
app.use('/api/blogs', blogRoutes) 
app.use('/api/worksOns', worksOnRoutes)
app.use('/api/designs', designRoutes)
app.use('/api/invoice', invoiceRoutes);

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