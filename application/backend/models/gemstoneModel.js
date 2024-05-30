const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gemstoneSchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    carat: {
        type: String,
        required: true
    },
    cut: {
        type: String,
        required: true
    },
    clarity: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Gemstone', gemstoneSchema)