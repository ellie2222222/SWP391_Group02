const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const materialSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    buy_price: {
        type: Number,
        required: true
    },
    sell_price: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
