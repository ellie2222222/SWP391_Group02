const mongoose = require('mongoose')

const Schema = mongoose.Schema

const designSchema = new Schema( {
    design_name: {
        type: String,
        required: true
    },
    jewelry_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jewelry',
        required: true
    }],
    images: [{
        type: String
    }]
}, {timestamps: true})

module.exports = mongoose.model('Design', designSchema)