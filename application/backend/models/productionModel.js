const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productionSchema = new Schema( {
    jewelry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry', 
        required: true
    },
    production_cost: {
        type: Number,
        required: true
    },
    production_type: {
        type: String,
        enum: ['design', 'production'],
        required: true
    },
    production_start_date: {
        type: Date,
        required: true
    },
    production_end_date: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['ongoing', 'completed'],
        default: 'ongoing'
    },
}, {timestamps: true})

module.exports = mongoose.model('Production', productionSchema)