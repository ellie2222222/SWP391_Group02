const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const worksOnSchema = new Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    staff_ids: [{
        staff_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: String,
            enum: ['manager', 'sale_staff', 'design_staff', 'production_staff'],
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    endedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('WorksOn', worksOnSchema);
