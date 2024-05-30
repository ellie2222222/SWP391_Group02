const mongoose = require('mongoose')

const Schema = mongoose.Schema

const materialSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    carat: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Material', materialSchema)