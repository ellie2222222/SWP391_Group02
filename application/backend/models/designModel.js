const mongoose = require('mongoose')

const Schema = mongoose.Schema

const designSchema = new Schema( {
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
    images: [{
        type: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Design', designSchema)