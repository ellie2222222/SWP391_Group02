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
    gemstone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gemstone', 
    },
    gemstone_weight: {
        type: Number
    },
    material_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material', 
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
    },
    images: [{
        type: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Jewelry', jewelrySchema)