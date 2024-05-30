const mongoose = require('mongoose')

const Schema = mongoose.Schema

const quoteSchema = new Schema( {
    user_id: {
        type: String
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