const rateLimit = require("express-rate-limit");

const whitelist = ['127.0.0.1', '::ffff:127.0.0.1'];
const bannedIps = [];

// Apply rate limiter middleware
const rateLimiterMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per minute
    skip: (req, res) => {
        // Skip rate limiting for requests from whitelisted IPs
        return whitelist.includes(req.ip);
    },
    handler: (req, res) => {
        // Ban the client for 30 minutes
        res.status(429).send('Too many requests. Please try again later.');
        const banExpiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
        const clientIp = req.ip;
        bannedIps[clientIp] = banExpiresAt;
    },
});

module.exports = rateLimiterMiddleware;
