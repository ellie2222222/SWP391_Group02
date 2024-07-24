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
        type: String,
        enum: ['Round', 'Princess', 'Emerald', 'Asscher', 'Marquise', 'Oval', 'Radiant', 'Pear', 'Heart', 'Cushion', 'Other'],
        required: true
    },
    clarity: {
        type: String,
        enum:  ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3', 'Other'],
        required: true
    },
    color: {
        type: String,
        enum: [
            'Colorless', 'Near Colorless', 'Faint Yellow', 'Very Light Yellow', 'Light Yellow',
            'Red', 'Orange', 'Green', 'Blue', 'Yellow', 'Purple', 'Pink', 'Brown', 'Black', 'White'
        ],
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Gemstone', gemstoneSchema)