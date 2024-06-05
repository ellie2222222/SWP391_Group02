const mongoose = require('mongoose')

const Schema = mongoose.Schema

const quoteSchema = new Schema( {
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Request', 
        required: true 
    },
    content: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    endedAt: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('Quote', quoteSchema)