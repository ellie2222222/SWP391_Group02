const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requestSchema = new Schema( {
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jewelry_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Jewelry',
    },
    request_description: {
        type: String,
        required: true
    },
    request_status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'completed', 'quote', 'design', 'production', 'payment', 'cancelled'],
        default: 'pending'
    },
    quote_content: {
        type: String
    },
    quote_amount: {
        type: Number
    },
    quote_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected']
    },
    design_status: {
        type: String,
        enum: ['ongoing', 'completed']
    },
    production_start_date: {
        type: Date
    },
    production_end_date: {
        type: Date
    },
    production_cost: {
        type: Number
    },
    production_status: {
        type: String,
        enum: ['ongoing', 'completed']
    },
    total_amount: {
        type: Number
    },
    endedAt: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('Request', requestSchema)