const Ip = require('../models/auth/ipSchema');
const rateLimit = require('express-rate-limit');
const moment = require('moment');

const MAX_SIGNUPS_PER_DAY = 5;
const BAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const signupRateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: MAX_SIGNUPS_PER_DAY,
    async keyGenerator(req) {
        const ip = req.ip;
        try {
            const existingIp = await Ip.findOne({ address: ip });

            // Check if the IP is whitelisted or banned
            if (existingIp) {
                if (existingIp.isWhitelisted) {
                    // If the IP is whitelisted, allow the request
                    return null;
                } else if (existingIp.isBanned) {
                    // If the IP is banned, throw an error with the ban duration
                    const banExpiresAt = moment(existingIp.banExpiresAt);
                    const now = moment();
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    throw new Error(`IP address is banned for ${hours} hours`);
                } else if (existingIp.signupCount >= MAX_SIGNUPS_PER_DAY) {
                    // If the IP has reached the daily signup limit, ban the user for 7 days
                    const banExpiresAt = new Date(Date.now() + BAN_DURATION);
                    existingIp.isBanned = true;
                    existingIp.isWhitelisted = false;
                    existingIp.banExpiresAt = banExpiresAt;
                    await existingIp.save();

                    // Return an error response
                    throw new Error(`IP address is banned for 7 days`);
                }
            }
        } catch (err) {
            throw err;
        }

        return ip;
    },
    async handler(req, res, next) {
        const ip = req.ip;
        try {
            const existingIp = await Ip.findOne({ address: ip });
            // Update or create the IP document
            const now = Date.now();
            if (existingIp) {
                // If the IP is already in the database, increment the signup count and update the last signup time
                existingIp.signupCount += 1;
                existingIp.lastSignupAt = now;
                await existingIp.save();
                // Check if the IP has reached the daily signup limit
                if (existingIp.signupCount >= MAX_SIGNUPS_PER_DAY) {
                    // Ban the IP for the specified duration
                    const banExpiresAt = new Date(now + BAN_DURATION);
                    existingIp.isBanned = true;
                    existingIp.isWhitelisted = false;
                    existingIp.banExpiresAt = banExpiresAt;
                    await existingIp.save();

                    // Return an error response
                    throw new Error(`IP address is banned for 7 days`);
                }
            } else {
                // If the IP is not in the database, create a new IP document with the initial signup count and last signup time
                const newIp = new Ip({
                    address: ip,
                    signupCount: 1,
                    lastSignupAt: now,
                });
                await newIp.save();
            }
        } catch (err) {
            throw new Error(err.message || `Internal Server Error`);
        }
        next();
    },
});

// Error handler middleware to handle errors thrown by rate limiter middleware
function errorHandler(err, req, res, next) {
    if (err) {
        const statusCode = 419;
        const message = err.message || 'Internal Server Error';
        res.status(statusCode).json({ status: 'error', code: statusCode, message });
    } else {
        next();
    }
}

module.exports = [signupRateLimiter, errorHandler];
