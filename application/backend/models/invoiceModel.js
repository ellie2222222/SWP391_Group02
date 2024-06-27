const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    transaction_id: {
        type: String,
        ref: 'Transaction',
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    payment_gateway: {
        type: String,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);