const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requestSchema = new Schema( {
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    request_description: {
        type: String,
        required: true
    },
    request_status: {
        type: String,
        required: true,
        enum: ['pending', 'assigned','completed'],
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