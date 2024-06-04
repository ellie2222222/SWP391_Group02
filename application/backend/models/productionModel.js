const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productionSchema = new Schema( {
    labor_cost: {
        type: Number,
        required: true,
        default: 0
    },
    cost_type: {
        type: String,
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