const mongoose = require('mongoose')

const Schema = mongoose.Schema

const requestSchema = new Schema( {
    user_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['ongoing', 'completed'],
        default: 'ongoing'
    },
    endedAt: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('Request', requestSchema)