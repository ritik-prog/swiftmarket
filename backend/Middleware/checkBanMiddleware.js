const User = require('../Models/auth/userSchema');
const moment = require('moment');

const checkBanMiddleware = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.BanStatus.isBanned) {
            if (user.BanStatus.banExpiresAt) {
                const banExpiresAt = moment(user.BanStatus.banExpiresAt);
                const now = moment();
                if (now.isAfter(banExpiresAt)) {
                    // Ban has expired, unban the user
                    user.BanStatus.isBanned = false;
                    user.BanStatus.banExpiresAt = null;
                    await user.save();
                } else {
                    // Ban is still in effect
                    const duration = moment.duration(banExpiresAt.diff(now));
                    const hours = duration.asHours().toFixed(2);
                    if (user.tokens.length > 0) {
                        await user.updateOne({ $set: { tokens: [] } });
                    }
                    return res.status(403).json({ error: `You are banned from this service. Time until unban: ${hours} hours` });
                }
            } else {
                // Permanent ban
                // Delete all tokens from the user
                if (user.tokens.length > 0) {
                    await user.updateOne({ $set: { tokens: [] } });
                }
                return res.status(403).json({ error: `You are banned from this service permanently` });
            }
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkBanMiddleware;
