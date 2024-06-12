const mongoose = require('mongoose')

const Schema = mongoose.Schema

const jewelrySchema = new Schema( {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    gemstone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gemstone',
       
        default: null
    },
    gemstone_weight: {
        type: Number,
        
        default: null
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
    category: {
        type: String,
        enum: ["Ring", "Necklace", "Bracelet", "Earring", "Other"],
        required: true
    },
    type: {
        type: String,
        enum: ["Sample", "Custom"],
        required: true
    },
    on_sale: {
        type: Boolean,
        required: true,
        default: false
    },
    sale_percentage: {
        type: Number,
        required: true,
        default: 0
    },
    //fix
    images: [{
        type: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Jewelry', jewelrySchema)