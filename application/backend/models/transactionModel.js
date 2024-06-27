const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);