const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);