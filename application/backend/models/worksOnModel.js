const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const worksOnSchema = new Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    staff_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    endedAt: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('WorksOn', worksOnSchema);
