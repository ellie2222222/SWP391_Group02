const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        type: String
    },
    email: {
        type: String
    },
    username: {
        type: String
    },
    access_token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    device_id: {
        type: String
    },
    ip_address: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model("Session", sessionSchema);


