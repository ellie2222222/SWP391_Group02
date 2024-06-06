const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requestSchema = new Schema( {
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'assigned','completed'],
        default: 'pending'
    },
    endedAt: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('Request', requestSchema)