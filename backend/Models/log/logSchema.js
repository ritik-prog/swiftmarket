const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    level: { type: String, required: true, immutable: true },
    message: { type: String, required: true, immutable: true },
    timestamp: { type: Date, required: true, immutable: true },
    meta: { type: mongoose.Schema.Types.Mixed, immutable: true },
}, { timestamps: true });

const Log = mongoose.model('logs', logSchema);

module.exports = Log;
