const jwt = require('jsonwebtoken');
const User = require('../models/auth/userSchema');

const authenticateMiddleware = async (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if not token
    if (!token) {
        return res.status(403).json({ status: 'error', message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if token is blacklisted
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.expiresAt': { $gte: Date.now() }
        });

        if (!user) {
            throw new Error();
        }

        // Set user in the request
        req.user = user;

        if (!req.body.code) {
            // Check user verification status
            if (user.verificationCode && !user.verificationStatus) {
                return res.status(413).json({ status: 'info', message: 'Verification pending', code: 'verification_pending' });
            }
            // Check user verification status
            if (!user.verificationStatus) {
                return res.status(414).json({ status: 'error', message: 'Unauthorized: Email not verified', code: 'unauthorized_email' });
            }
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(415).json({ status: 'error', message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateMiddleware;
