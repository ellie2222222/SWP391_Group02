const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jewelrySchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    gemstone: {
        type: String
    },
    gemstone_weight: {
        type: Number
    },
    material: {
        type: String,
        required: true
    },
    material_weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    model_type: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Jewelry', jewelrySchema)