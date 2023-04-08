const Ip = require('../models/auth/ipSchema');
const moment = require('moment');

const ipBannedMiddleware = async (req, res, next) => {
    try {
        const ip = req.ip;
        const existingIp = await Ip.findOne({ address: ip });

        if (existingIp) {
            if (existingIp.isBanned) {
                const banExpiresAt = moment(existingIp.banExpiresAt);
                const now = moment();
                const duration = moment.duration(banExpiresAt.diff(now));
                const hours = duration.asHours().toFixed(2);
                throw new Error(`IP address is banned for ${hours} hours`);
            }
        }
        next();
    } catch (err) {
        res.status(419).send({
            code: 419,
            message: err.message || "Internal Server Error",
        });
    }
};

module.exports = ipBannedMiddleware;
