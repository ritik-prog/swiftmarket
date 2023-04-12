const mongoose = require("mongoose");

const searchSchema = new mongoose.Schema({
    query: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userIdentifier: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        sessionId: { type: String }
    }
});

const Search = mongoose.model("Search", searchSchema);

module.exports = Search;
