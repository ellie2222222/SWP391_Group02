const mongoose = require('mongoose')

const Schema = mongoose.Schema

const warrantySchema = new Schema( {
    warranty_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty', 
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    jewelry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry', 
        required: true
    },
    warranty_content: {
        type: String,
        required: true,
    },
    warranty_end_date: {
        type: Date
    }
}, {timestamps: true})

module.exports = mongoose.model('Warranty', warrantySchema)