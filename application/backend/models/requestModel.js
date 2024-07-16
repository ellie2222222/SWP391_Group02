const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jewelry_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Jewelry'
    },
    request_description: {
        type: String,
        required: true
    },
    request_status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'completed', 'quote', 'deposit', 'design', 'production', 'warranty', 'payment', 'cancelled', 'rejected_quote'],
        default: 'pending'
    },
    quote_content: {
        type: String
    },
    quote_amount: {
        type: Number
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
    endedAt: {
        type: Date
    },
    design_images: [{
        type: String
    }],
    warranty_content: {
        type: String
    },
    warranty_start_date: {
        type: Date
    },
    warranty_end_date: {
        type: Date
    },
    images_public_ids: [{
        type: String
    }],
    deposit_paid: {
        type: Boolean,
        default: false
    },
    final_paid: {
        type: Boolean,
        default: false
    },
    user_feedback_quote: {
        type: Array
    },
    user_feedback_design: {
        type: Array
    },
    manager_feedback_quote: {
        type: Array
    },
}, {timestamps: true})

module.exports = mongoose.model('Request', requestSchema);
