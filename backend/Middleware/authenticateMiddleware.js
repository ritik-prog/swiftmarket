const jwt = require('jsonwebtoken');
const User = require('../models/auth/userSchema');

const authenticateMiddleware = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        // Check if not token
        if (!token) {
            return res.status(403).json({ status: 'error', message: 'Unauthorized: No token provided' });
        }
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

        next();
    } catch (err) {
        return res.status(415).json({ status: 'error', message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateMiddleware;
