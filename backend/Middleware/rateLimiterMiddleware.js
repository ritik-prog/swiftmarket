const rateLimit = require("express-rate-limit");
const Ip = require('../Models/auth/ipSchema.js');
const moment = require('moment');

const MIN_BAN_TIME = 10 * 60 * 1000; // 10 minutes
const MAX_BAN_TIME = 30 * 60 * 1000; // 30 minutes

const rateLimiterMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per minute
    async keyGenerator(req, res) {
        // Use the client IP address as the key
        const clientIp = req.ip;
        const ip = await Ip.findOne({ address: clientIp });

        // Check if the IP address is whitelisted or banned
        if (ip && ip.isWhitelisted) {
            return null;
        } else if (ip && ip.isBanned && ip.banExpiresAt > Date.now()) {
            const time = moment(ip.banExpiresAt).fromNow().replace(/^in\s+/, '');
            throw new Error(`IP address is banned for ${time}`);
        }

        return clientIp;
    },
    async handler(req, res, next) {
        // Ban the client for a random time between 10-30 minutes
        const clientIp = req.ip;
        const ip = await Ip.findOne({ address: clientIp });

        if (ip && ip.isBanned && ip.banExpiresAt > Date.now()) {
            const time = moment(ip.banExpiresAt).fromNow().replace(/^in\s+/, '');
            throw new Error(`IP address is already banned for ${time}`);
        } else {
            const banExpiresAt = Date.now() + Math.floor(Math.random() * (MAX_BAN_TIME - MIN_BAN_TIME + 1) + MIN_BAN_TIME);
            const updatedIp = await Ip.findOneAndUpdate(
                { address: clientIp },
                { isBanned: true, banExpiresAt },
                { upsert: true, new: true }
            );

            const time = moment(banExpiresAt).fromNow().replace(/^in\s+/, '');
            throw new Error(`Too many requests. Please try again later. IP address is banned for ${time}`);
        }
    },
});

// Error handler middleware to handle errors thrown by rate limiter middleware
function errorHandler(err, req, res, next) {
    if (err) {
        res.status(429).send(err.message);
    } else {
        next();
    }
}

module.exports = [rateLimiterMiddleware, errorHandler];
