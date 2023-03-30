const rateLimit = require("express-rate-limit");

// Apply rate limiter middleware
const rateLimiterMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per minute
    message: "Too many requests from this IP, please try again later"
});

module.exports = { rateLimiterMiddleware };
