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
                if (banExpiresAt.isAfter(now)) {
                    // Remove ban
                    await existingIp.remove();
                } else {
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    throw new Error({ message: `IP address is banned for ${hours} hours`, banExpiresAt: existingIp.banExpiresAt });
                }
            }
        }
        next();
    } catch (err) {
        res.status(419).send({
            code: 419,
            message: err.message || "Internal Server Error",
            banExpiresAt: err.banExpiresAt
        });
    }
};

module.exports = ipBannedMiddleware;
