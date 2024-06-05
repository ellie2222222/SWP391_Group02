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
        type: Number,
        required: true
    },
    cut: {
        enum: ['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'],
        type: String,
        required: true
    },
    clarity: {
        enum:  ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
        type: String,
        required: true
    },
    color: {
        enum: ['Colorless', 'Near Colorless', 'Faint Yellow', 'Very Light Yellow', 'Light Yellow'],
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Gemstone', gemstoneSchema)