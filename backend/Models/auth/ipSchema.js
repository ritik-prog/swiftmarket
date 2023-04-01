const mongoose = require('mongoose');

const ipSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    isWhitelisted: { type: Boolean, required: true, default: false },
    isBanned: { type: Boolean, required: true, default: false },
    banExpiresAt: { type: Date, required: false },
    signupCount: { type: Number, default: 0 },
    lastSignupAt: { type: Date, required: true },
});

const Ip = mongoose.model('Ip', ipSchema);

module.exports = Ip